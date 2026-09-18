-- 在 Supabase Dashboard → SQL Editor 中运行一次。
create table if not exists public.family_data (
  family_id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.family_data enable row level security;

grant select, insert, update on table public.family_data to anon;

drop policy if exists "family data can be read with its opaque id" on public.family_data;
drop policy if exists "family data can be created" on public.family_data;
drop policy if exists "family data can be updated" on public.family_data;

create policy "family data can be read with its opaque id"
on public.family_data for select to anon
using ((current_setting('request.headers', true)::json ->> 'x-family-id') = family_id);

create policy "family data can be created"
on public.family_data for insert to anon
with check ((current_setting('request.headers', true)::json ->> 'x-family-id') = family_id);

create policy "family data can be updated"
on public.family_data for update to anon
using ((current_setting('request.headers', true)::json ->> 'x-family-id') = family_id)
with check ((current_setting('request.headers', true)::json ->> 'x-family-id') = family_id);

-- 安全模型：RLS 只允许请求读取或修改 x-family-id 对应的记录。
-- 应用只传送由高强度家庭口令生成的 SHA-256 标识，不上传口令原文。
-- 请使用至少 8 位、包含字母和数字且不易猜测的家庭口令。
