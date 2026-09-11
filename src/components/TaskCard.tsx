import { Pressable, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { priorityColors, duration } from '../data';
import { styles } from '../theme';
import { Task } from '../types';
import { useLanguage } from '../i18n';

export function TaskCard({ task, onPress, onToggle, isLast, canComplete, progress }: { task: Task; onPress: () => void; onToggle: () => void; isLast: boolean; canComplete: boolean; progress: number }) {
  const skipped = task.status === 'skipped';
  const { t } = useLanguage();
  return (
    <View style={styles.taskRow}>
      <View style={styles.timeColumn}><Text style={styles.taskTime}>{task.start}</Text><Text style={styles.taskEnd}>{task.end}</Text></View>
      <View style={[styles.timelineLine, isLast && styles.timelineLineLast]}><View style={[styles.timelineDot, { backgroundColor: task.color }]} /></View>
      <Pressable style={[styles.taskCard, { borderLeftColor: task.color }, task.status === 'completed' && styles.taskCompleted, skipped && styles.taskSkipped]} onPress={onPress}>
        <View style={styles.taskCardTop}>
          <Text style={[styles.taskTitle, skipped && styles.taskTitleSkipped]}>{task.title}</Text>
          <Pressable style={[styles.check, task.status === 'completed' && styles.checkDone, !canComplete && task.status !== 'completed' && styles.checkDisabled]} onPress={task.status === 'completed' || !canComplete ? undefined : onToggle}>
            {task.status !== 'completed' && <Svg pointerEvents="none" width={29} height={29} viewBox="0 0 29 29" style={styles.checkProgress}>
              <Circle cx="14.5" cy="14.5" r="12.5" fill="none" stroke="#29322D" strokeWidth="2" />
              <Circle cx="14.5" cy="14.5" r="12.5" fill="none" stroke="#B8F36A" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 12.5}`} strokeDashoffset={`${2 * Math.PI * 12.5 * (1 - progress)}`} transform="rotate(-90 14.5 14.5)" />
            </Svg>}
            <Text style={styles.checkText}>{task.status === 'completed' ? '✓' : ''}</Text>
          </Pressable>
        </View>
        <Text style={[styles.taskDescription, skipped && styles.taskTitleSkipped]} numberOfLines={1}>{task.description}</Text>
        <View style={styles.taskMeta}>
          <Text style={[styles.priorityPill, { color: priorityColors[task.priority] }]}>{t(task.priority === 'Low' ? 'low' : task.priority === 'Focus' ? 'focus' : task.priority === 'High' ? 'high' : 'critical').toUpperCase()}</Text>
          <Text style={styles.duration}>{duration(task.start, task.end)}</Text>
          {skipped && <Text style={styles.skippedLabel}>{t('skippedStatus')}</Text>}
        </View>
      </Pressable>
    </View>
  );
}
