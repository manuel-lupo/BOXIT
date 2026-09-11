import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, AppState, Modal, Pressable, SafeAreaView, Text, View } from 'react-native';
import { Composer } from './src/components/Composer';
import { HomeScreen } from './src/components/HomeScreen';
import { HistoryScreen } from './src/components/HistoryScreen';
import { SettingsScreen } from './src/components/SettingsScreen';
import { OnboardingScreen } from './src/components/OnboardingScreen';
import { PrimaryButton } from './src/components/PrimaryButton';
import { TaskDetailScreen } from './src/components/TaskDetailScreen';
import { TutorialOverlay } from './src/components/TutorialOverlay';
import { styles } from './src/theme';
import { hasTaskEnded, hasTaskStarted, localDateKey, minutesForTime } from './src/data';
import { loadState, initialState, saveState } from './src/storage';
import { Task, TaskDraft } from './src/types';
import { scheduleTaskNotifications } from './src/notifications';

function buildOccurrences(task: Omit<Task, 'id' | 'status'>) {
  const result: Omit<Task, 'id' | 'status'>[] = [];
  const start = new Date(`${task.date}T12:00:00`);
  const requestedEnd = task.recurrenceEndDate ? new Date(`${task.recurrenceEndDate}T12:00:00`) : null;
  const end = requestedEnd && !Number.isNaN(requestedEnd.getTime()) ? requestedEnd : new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000);
  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
    if (task.recurrenceDays?.includes(cursor.getDay())) {
      const date = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      result.push({ ...task, date });
    }
  }
  return result;
}

export default function App() {
  const [name, setName] = useState('');
  const [onboarding, setOnboarding] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState<string | null>(null);
  const [failedStreakDate, setFailedStreakDate] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [composerDate, setComposerDate] = useState<string | undefined>();

  useEffect(() => {
    loadState().then((state) => {
      setTasks(state.tasks);
      setName(state.user.name);
      setStreak(state.user.streak);
      setLastStreakDate(state.user.lastStreakDate);
      setFailedStreakDate(state.user.failedStreakDate);
      setOnboarding(!state.user.name);
      setShowTutorial(Boolean(state.user.name && !state.user.tutorialSeen));
      setReady(true);
      void scheduleTaskNotifications(state.tasks, true);
    }).catch((error) => {
      console.error('Unable to load BOXIT data', error);
      const state = initialState();
      setTasks(state.tasks);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    const refresh = () => setTasks((items) => [...items]);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState({ tasks, user: { name, tutorialSeen: !showTutorial, streak, lastStreakDate, failedStreakDate } }).catch((error) => console.error('Unable to save BOXIT data', error));
  }, [ready, tasks, name, showTutorial, streak, lastStreakDate, failedStreakDate]);

  const completeOnboarding = (userName: string) => {
    setName(userName);
    setOnboarding(false);
    setShowTutorial(true);
  };

  const toggleTask = (task: Task) => {
    if (task.status === 'completed' || !hasTaskEnded(task)) return;
    const nextTasks = tasks.map((item) => item.id === task.id
      ? { ...item, status: 'completed' as Task['status'] }
      : item);
    setTasks(nextTasks);
    if (selectedTask?.id === task.id) setSelectedTask(nextTasks.find((item) => item.id === task.id) || null);
    const todayTasks = nextTasks.filter((item) => item.date === task.date);
    if (todayTasks.length > 0 && todayTasks.every((item) => item.status === 'completed') && lastStreakDate !== task.date && failedStreakDate !== task.date) {
      setStreak((value) => value + 1);
      setLastStreakDate(task.date);
    }
  };

  const saveTask = (draft: TaskDraft) => {
    const conflict = tasks.some((item) => item.id !== editingTask?.id && item.date === draft.date && overlaps(item, draft));
    if (conflict) {
      Alert.alert('Time-box overlaps', 'Choose a time that does not overlap another box on this day.');
      return;
    }
    if (editingTask) {
      const updated = { ...editingTask, ...draft };
      setTasks((items) => items.map((item) => item.id === editingTask.id ? updated : item));
      void scheduleTaskNotifications([updated]);
      setEditingTask(null);
      return;
    }
    addTask(draft);
  };

  const canEditTask = (task: Task) => !hasTaskStarted(task) && task.status === 'planned';

  const skipTask = (task: Task) => {
    setTasks((items) => items.map((item) => item.id === task.id ? { ...item, status: 'skipped' } : item));
    if (task.priority === 'High' || task.priority === 'Critical') {
      setStreak(0);
      setFailedStreakDate(task.date);
    }
    setSelectedTask(null);
  };

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    if (tasks.some((item) => item.date === task.date && overlaps(item, task))) {
      Alert.alert('Time-box overlaps', 'Choose a time that does not overlap another box on this day.');
      return;
    }
    const occurrences = task.recurrenceDays?.length ? buildOccurrences(task) : [task];
    const newTasks = occurrences.map((occurrence, index): Task => ({ ...occurrence, id: `${Date.now()}-${index}`, status: 'planned' }));
    setTasks((items) => [...items, ...newTasks]);
    const todayKey = localDateKey(new Date());
    if (newTasks.some((item) => item.date === todayKey) && lastStreakDate === todayKey) {
      setStreak((value) => Math.max(0, value - 1));
      setLastStreakDate(null);
    }
    void scheduleTaskNotifications(newTasks);
    setShowComposer(false);
    setComposerDate(undefined);
  };

  if (!ready) return <SafeAreaView style={styles.safeArea}><StatusBar style="light" /></SafeAreaView>;

  if (onboarding) {
    return <SafeAreaView style={styles.safeArea}><StatusBar style="light" /><OnboardingScreen onComplete={completeOnboarding} /></SafeAreaView>;
  }

  if (selectedTask) {
    return <SafeAreaView style={styles.safeArea}><StatusBar style="light" /><TaskDetailScreen task={selectedTask} streak={streak} onBack={() => setSelectedTask(null)} onToggle={() => toggleTask(selectedTask)} onSkip={() => skipTask(selectedTask)} onEdit={() => { if (canEditTask(selectedTask)) { setEditingTask(selectedTask); setSelectedTask(null); } }} /></SafeAreaView>;
  }

  if (showComposer || editingTask) {
    return <SafeAreaView style={styles.safeArea}><StatusBar style="light" /><Composer defaultDate={composerDate} initialTask={editingTask || undefined} onClose={() => { setShowComposer(false); setEditingTask(null); setComposerDate(undefined); }} onSave={saveTask} /></SafeAreaView>;
  }

  function overlaps(a: Pick<Task, 'start' | 'end'>, b: Pick<Task, 'start' | 'end'>) {
    return minutesForTime(a.start) < minutesForTime(b.end) && minutesForTime(b.start) < minutesForTime(a.end);
  }

  if (showHistory) {
    return <SafeAreaView style={styles.safeArea}><StatusBar style="light" /><HistoryScreen tasks={tasks} onBack={() => setShowHistory(false)} /></SafeAreaView>;
  }

  if (showSettings) {
    return <SafeAreaView style={styles.safeArea}><StatusBar style="light" /><SettingsScreen onBack={() => setShowSettings(false)} onReset={() => { setName(''); setTasks([]); setStreak(0); setLastStreakDate(null); setFailedStreakDate(null); setShowSettings(false); setOnboarding(true); }} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <HomeScreen name={name} tasks={tasks} streak={streak} selectedDay={selectedDay} onDayChange={setSelectedDay} onTaskPress={setSelectedTask} onTaskToggle={toggleTask} onAdd={(date) => { setComposerDate(date); setShowComposer(true); }} onProfile={() => setShowProfile(true)} />
      {showTutorial && <TutorialOverlay onDone={() => setShowTutorial(false)} />}
      <Modal visible={showProfile} animationType="slide" transparent onRequestClose={() => setShowProfile(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000099' }}>
          <View style={styles.profileSheet}>
            <Text style={styles.eyebrow}>YOUR BOXIT</Text>
            <Text style={styles.profileTitle}>{name || 'Friend'}</Text>
            <Text style={styles.profileCopy}>Keep showing up. Small boxes become big momentum.</Text>
            <Pressable style={{ marginTop: 25 }} onPress={() => { setShowProfile(false); setShowHistory(true); }}><Text style={styles.addText}>View your history →</Text></Pressable>
            <Pressable style={{ marginTop: 18 }} onPress={() => { setShowProfile(false); setShowSettings(true); }}><Text style={styles.addText}>Settings →</Text></Pressable>
            <PrimaryButton label="Done" onPress={() => setShowProfile(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
