export type Priority = 'Low' | 'Focus' | 'High' | 'Critical';
export type TaskStatus = 'planned' | 'completed' | 'skipped';

export type Task = {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  priority: Priority;
  color: string;
  status: TaskStatus;
  date: string;
  reminderBeforeStart: boolean;
  reminderAtEnd: boolean;
  recurrenceDays?: number[];
  recurrenceEndDate?: string | null;
};

export type UserState = {
  name: string;
  tutorialSeen: boolean;
  streak: number;
  lastStreakDate: string | null;
  failedStreakDate: string | null;
};

export type TaskDraft = Omit<Task, 'id' | 'status'>;
