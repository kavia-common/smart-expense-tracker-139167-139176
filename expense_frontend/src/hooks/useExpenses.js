import { useCallback, useEffect, useMemo, useState } from 'react';
import { createExpense, deleteExpense, getProfile, listExpenses, subscribeRealtime, updateExpense } from '../services/expenseService';
import { useAuth } from '../context/AuthContext';
import { sumBy } from '../utils/math';

// PUBLIC_INTERFACE
export function useExpenses(filters = {}) {
  /**
   * Provides expenses list with CRUD handlers and realtime updates.
   * Filters: from, to, categoryId
   */
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setPending(true);
    setError(null);
    try {
      const data = await listExpenses(user.id, filters);
      setItems(data);
    } catch (e) {
      setError(e.message || 'Failed to fetch expenses');
    } finally {
      setPending(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeRealtime(
      user.id,
      () => fetchData(),
      null
    );
    return () => unsub && unsub();
  }, [user, fetchData]);

  const total = useMemo(() => sumBy(items, (x) => Number(x.amount || 0)), [items]);

  const add = useCallback(async (payload) => {
    if (!user) return;
    await createExpense(user.id, payload);
  }, [user]);

  const update = useCallback(async (id, payload) => {
    await updateExpense(id, payload);
  }, []);

  const remove = useCallback(async (id) => {
    await deleteExpense(id);
  }, []);

  return { items, total, pending, error, refetch: fetchData, add, update, remove };
}
