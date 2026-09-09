-- Bootstrap invitations are issued by the project owner, never by a browser.
create table public.kq_setup_invites (
 token_hash text primary key check (token_hash ~ '^[a-f0-9]{64}$'),
 class_code text not null unique check (class_code ~ '^[a-z0-9]{6}$'),
 expires_at timestamptz not null,
 consumed_at timestamptz
);
alter table public.kq_setup_invites enable row level security;
revoke all on public.kq_setup_invites from public, anon, authenticated;
grant all on public.kq_setup_invites to service_role;
