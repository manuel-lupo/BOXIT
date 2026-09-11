import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { hasTaskStarted, priorityColors, today } from '../data';
import { COLORS, styles } from '../theme';
import { Priority, Task } from '../types';
import { PrimaryButton } from './PrimaryButton';

export function Composer({ onClose, onSave, initialTask, defaultDate }: { onClose: () => void; onSave: (task: Omit<Task, 'id' | 'status'>) => void; initialTask?: Task; defaultDate?: string }) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [start, setStart] = useState(initialTask?.start || '20:00');
  const [end, setEnd] = useState(initialTask?.end || '20:30');
  const [date, setDate] = useState(initialTask?.date || defaultDate || today());
  const [priority, setPriority] = useState<Priority>(initialTask?.priority || 'Focus');
  const [repeatDays, setRepeatDays] = useState<number[]>(initialTask?.recurrenceDays || []);
  const [repeatUntil, setRepeatUntil] = useState(initialTask?.recurrenceEndDate || '');
  const [reminderBeforeStart, setReminderBeforeStart] = useState(initialTask?.reminderBeforeStart ?? true);
  const [reminderAtEnd, setReminderAtEnd] = useState(initialTask?.reminderAtEnd ?? true);
  const normalizeTime = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
  };
  const validTime = /^\d{2}:\d{2}$/.test(start) && /^\d{2}:\d{2}$/.test(end);
  const validRange = validTime && Number(start.slice(0, 2)) < 24 && Number(end.slice(0, 2)) < 24 && Number(start.slice(3)) < 60 && Number(end.slice(3)) < 60 && Number(end.replace(':', '')) > Number(start.replace(':', ''));
  const locked = Boolean(initialTask && hasTaskStarted(initialTask));
  return (
    <View style={styles.detailPage}>
      <View style={styles.detailNav}><Pressable onPress={onClose}><Text style={styles.backText}>← Your day</Text></Pressable><Text style={styles.eyebrow}>NEW BOX</Text></View>
      <ScrollView>
        <Text style={styles.detailTitle}>Make room for something new.</Text>
        <Text style={styles.inputLabel}>WHAT ARE YOU MAKING TIME FOR?</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="e.g. Learn Spanish" placeholderTextColor={COLORS.muted} style={styles.formInput} autoFocus={!initialTask} />
        <Text style={styles.inputLabel}>DESCRIPTION</Text>
        <TextInput value={description} onChangeText={setDescription} placeholder="What will you focus on?" placeholderTextColor={COLORS.muted} style={styles.formInput} multiline />
        <Text style={styles.inputLabel}>TIME</Text>
        <View style={styles.timeInputs}>        <TextInput value={start} onChangeText={(value) => setStart(normalizeTime(value))} keyboardType="number-pad" maxLength={5} style={[styles.formInput, styles.timeInput]} /><Text style={styles.timeSeparator}>to</Text><TextInput value={end} onChangeText={(value) => setEnd(normalizeTime(value))} keyboardType="number-pad" maxLength={5} style={[styles.formInput, styles.timeInput]} /></View>
        <Text style={styles.inputLabel}>DATE (YYYY-MM-DD)</Text>
        <TextInput value={date} onChangeText={setDate} placeholder="2026-09-11" placeholderTextColor={COLORS.muted} style={styles.formInput} />
        {!validRange && <Text style={styles.formError}>Enter a valid 24-hour range. End time must be after start.</Text>}
        {locked && <Text style={styles.formError}>This time-box has started and cannot be edited.</Text>}
        <Text style={styles.inputLabel}>IMPORTANCE</Text>
        <View style={styles.priorityOptions}>{(['Low', 'Focus', 'High', 'Critical'] as Priority[]).map((item) => <Pressable key={item} onPress={() => setPriority(item)} style={[styles.priorityOption, priority === item && { borderColor: priorityColors[item], backgroundColor: `${priorityColors[item]}18` }]}><Text style={[styles.priorityOptionText, { color: priorityColors[item] }]}>{item}</Text></Pressable>)}</View>
        <Text style={styles.inputLabel}>REPEAT ON (OPTIONAL)</Text>
        <View style={styles.priorityOptions}>{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => <Pressable key={`${label}-${index}`} onPress={() => setRepeatDays((days) => days.includes(index) ? days.filter((day) => day !== index) : [...days, index])} style={[styles.priorityOption, repeatDays.includes(index) && { borderColor: COLORS.green, backgroundColor: '#B8F36A18' }]}><Text style={[styles.priorityOptionText, { color: repeatDays.includes(index) ? COLORS.green : COLORS.muted }]}>{label}</Text></Pressable>)}</View>
        {repeatDays.length > 0 && <TextInput value={repeatUntil} onChangeText={setRepeatUntil} placeholder="Repeat until YYYY-MM-DD (optional)" placeholderTextColor={COLORS.muted} style={[styles.formInput, { marginTop: 12 }]} />}
        <Text style={styles.inputLabel}>REMINDERS</Text>
        <View style={styles.reminderRow}><Text style={styles.reminderText}>5 minutes before start</Text><Switch value={reminderBeforeStart} onValueChange={setReminderBeforeStart} trackColor={{ false: COLORS.border, true: COLORS.greenDark }} thumbColor={reminderBeforeStart ? COLORS.green : COLORS.muted} /></View>
        <View style={styles.reminderRow}><Text style={styles.reminderText}>When the box ends</Text><Switch value={reminderAtEnd} onValueChange={setReminderAtEnd} trackColor={{ false: COLORS.border, true: COLORS.greenDark }} thumbColor={reminderAtEnd ? COLORS.green : COLORS.muted} /></View>
        <PrimaryButton label={initialTask ? 'Save changes' : 'Add to my day'} onPress={() => onSave({ title, description: description || 'A new time-box for your day.', start, end, priority, color: priorityColors[priority], date, reminderBeforeStart, reminderAtEnd, recurrenceDays: repeatDays, recurrenceEndDate: repeatUntil || null })} disabled={!title.trim() || !validRange || locked} />
      </ScrollView>
    </View>
  );
}
