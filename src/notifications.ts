import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from './types';

type NotificationEvent = { timestamp: number; message: string };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function buildEvents(tasks: Task[]): NotificationEvent[] {
  const events = new Map<number, string[]>();
  tasks.forEach((task) => {
    const start = new Date(`${task.date}T${task.start}:00`);
    const end = new Date(`${task.date}T${task.end}:00`);
    const previous = tasks.find((candidate) => candidate.date === task.date && candidate.end === task.start);
    if (task.reminderBeforeStart) {
      const timestamp = start.getTime() - 5 * 60 * 1000;
      const message = previous ? `Stop ${previous.title} and start ${task.title}` : `Starting soon: ${task.title}`;
      events.set(timestamp, [...(events.get(timestamp) || []), message]);
    }
    if (task.reminderAtEnd) {
      const timestamp = end.getTime();
      events.set(timestamp, [...(events.get(timestamp) || []), `You can now mark “${task.title}” as completed.`]);
    }
  });
  return Array.from(events.entries()).map(([timestamp, messages]) => ({ timestamp, message: messages.join(' · ') }));
}

export async function scheduleTaskNotifications(tasks: Task[], replaceExisting = false) {
  const events = buildEvents(tasks).filter((event) => event.timestamp > Date.now());
  if (Platform.OS === 'web') {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'granted' && await Notification.requestPermission() !== 'granted') return;
    events.forEach((event) => {
      const delay = event.timestamp - Date.now();
      if (delay > 0) {
        window.setTimeout(() => new Notification('BOXIT reminder', { body: event.message }), delay);
      }
    });
    return;
  }
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted && !(await Notifications.requestPermissionsAsync()).granted) return;
  if (replaceExisting) await Notifications.cancelAllScheduledNotificationsAsync();
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('boxit-reminders', {
      name: 'BOXIT reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
  for (const event of events) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'BOXIT reminder', body: event.message, sound: 'default' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(event.timestamp) },
    });
  }
}
