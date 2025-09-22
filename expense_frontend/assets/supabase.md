# Supabase Integration (Frontend + Backend Config)

This app uses Supabase for:
- Authentication (email magic link)
- Database (Postgres) tables: categories, expenses
- Realtime (postgres_changes) on expenses/categories
- Storage bucket: receipts (public)

Environment Variables (in .env for this container):
- REACT_APP_SUPABASE_URL=<your-supabase-url>
- REACT_APP_SUPABASE_KEY=<your-anon-public-key>

Backend setup performed by agent:
1) Tables created:
   - public.categories: id uuid PK default gen_random_uuid(), user_id uuid not null, name text not null, budget numeric default 0, inserted_at timestamptz default now(), updated_at timestamptz default now()
   - public.expenses: id uuid PK default gen_random_uuid(), user_id uuid not null, category_id uuid null FK -> categories(id) on delete set null, amount numeric not null, note text, date date not null default now(), receipt_url text, inserted_at timestamptz default now(), updated_at timestamptz default now()
   - Ensured PK on categories.id and FK on expenses.category_id established
2) RLS enabled:
   - alter table public.categories enable row level security;
   - alter table public.expenses enable row level security;
3) RLS policies created (idempotently):
   - Categories: select/insert/update/delete allowed when user_id = auth.uid()
   - Expenses: select/insert/update/delete allowed when user_id = auth.uid()
4) Realtime publication:
   - Added public.categories and public.expenses to publication supabase_realtime
5) Storage bucket:
   - Ensured receipts bucket exists (public: true)
   - Note: Storage object policies require elevated privileges. See manual step below.

Manual steps required (project owner only):
- Storage Object Policies (needs owner privileges to modify storage.objects):
  - Public read for receipts:
    create policy "Public read receipts" on storage.objects for select using (bucket_id = 'receipts');
  - Authenticated users can write/update/delete only within their own folder (path starts with auth.uid()):
    create policy "Users can upload to own folder" on storage.objects for insert with check (bucket_id = 'receipts' and position(auth.uid()::text || '/' in name) = 1);
    create policy "Users can update own objects" on storage.objects for update using (bucket_id = 'receipts' and position(auth.uid()::text || '/' in name) = 1);
    create policy "Users can delete own objects" on storage.objects for delete using (bucket_id = 'receipts' and position(auth.uid()::text || '/' in name) = 1);
- If your project uses Postgres < 14 and gen_random_uuid() is not available, enable pgcrypto extension.

Schema (reference):
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

Auth and Redirects:
- In Supabase Dashboard > Authentication > URL Configuration
  - Site URL: set to your deployment base URL (e.g., http://localhost:3000 for dev)
  - Additional Redirect URLs: http://localhost:3000/** and your production domain /**
- The app uses window.location.origin for magic-link redirects.

Realtime:
- Tables expenses and categories are added to supabase_realtime publication. Ensure Realtime is enabled in Database > Replication if needed.

Testing checklist:
- Sign in with magic link works (emailRedirectTo points to window.location.origin)
- CRUD on categories/expenses authorized only for the authenticated user
- Realtime updates reflect inserts/updates/deletes
- Receipt upload works; objects are publicly viewable (after storage policies are set)
- Environment variables present: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY
