import { format, parseISO } from 'date-fns';

export function toISODateInput(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

export function displayDate(d) {
  try {
    const val = typeof d === 'string' ? parseISO(d) : d;
    return format(val, 'MMM d, yyyy');
  } catch {
    return String(d);
  }
}
