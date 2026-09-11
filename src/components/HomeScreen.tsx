import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { daysFromToday } from '../data';
import { COLORS, styles } from '../theme';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { useLanguage } from '../i18n';

function hasEnded(task: Task) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  if (task.date !== today) return true;
  const [hours, minutes] = task.end.split(':').map(Number);
  return now.getHours() * 60 + now.getMinutes() >= hours * 60 + minutes;
}

function timing(task: Task, now: Date) {
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const [startHours, startMinutes] = task.start.split(':').map(Number);
  const [endHours, endMinutes] = task.end.split(':').map(Number);
  const start = startHours * 60 + startMinutes;
  const end = endHours * 60 + endMinutes;
  const current = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  if (task.date !== today || current < start) return { canComplete: false, progress: 0 };
  if (current >= end) return { canComplete: true, progress: 1 };
  return { canComplete: false, progress: Math.max(0, (current - start) / (end - start)) };
}

export function HomeScreen({ name, tasks, streak, selectedDay, onDayChange, onTaskPress, onTaskToggle, onAdd, onProfile }: { name: string; tasks: Task[]; streak: number; selectedDay: number; onDayChange: (index: number) => void; onTaskPress: (task: Task) => void; onTaskToggle: (task: Task) => void; onAdd: (date: string) => void; onProfile: () => void }) {
  const [now, setNow] = useState(() => new Date());
  const { t } = useLanguage();
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const days = daysFromToday();
  const currentDay = days[selectedDay];
  const todayLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
  const visibleTasks = tasks.filter((task) => task.date === currentDay.key);
  const completed = visibleTasks.filter((task) => task.status === 'completed').length;
  const progress = visibleTasks.length ? Math.round((completed / visibleTasks.length) * 100) : 0;
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View><Text style={styles.eyebrow}>{todayLabel}</Text><Text style={styles.greeting}>{t('goodMorning', { name: name || 'friend' })}</Text></View><Pressable accessibilityLabel={t('profile')} style={styles.avatar} onPress={onProfile}><Text style={styles.avatarText}>{(name[0] || 'B').toUpperCase()}</Text></Pressable></View>
      <View style={styles.statsRow}><View style={styles.statCard}><Text style={styles.statLabel}>{t('todayScore')}</Text><Text style={styles.statValue}>{progress}<Text style={styles.statUnit}>%</Text></Text><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View></View><View style={styles.statCard}><Text style={styles.statLabel}>{t('currentStreak')}</Text><Text style={styles.statValue}>{streak} <Text style={styles.flame}>✦</Text></Text><Text style={styles.statHint}>{t('daysInRow')}</Text></View></View>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{t('day')}</Text><Pressable onPress={() => onAdd(currentDay.key)}><Text style={styles.addText}>{t('addBox')}</Text></Pressable></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayPicker}>{days.map((day, index) => <Pressable key={day.date} onPress={() => onDayChange(index)} style={[styles.day, selectedDay === index && styles.daySelected]}><Text style={[styles.dayLabel, selectedDay === index && styles.daySelectedText]}>{day.label}</Text><Text style={[styles.dayDate, selectedDay === index && styles.daySelectedText]}>{day.date}</Text>{index === 1 && <View style={styles.todayDot} />}</Pressable>)}</ScrollView>
      <View style={styles.timeline}><Text style={styles.timelineDate}>{currentDay.offset === 0 ? t('today') : `${currentDay.label} · ${currentDay.key}`}</Text>{visibleTasks.map((task, index) => { const state = timing(task, now); return <TaskCard key={task.id} task={task} onPress={() => onTaskPress(task)} onToggle={() => onTaskToggle(task)} canComplete={state.canComplete} progress={state.progress} isLast={index === visibleTasks.length - 1} />; })}<Pressable style={styles.emptyBox} onPress={() => onAdd(currentDay.key)}><Text style={styles.emptyPlus}>+</Text><Text style={styles.emptyText}>{t('makeRoom')}</Text></Pressable></View>
    </ScrollView>
  );
}
