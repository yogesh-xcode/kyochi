import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getSupabaseOrError } from "@/app/api/_shared/supabase";
import { formatCurrencyINR } from "@/lib/metrics"; // Added import
import { generateId } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Params) {
  const { id: franchiseId } = await context.params;
  const resend = new Resend(process.env.RESEND_API_KEY || "re_123"); // Provide dummy key to avoid build-time crash
  const result = getSupabaseOrError(request);
  if ("error" in result) {
    return result.error;
  }
  const { supabase } = result;

  // Fetch current role from Supabase RPC
  const { data: roleData } = await supabase.rpc("current_app_role");
  const role = roleData === "admin" || roleData === "franchisee" || roleData === "therapist" || roleData === "patient" 
    ? roleData 
    : "admin";

  if (role !== "admin") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    amount: number;
    period_start: string;
    period_end: string;
    due_date?: string;
  };

  const { amount, period_start, period_end, due_date } = body;

  if (!amount || !period_start || !period_end) {
    return NextResponse.json({ message: "Missing required invoice fields." }, { status: 400 });
  }

  const invoiceId = `inv_${generateId()}`;

  // Insert invoice into franchise_invoices table
  const { data: newInvoice, error: invoiceError } = await supabase
    .from("franchise_invoices")
    .insert({
      id: invoiceId,
      franchise_id: franchiseId,
      amount,
      period_start,
      period_end,
      due_date,
      status: "unpaid",
    })
    .select("*")
    .single();

  if (invoiceError) {
    return NextResponse.json({ message: invoiceError.message }, { status: 400 });
  }

  // Get franchisee user details for notification and email
  const { data: franchiseeUser, error: userError } = await supabase
    .from("app_users")
    .select("id, email, full_name")
    .eq("franchise_id", franchiseId)
    .eq("role", "franchisee")
    .single();

  if (userError || !franchiseeUser) {
    console.error(`Could not find franchisee for franchise ID ${franchiseId}:`, userError?.message);
    // Continue without notification/email if user not found, but log error
  } else {
    // Send in-app notification
    const notificationTitle = "New Royalty Invoice";
    const notificationMessage = `A new royalty invoice #${invoiceId} for ${formatCurrencyINR(amount)} is due for period ${period_start} to ${period_end}.`;

    const { error: notificationError } = await supabase.from("notifications").insert({
      id: `notif_${generateId()}`,
      user_id: franchiseeUser.id,
      title: notificationTitle,
      message: notificationMessage,
      time: new Date().toISOString(),
      is_read: false,
    });

    if (notificationError) {
      console.error("Failed to send in-app notification:", notificationError.message);
    }

    // Send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Kyochi <onboarding@resend.dev>", // Replace with your verified Resend email
          to: franchiseeUser.email,
          subject: notificationTitle,
          html: `<p>Dear ${franchiseeUser.full_name},</p>
                 <p>This is to inform you that a new royalty invoice (#${invoiceId}) has been generated for your franchise.</p>
                 <p><strong>Amount Due:</strong> ${formatCurrencyINR(amount)}</p>
                 <p><strong>Billing Period:</strong> ${period_start} to ${period_end}</p>
                 ${due_date ? `<p><strong>Due Date:</strong> ${due_date}</p>` : ""}
                 <p>Please log in to your Kyochi dashboard to view and manage your invoices.</p>
                 <p>Thank you,</p>
                 <p>The Kyochi Team</p>`,
        });
      } catch (emailError) {
        console.error("Failed to send email via Resend:", emailError);
      }
    } else {
      console.warn("RESEND_API_KEY is not set. Skipping email notification.");
    }
  }

  return NextResponse.json(newInvoice, { status: 201 });
}