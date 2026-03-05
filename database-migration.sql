-- CodeAlchemist Database Schema Migration
-- Run this in Supabase SQL Editor

-- Core Better Auth tables
create table if not exists "user" (
  id text primary key,
  name text not null,
  email text not null unique,
  "emailVerified" boolean not null default false,
  image text,
  "createdAt" timestamp not null default now(),
  "updatedAt" timestamp not null default now()
);

create table if not exists "session" (
  id text primary key,
  "expiresAt" timestamp not null,
  token text not null unique,
  "createdAt" timestamp not null default now(),
  "updatedAt" timestamp not null default now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references "user"(id) on delete cascade
);

create table if not exists "account" (
  id text primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references "user"(id) on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp,
  "refreshTokenExpiresAt" timestamp,
  scope text,
  password text,
  "createdAt" timestamp not null default now(),
  "updatedAt" timestamp not null default now()
);

create table if not exists "verification" (
  id text primary key,
  identifier text not null,
  value text not null,
  "expiresAt" timestamp not null,
  "createdAt" timestamp default now(),
  "updatedAt" timestamp default now()
);

-- App-specific tables
create table if not exists "user_progress" (
  id text primary key default gen_random_uuid()::text,
  "userId" text not null references "user"(id) on delete cascade,
  "chapterId" text not null,
  "exerciseId" text not null,
  language text not null check (language in ('python', 'rust', 'typescript')),
  completed boolean not null default false,
  "completedAt" timestamp,
  "createdAt" timestamp not null default now(),
  "updatedAt" timestamp not null default now(),
  unique("userId", "chapterId", "exerciseId", language)
);

create table if not exists "user_stats" (
  id text primary key default gen_random_uuid()::text,
  "userId" text not null references "user"(id) on delete cascade unique,
  xp integer not null default 0,
  streak integer not null default 0,
  "lastActivityAt" timestamp,
  "createdAt" timestamp not null default now(),
  "updatedAt" timestamp not null default now()
);

create table if not exists "submission" (
  id text primary key default gen_random_uuid()::text,
  "userId" text not null references "user"(id) on delete cascade,
  "exerciseId" text not null,
  language text not null,
  code text not null,
  output text,
  success boolean not null default false,
  "executionMs" integer,
  "createdAt" timestamp not null default now()
);

-- RLS: enable on all tables
alter table "user" enable row level security;
alter table "session" enable row level security;
alter table "account" enable row level security;
alter table "verification" enable row level security;
alter table "user_progress" enable row level security;
alter table "user_stats" enable row level security;
alter table "submission" enable row level security;

-- RLS policies (service role / server bypasses via DATABASE_URL direct connection)
create policy "users_own_progress" on "user_progress"
  for all using (auth.uid()::text = "userId");

create policy "users_own_stats" on "user_stats"
  for all using (auth.uid()::text = "userId");

create policy "users_own_submissions" on "submission"
  for all using (auth.uid()::text = "userId");

-- Indexes for performance
create index if not exists idx_user_progress_user on "user_progress"("userId");
create index if not exists idx_submission_user on "submission"("userId");
create index if not exists idx_session_token on "session"(token);
create index if not exists idx_session_user on "session"("userId");