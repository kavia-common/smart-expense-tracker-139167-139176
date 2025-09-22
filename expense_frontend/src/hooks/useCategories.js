import { useCallback, useEffect, useMemo, useState } from 'react';
import { createCategory, deleteCategory, getProfile, listCategories, subscribeRealtime, updateCategory } from '../services/expenseService';
import { useAuth } from '../context/AuthContext';
import { sumBy } from '../utils/math';
import { useExpenses } from './useExpenses';

// PUBLIC_INTERFACE
export function useCategories() {
  /** Categories list with CRUD and simple computed totals */
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setPending(true);
    setError(null);
    try {
      const data = await listCategories(user.id);
      setItems(data);
    } catch (e) {
      setError(e.message || 'Failed to fetch categories');
    } finally {
      setPending(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeRealtime(
      user.id,
      null,
      () => fetchData()
    );
    return () => unsub && unsub();
  }, [user, fetchData]);

  const totalBudget = useMemo(() => sumBy(items, (x) => Number(x.budget || 0)), [items]);

  const add = useCallback(async (payload) => {
    if (!user) return;
    await createCategory(user.id, payload);
  }, [user]);

  const update = useCallback(async (id, payload) => {
    await updateCategory(id, payload);
  }, []);

  const remove = useCallback(async (id) => {
    await deleteCategory(id);
  }, []);

  return { items, totalBudget, pending, error, refetch: fetchData, add, update, remove };
}
