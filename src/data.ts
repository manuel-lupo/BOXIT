import { COLORS } from './theme';
import { Priority, Task } from './types';

export function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function today() {
  return dateKey(new Date());
}

export function daysFromToday() {
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index - 1);
    return { label: date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase(), date: date.getDate().toString(), offset: index - 1, key: dateKey(date) };
  });
}

export const priorityColors: Record<Priority, string> = {
  Low: COLORS.orange,
  Focus: COLORS.blue,
  High: COLORS.purple,
  Critical: COLORS.danger,
};

export function duration(start: string, end: string) {
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);
  const minutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  return `${Math.floor(minutes / 60) ? `${Math.floor(minutes / 60)}h ` : ''}${minutes % 60 ? `${minutes % 60}m` : ''}`.trim();
}

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function minutesForTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export function hasTaskStarted(task: Pick<Task, 'date' | 'start'>, now = new Date()) {
  if (task.date < localDateKey(now)) return true;
  if (task.date > localDateKey(now)) return false;
  return now.getHours() * 60 + now.getMinutes() >= minutesForTime(task.start);
}

export function hasTaskEnded(task: Pick<Task, 'date' | 'end'>, now = new Date()) {
  if (task.date < localDateKey(now)) return true;
  if (task.date > localDateKey(now)) return false;
  return now.getHours() * 60 + now.getMinutes() >= minutesForTime(task.end);
}
