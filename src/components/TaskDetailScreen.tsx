import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { duration } from '../data';
import { styles } from '../theme';
import { Task } from '../types';
import { PrimaryButton } from './PrimaryButton';

function toMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatCountdown(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;
  return [hours, minutes, remainingSeconds].map((part) => String(part).padStart(2, '0')).join(':');
}

export function TaskDetailScreen({ task, streak, onBack, onToggle, onSkip, onEdit }: { task: Task; streak: number; onBack: () => void; onToggle: () => void; onSkip: () => void; onEdit: () => void }) {
  const [now, setNow] = useState(() => new Date());
  const [confirmingSkip, setConfirmingSkip] = useState(false);
  const start = toMinutes(task.start);
  const end = toMinutes(task.end);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isRunning = currentMinutes >= start && currentMinutes < end;
  const isEnded = currentMinutes >= end;
  const secondsUntilStart = Math.max(0, (start - currentMinutes) * 60 - now.getSeconds());
  const secondsUntilEnd = Math.max(0, (end - currentMinutes) * 60 - now.getSeconds());
  const hasStarted = currentMinutes >= start;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const streakWarning = task.priority === 'High' || task.priority === 'Critical'
    ? `This is an important box. Skipping it will reset your current ${streak}-day streak.`
    : 'Your streak is safe, but this day will not count as a perfect day.';

  if (isRunning && task.status !== 'completed') {
    return (
      <View style={styles.focusPage}>
        <Pressable onPress={onBack}><Text style={styles.backText}>← Your day</Text></Pressable>
        <View style={styles.focusCenter}>
          <Text style={styles.focusTitle}>{task.title}</Text>
          <Text style={styles.focusCountdown}>{formatCountdown(secondsUntilEnd)}</Text>
          <Text style={styles.focusLabel}>TIME REMAINING</Text>
        </View>
        <Text style={styles.focusEdit}>Editing is locked while a box is active</Text>
      </View>
    );
  }

  return (
    <View style={styles.detailPage}>
      <View style={styles.detailNav}>
        <Pressable onPress={onBack}><Text style={styles.backText}>← Your day</Text></Pressable>
        {!hasStarted && <Pressable onPress={onEdit}><Text style={styles.closeText}>Edit</Text></Pressable>}
      </View>
      <View style={[styles.detailAccent, { backgroundColor: task.color }]} />
      <Text style={styles.detailTitle}>{task.title}</Text>
      <Text style={styles.detailDescription}>{task.description}</Text>
      <View style={styles.detailTime}><Text style={styles.detailTimeText}>{task.start}</Text><Text style={styles.detailArrow}>→</Text><Text style={styles.detailTimeText}>{task.end}</Text><Text style={styles.detailDuration}>{duration(task.start, task.end)}</Text></View>
      <Text style={styles.countdownLabel}>{task.status === 'completed' ? 'BOX COMPLETED' : isRunning ? 'TIME REMAINING' : isEnded ? 'TIME-BOX ENDED' : 'STARTS IN'}</Text>
      <Text style={styles.countdown}>{task.status === 'completed' ? '✓' : formatCountdown(isRunning ? secondsUntilEnd : secondsUntilStart)}</Text>
      <Text style={styles.statusText}>{task.status === 'completed' ? 'Nice work. You made room for what matters.' : isRunning ? 'Stay with this box until the timer ends.' : isEnded ? 'You can now mark this box as completed.' : `Your box begins at ${task.start}.`}</Text>
      {confirmingSkip && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Before you skip this box</Text>
          <Text style={styles.warningCopy}>{streakWarning}</Text>
          <View style={styles.warningActions}>
            <Pressable style={styles.warningButton} onPress={() => setConfirmingSkip(false)}><Text style={styles.warningButtonText}>Keep box</Text></Pressable>
            <Pressable style={[styles.warningButton, styles.warningButtonDanger]} onPress={onSkip}><Text style={[styles.warningButtonText, styles.warningButtonDangerText]}>Skip it</Text></Pressable>
          </View>
        </View>
      )}
      <View style={styles.detailActions}>
        {!confirmingSkip && task.status !== 'completed' && <PrimaryButton label="Mark completed" onPress={onToggle} disabled={!isEnded} />}
        {!confirmingSkip && task.status !== 'completed' && <Pressable style={styles.skipButton} onPress={() => setConfirmingSkip(true)}><Text style={styles.skipText}>I’m not doing this box</Text></Pressable>}
      </View>
    </View>
  );
}
