import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { today } from './data';
import { Task, UserState } from './types';

const userDefaults: UserState = { name: '', tutorialSeen: false, streak: 0, lastStreakDate: null, failedStreakDate: null, language: 'en' };
const browserKey = 'boxit-state-v2';

type PersistedState = { tasks: Task[]; user: UserState };

function normalizeTasks(tasks: Task[]) {
  return tasks.filter((task) => !(['1', '2', '3', '4'].includes(task.id) && ['Morning movement', 'Deep work', 'Lunch break', 'Read'].includes(task.title))).map((task) => ({
    ...task,
    date: task.date || today(),
    reminderBeforeStart: task.reminderBeforeStart ?? true,
    reminderAtEnd: task.reminderAtEnd ?? true,
  }));
}

function browserState(): PersistedState {
  if (Platform.OS !== 'web' || typeof localStorage === 'undefined') return { tasks: [], user: userDefaults };
  const saved = localStorage.getItem(browserKey);
  if (!saved) return { tasks: [], user: userDefaults };
  const parsed = JSON.parse(saved) as PersistedState;
  return { tasks: normalizeTasks(parsed.tasks), user: { ...userDefaults, ...parsed.user } };
}

function saveBrowser(state: PersistedState) {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') localStorage.setItem(browserKey, JSON.stringify(state));
}

let database: SQLite.SQLiteDatabase | null = null;
function nativeDatabase() {
  if (!database) {
    database = SQLite.openDatabaseSync('boxit.db');
    database.execSync(`CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);`);
  }
  return database;
}

export async function loadState(): Promise<PersistedState> {
  if (Platform.OS === 'web') return browserState();
  const db = nativeDatabase();
  const rows = db.getAllSync<{ id: string; data: string }>('SELECT id, data FROM tasks');
  const userRows = db.getAllSync<{ key: string; value: string }>('SELECT key, value FROM app_state');
  const tasks = normalizeTasks(rows.map((row) => JSON.parse(row.data) as Task));
  const user = userRows.length ? JSON.parse(userRows.find((row) => row.key === 'user')?.value || JSON.stringify(userDefaults)) as UserState : userDefaults;
  return { tasks, user };
}

export async function saveState(state: PersistedState) {
  if (Platform.OS === 'web') {
    saveBrowser(state);
    return;
  }

  const db = nativeDatabase();
  db.withTransactionSync(() => {
    db.runSync('DELETE FROM tasks');
    state.tasks.forEach((task) => db.runSync('INSERT INTO tasks (id, data) VALUES (?, ?)', task.id, JSON.stringify(task)));
    db.runSync('INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)', 'user', JSON.stringify(state.user));
  });
}

export async function clearState() {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(browserKey);
    return;
  }
  const db = nativeDatabase();
  db.withTransactionSync(() => {
    db.runSync('DELETE FROM tasks');
    db.runSync('DELETE FROM app_state');
  });
}

export function initialState(): PersistedState {
  return { tasks: [], user: userDefaults };
}

export function dateForOffset(offset: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString('en-CA');
}

export function isToday(task: Task) {
  return task.date === today();
}
