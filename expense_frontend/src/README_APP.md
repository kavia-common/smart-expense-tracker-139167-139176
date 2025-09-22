# Ocean Professional Expense Tracker (Frontend)

This React app implements a smart expense tracker with:
- Supabase Auth (email magic link)
- Real-time expenses and categories
- Budget and category management
- Receipt uploads using Supabase Storage (bucket: receipts)
- Dashboard, Insights charts (Recharts)
- Ocean Professional dark theme

Environment variables (must be set in .env):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- Optional: REACT_APP_SITE_URL (used for auth redirect base; otherwise window.location.origin)

Project structure:
- src/services: supabase client and domain services
- src/context: auth provider
- src/hooks: reusable hooks for expenses/categories
- src/components: layout and common components (Sidebar, Header, Modal, Charts)
- src/pages: Dashboard, Expenses, Categories, Insights, Receipts
- src/styles: theme and layout CSS

Tables expected (public schema):
- categories(id uuid PK, user_id uuid, name text, budget numeric)
- expenses(id uuid PK, user_id uuid, category_id uuid, amount numeric, note text, date date, receipt_url text)
Storage:
- bucket 'receipts' (public access for viewing receipts)

Notes:
- All mutating operations are scoped to the authenticated user_id.
- Realtime subscriptions auto-refresh the UI when data changes.
