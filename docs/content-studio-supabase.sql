create table if not exists public.content_generations (
  id uuid primary key,
  title text not null,
  hook text not null,
  slides jsonb not null default '[]'::jsonb,
  caption text not null,
  hashtags text[] not null default '{}',
  cta text not null,
  canva_brief text not null,
  status text not null default 'draft' check (status in ('draft', 'approved', 'posted')),
  brief jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_generations_created_at_idx
  on public.content_generations (created_at desc);

create index if not exists content_generations_status_idx
  on public.content_generations (status);

alter table public.content_generations enable row level security;
