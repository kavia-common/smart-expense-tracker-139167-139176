export function sumBy(arr, pick) {
  return (arr || []).reduce((acc, x) => acc + Number(pick(x) || 0), 0);
}

export function formatCurrency(v) {
  const n = Number(v || 0);
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}
