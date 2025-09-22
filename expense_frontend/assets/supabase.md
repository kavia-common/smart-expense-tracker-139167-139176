# Supabase Integration (Frontend)

This app uses Supabase for:
- Authentication (email magic link)
- Database (Postgres) tables: categories, expenses
- Realtime (postgres_changes) on expenses/categories
- Storage bucket: receipts (public)

Environment Variables (in .env for this container):
- REACT_APP_SUPABASE_URL=<your-supabase-url>
- REACT_APP_SUPABASE_KEY=<your-anon-public-key>

Schema Expectation:
```sql
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  budget numeric default 0,
  inserted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric not null,
  note text,
  date date not null default now(),
  receipt_url text,
  inserted_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

Policies (RLS):
- Enable RLS on both tables
- Categories: user_id = auth.uid() for select/insert/update/delete
- Expenses: user_id = auth.uid() for select/insert/update/delete

Storage:
- Create bucket 'receipts'
- Set policy to allow authenticated users to upload to their own path: auth.uid()/*
- Make objects publicly readable for quick viewing in app

Auth:
- Magic link sign-in: ensure "Site URL" equals the deployment base URL
- The app uses `emailRedirectTo` set to window.location.origin

Realtime:
- Enable replication for tables `expenses` and `categories` in Supabase Realtime settings.
