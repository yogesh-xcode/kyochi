create table if not exists public.franchise_invoices (
  id text primary key,
  franchise_id text not null references public.franchises(id) on update cascade,
  amount numeric not null,
  period_start date not null,
  period_end date not null,
  status text not null default 'unpaid' check (status in ('unpaid', 'paid')),
  created_at timestamptz not null default now(),
  due_date date null
);

alter table public.franchise_invoices enable row security;

create policy "Admins can view and manage franchise invoices" on public.franchise_invoices
for all using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');

create policy "Franchisees can view their own invoices" on public.franchise_invoices
for select using (public.current_app_role() = 'franchisee' and franchise_id = public.current_app_franchise_id());