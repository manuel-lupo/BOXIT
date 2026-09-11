import { Pressable, ScrollView, Text, View } from 'react-native';
import { duration } from '../data';
import { styles } from '../theme';
import { Task } from '../types';
import { useLanguage } from '../i18n';

export function HistoryScreen({ tasks, onBack }: { tasks: Task[]; onBack: () => void }) {
  const { t } = useLanguage();
  const grouped = tasks.reduce<Record<string, Task[]>>((groups, task) => {
    groups[task.date] = [...(groups[task.date] || []), task];
    return groups;
  }, {});
  return (
    <View style={styles.detailPage}>
      <View style={styles.detailNav}><Pressable onPress={onBack}><Text style={styles.backText}>{t('backDay')}</Text></Pressable><Text style={styles.eyebrow}>{t('history')}</Text></View>
      <Text style={styles.detailTitle}>{t('historyTitle')}</Text>
      <Text style={styles.detailDescription}>{t('historyDescription')}</Text>
      <ScrollView style={{ marginTop: 28 }} showsVerticalScrollIndicator={false}>
        {Object.keys(grouped).sort().reverse().map((date) => (
          <View key={date} style={{ marginBottom: 24 }}>
            <Text style={styles.timelineDate}>{date}</Text>
            {grouped[date].map((task) => (
              <View key={task.id} style={styles.historyRow}>
                <View style={[styles.historyDot, { backgroundColor: task.color }]} />
                <View style={{ flex: 1 }}><Text style={[styles.taskTitle, task.status === 'skipped' && styles.taskTitleSkipped]}>{task.title}</Text><Text style={styles.taskDescription}>{task.start} · {duration(task.start, task.end)}</Text></View>
                <Text style={[styles.historyStatus, task.status === 'completed' ? styles.historyComplete : styles.historySkipped]}>{task.status === 'completed' ? t('completedStatus') : t('skippedStatus')}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
