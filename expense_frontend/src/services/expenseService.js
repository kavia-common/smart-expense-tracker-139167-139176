import supabase from './supabaseClient';

/**
Tables expected:
- categories: id uuid PK, user_id uuid, name text, budget numeric default 0
- expenses: id uuid PK, user_id uuid, category_id uuid, amount numeric, note text, date date, receipt_url text
Storage:
- bucket 'receipts'
*/

const EXPENSES_TABLE = 'expenses';
const CATEGORIES_TABLE = 'categories';
const RECEIPTS_BUCKET = 'receipts';

// PUBLIC_INTERFACE
export async function getProfile() {
  /** Get the current user profile data required (user id) */
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// PUBLIC_INTERFACE
export async function listCategories(userId) {
  /** List categories scoped to user */
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true });
  if (error) throw error;
  return data || [];
}

// PUBLIC_INTERFACE
export async function createCategory(userId, payload) {
  /** Create category { name, budget } */
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .insert([{ user_id: userId, name: payload.name, budget: payload.budget || 0 }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function updateCategory(id, payload) {
  /** Update category by id */
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function deleteCategory(id) {
  /** Delete category by id (consider FK constraints in DB) */
  const { error } = await supabase
    .from(CATEGORIES_TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

// PUBLIC_INTERFACE
export async function listExpenses(userId, { from, to, categoryId } = {}) {
  /** List expenses with optional filters */
  let query = supabase.from(EXPENSES_TABLE).select('*, categories(name, budget)').eq('user_id', userId);

  if (from) query = query.gte('date', from);
  if (to) query = query.lte('date', to);
  if (categoryId) query = query.eq('category_id', categoryId);

  query = query.order('date', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// PUBLIC_INTERFACE
export async function createExpense(userId, payload) {
  /** Create an expense { amount, note, date, category_id, receipt_url? } */
  const { data, error } = await supabase
    .from(EXPENSES_TABLE)
    .insert([{ user_id: userId, ...payload }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function updateExpense(id, payload) {
  /** Update expense by id */
  const { data, error } = await supabase
    .from(EXPENSES_TABLE)
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function deleteExpense(id) {
  /** Delete expense by id */
  const { error } = await supabase
    .from(EXPENSES_TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

// PUBLIC_INTERFACE
export async function uploadReceipt(userId, file) {
  /**
   * Upload a receipt to Supabase Storage and return the public URL.
   * File will be stored under {userId}/{timestamp_filename}
   */
  let uid = userId;
  if (!uid) {
    const { data: { user } } = await supabase.auth.getUser();
    uid = user?.id;
  }
  if (!uid) throw new Error('User not authenticated');

  const ext = (file.name?.split('.').pop() || 'bin').toLowerCase();
  const path = `${uid}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(RECEIPTS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(RECEIPTS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// PUBLIC_INTERFACE
export function subscribeRealtime(userId, onExpenseChange, onCategoryChange) {
  /**
   * Subscribe to realtime changes for expenses and categories for given user.
   * Returns a cleanup function to unsubscribe.
   */
  const channel = supabase
    .channel(`realtime-user-${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: EXPENSES_TABLE, filter: `user_id=eq.${userId}` }, (payload) => {
      onExpenseChange && onExpenseChange(payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: CATEGORIES_TABLE, filter: `user_id=eq.${userId}` }, (payload) => {
      onCategoryChange && onCategoryChange(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
