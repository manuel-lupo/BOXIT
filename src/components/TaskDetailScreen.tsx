import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { duration } from '../data';
import { styles } from '../theme';
import { Task } from '../types';
import { PrimaryButton } from './PrimaryButton';
import { useLanguage } from '../i18n';

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
  const { t } = useLanguage();
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
    ? t('importantWarning', { streak })
    : t('safeWarning');

  if (isRunning && task.status !== 'completed') {
    return (
      <View style={styles.focusPage}>
        <Pressable onPress={onBack}><Text style={styles.backText}>{t('backDay')}</Text></Pressable>
        <View style={styles.focusCenter}>
          <Text style={styles.focusTitle}>{task.title}</Text>
          <Text style={styles.focusCountdown}>{formatCountdown(secondsUntilEnd)}</Text>
          <Text style={styles.focusLabel}>{t('timeRemaining')}</Text>
        </View>
        <Text style={styles.focusEdit}>{t('editLocked')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.detailPage}>
      <View style={styles.detailNav}>
        <Pressable onPress={onBack}><Text style={styles.backText}>{t('backDay')}</Text></Pressable>
        {!hasStarted && <Pressable onPress={onEdit}><Text style={styles.closeText}>{t('edit')}</Text></Pressable>}
      </View>
      <View style={[styles.detailAccent, { backgroundColor: task.color }]} />
      <Text style={styles.detailTitle}>{task.title}</Text>
      <Text style={styles.detailDescription}>{task.description}</Text>
      <View style={styles.detailTime}><Text style={styles.detailTimeText}>{task.start}</Text><Text style={styles.detailArrow}>→</Text><Text style={styles.detailTimeText}>{task.end}</Text><Text style={styles.detailDuration}>{duration(task.start, task.end)}</Text></View>
      <Text style={styles.countdownLabel}>{task.status === 'completed' ? t('completed') : isRunning ? t('timeRemaining') : isEnded ? t('ended') : t('startsIn')}</Text>
      <Text style={styles.countdown}>{task.status === 'completed' ? '✓' : formatCountdown(isRunning ? secondsUntilEnd : secondsUntilStart)}</Text>
      <Text style={styles.statusText}>{task.status === 'completed' ? t('niceWork') : isRunning ? t('stayWith') : isEnded ? t('canComplete') : t('beginsAt', { time: task.start })}</Text>
      {confirmingSkip && (
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>{t('beforeSkip')}</Text>
          <Text style={styles.warningCopy}>{streakWarning}</Text>
          <View style={styles.warningActions}>
            <Pressable style={styles.warningButton} onPress={() => setConfirmingSkip(false)}><Text style={styles.warningButtonText}>{t('keepBox')}</Text></Pressable>
            <Pressable style={[styles.warningButton, styles.warningButtonDanger]} onPress={onSkip}><Text style={[styles.warningButtonText, styles.warningButtonDangerText]}>{t('skipIt')}</Text></Pressable>
          </View>
        </View>
      )}
      <View style={styles.detailActions}>
        {!confirmingSkip && task.status !== 'completed' && <PrimaryButton label={t('canComplete')} onPress={onToggle} disabled={!isEnded} />}
        {!confirmingSkip && task.status !== 'completed' && <Pressable style={styles.skipButton} onPress={() => setConfirmingSkip(true)}><Text style={styles.skipText}>{t('skipBox')}</Text></Pressable>}
      </View>
    </View>
  );
}
