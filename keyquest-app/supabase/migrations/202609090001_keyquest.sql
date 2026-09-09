begin;
create table public.kq_teachers (
 user_id uuid primary key references auth.users(id) on delete cascade,
 name text not null check(char_length(name) between 1 and 80),
 class_code text not null unique check(class_code ~ '^[a-z0-9]{6}$')
);
create table public.kq_learners (
 id uuid primary key default gen_random_uuid(),
 owner uuid not null references public.kq_teachers(user_id) on delete cascade,
 user_id uuid not null unique references auth.users(id) on delete cascade,
 name text not null check(char_length(name) between 1 and 40),
 created timestamptz not null default now()
);
create index kq_learners_owner on public.kq_learners(owner);
create table public.kq_sessions (
 id uuid primary key,
 learner uuid not null references public.kq_learners(id) on delete cascade,
 lesson integer not null check(lesson between 1 and 50),
 payload jsonb not null check(jsonb_typeof(payload)='object' and octet_length(payload::text)<40000),
 created timestamptz not null default now()
);
create index kq_sessions_learner_created on public.kq_sessions(learner,created);
alter table public.kq_teachers enable row level security;
alter table public.kq_learners enable row level security;
alter table public.kq_sessions enable row level security;
revoke all on public.kq_teachers,public.kq_learners,public.kq_sessions from anon,authenticated;
grant select on public.kq_teachers,public.kq_learners,public.kq_sessions to authenticated;
grant insert on public.kq_sessions to authenticated;
grant all on public.kq_teachers,public.kq_learners,public.kq_sessions to service_role;
create policy own_teacher on public.kq_teachers for select to authenticated using(user_id=(select auth.uid()));
create policy own_profile on public.kq_learners for select to authenticated using(user_id=(select auth.uid()) or owner=(select auth.uid()));
create policy own_results on public.kq_sessions for select to authenticated using(exists(select 1 from public.kq_learners l where l.id=learner and (l.user_id=(select auth.uid()) or l.owner=(select auth.uid()))));
create policy save_own_results on public.kq_sessions for insert to authenticated with check(exists(select 1 from public.kq_learners l where l.id=learner and (l.user_id=(select auth.uid()) or l.owner=(select auth.uid()))));
-- No client grants for creating students, changing roles, editing, or deleting results.
commit;
