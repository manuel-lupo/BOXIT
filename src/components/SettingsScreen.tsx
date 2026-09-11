import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { styles } from '../theme';
import { clearState } from '../storage';

export function SettingsScreen({ onBack, onReset }: { onBack: () => void; onReset: () => void }) {
  const [notificationStatus, setNotificationStatus] = useState('Checking…');
  useEffect(() => {
    if (Platform.OS === 'web') {
      setNotificationStatus(typeof Notification === 'undefined' ? 'Unavailable in this browser' : Notification.permission === 'granted' ? 'Enabled' : 'Not enabled');
      return;
    }
    Notifications.getPermissionsAsync().then((permission) => setNotificationStatus(permission.granted ? 'Enabled' : 'Not enabled')).catch(() => setNotificationStatus('Unavailable'));
  }, []);
  const performReset = async () => {
    await clearState();
    onReset();
  };

  const reset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Reset BOXIT? This deletes tasks, history, and your profile from this device.')) {
        void performReset();
      }
      return;
    }
    Alert.alert('Reset BOXIT?', 'This deletes tasks, history, and your profile from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => { void performReset(); } },
    ]);
  };
  return (
    <View style={styles.detailPage}>
      <View style={styles.detailNav}><Pressable onPress={onBack}><Text style={styles.backText}>← Your profile</Text></Pressable><Text style={styles.eyebrow}>SETTINGS</Text></View>
      <Text style={styles.detailTitle}>Settings.</Text>
      <Text style={styles.detailDescription}>Keep BOXIT working the way you need it.</Text>
      <View style={styles.settingsRow}><View><Text style={styles.taskTitle}>Notifications</Text><Text style={styles.taskDescription}>Reminder permission status</Text></View><Text style={styles.settingsValue}>{notificationStatus}</Text></View>
      <Pressable style={styles.resetButton} onPress={reset}><Text style={styles.resetText}>Reset local data</Text></Pressable>
    </View>
  );
}
