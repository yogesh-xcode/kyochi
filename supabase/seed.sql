begin;

insert into public.franchises (id, name, city, region, address, phone, whatsapp) values
('FR01', 'Kyochi Anna Nagar', 'Chennai', 'South', '12 Wellness Street, Anna Nagar', '+91-9000000001', '+91-9000000001')
on conflict (id) do update set
name = excluded.name,
city = excluded.city,
region = excluded.region,
address = excluded.address,
phone = excluded.phone,
whatsapp = excluded.whatsapp;

insert into public.therapies (id, name, category, duration_min, session_count, price, status, description) values
('THP01', 'Chronic Pain Reflexology', 'Reflexology', 45, 1, 1500, 'active', 'Targeted reflexology session for chronic pain management.')
on conflict (id) do update set
name = excluded.name,
category = excluded.category,
duration_min = excluded.duration_min,
session_count = excluded.session_count,
price = excluded.price,
status = excluded.status,
description = excluded.description;

insert into public.therapists (id, franchise_id, full_name, email, specialty, license_no, status) values
('THR01', 'FR01', 'Dr. Aris Menon', 'aris@kyochi.example', 'Reflexology', 'TN-THER-001', 'active')
on conflict (id) do update set
franchise_id = excluded.franchise_id,
full_name = excluded.full_name,
email = excluded.email,
specialty = excluded.specialty,
license_no = excluded.license_no,
status = excluded.status;

insert into public.patients (id, franchise_id, full_name, email, phone, dob, wellness_score, status) values
('PAT01', 'FR01', 'Dhinesh Kumar', 'dhinesh@kyochi.example', '+91-9000000101', '1993-05-12', 0, 'active')
on conflict (id) do update set
franchise_id = excluded.franchise_id,
full_name = excluded.full_name,
email = excluded.email,
phone = excluded.phone,
dob = excluded.dob,
wellness_score = excluded.wellness_score,
status = excluded.status;

insert into public.appointments (id, franchise_id, patient_id, therapist_id, therapy_id, starts_at, status) values
('AP01', 'FR01', 'PAT01', 'THR01', 'THP01', '2026-03-21T09:00:00+05:30', 'waiting')
on conflict (id) do update set
franchise_id = excluded.franchise_id,
patient_id = excluded.patient_id,
therapist_id = excluded.therapist_id,
therapy_id = excluded.therapy_id,
starts_at = excluded.starts_at,
status = excluded.status;

insert into public.billing (id, appointment_id, franchise_id, patient_id, amount, currency, due_date, status) values
('INV01', 'AP01', 'FR01', 'PAT01', 1500, 'USD', '2026-04-20', 'unpaid')
on conflict (id) do update set
appointment_id = excluded.appointment_id,
franchise_id = excluded.franchise_id,
patient_id = excluded.patient_id,
amount = excluded.amount,
currency = excluded.currency,
due_date = excluded.due_date,
status = excluded.status;

insert into public.feedback (id, appointment_id, franchise_id, patient_id, therapist_id, invoice_id, session_date, rating, status, notes, submitted_at) values
('FDBK01', 'AP01', 'FR01', 'PAT01', 'THR01', null, '2026-03-21T09:00:00+05:30', null, 'pending', null, null)
on conflict (id) do update set
appointment_id = excluded.appointment_id,
franchise_id = excluded.franchise_id,
patient_id = excluded.patient_id,
therapist_id = excluded.therapist_id,
invoice_id = excluded.invoice_id,
session_date = excluded.session_date,
rating = excluded.rating,
status = excluded.status,
notes = excluded.notes,
submitted_at = excluded.submitted_at;

insert into public.app_users (id, full_name, email, role, status, franchise_id, therapist_id) values
('USR01', 'Alex Kyochi', 'alex@kyochi.example', 'admin', 'active', null, null),
('USR02', 'Nila Franchise', 'nila.franchise@kyochi.example', 'franchisee', 'active', 'FR01', null),
('USR03', 'Dr. Aris Menon', 'aris@kyochi.example', 'therapist', 'active', 'FR01', 'THR01')
on conflict (id) do update set
full_name = excluded.full_name,
email = excluded.email,
role = excluded.role,
status = excluded.status,
franchise_id = excluded.franchise_id,
therapist_id = excluded.therapist_id;

insert into public.notifications (id, title, message, time, is_read) values
('NTF01', 'Welcome', 'Kyochi system is ready.', 'just now', false)
on conflict (id) do update set
title = excluded.title,
message = excluded.message,
time = excluded.time,
is_read = excluded.is_read;

commit;
