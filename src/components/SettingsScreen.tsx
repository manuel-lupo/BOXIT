import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { styles } from '../theme';
import { clearState } from '../storage';
import { Language, useLanguage } from '../i18n';

export function SettingsScreen({ onBack, onReset, onLanguageChange }: { onBack: () => void; onReset: () => void; onLanguageChange: (language: Language) => void }) {
  const { language, setLanguage, t } = useLanguage();
  const [notificationStatus, setNotificationStatus] = useState(t('checking'));
  useEffect(() => {
    if (Platform.OS === 'web') {
      setNotificationStatus(typeof Notification === 'undefined' ? t('unavailable') : Notification.permission === 'granted' ? t('enabled') : t('notEnabled'));
      return;
    }
    Notifications.getPermissionsAsync().then((permission) => setNotificationStatus(permission.granted ? t('enabled') : t('notEnabled'))).catch(() => setNotificationStatus(t('unavailable')));
  }, [t]);
  const performReset = async () => {
    await clearState();
    onReset();
  };

  const reset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(`${t('resetTitle')} ${t('resetBody')}`)) {
        void performReset();
      }
      return;
    }
    Alert.alert(t('resetTitle'), t('resetBody'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('reset'), style: 'destructive', onPress: () => { void performReset(); } },
    ]);
  };
  return (
    <View style={styles.detailPage}>
      <View style={styles.detailNav}><Pressable onPress={onBack}><Text style={styles.backText}>{t('yourProfile')}</Text></Pressable><Text style={styles.eyebrow}>{t('settings')}</Text></View>
      <Text style={styles.detailTitle}>{t('settings')}.</Text>
      <Text style={styles.detailDescription}>{t('settingsDescription')}</Text>
      <View style={styles.settingsRow}><View><Text style={styles.taskTitle}>{t('notifications')}</Text><Text style={styles.taskDescription}>{t('notificationStatus')}</Text></View><Text style={styles.settingsValue}>{notificationStatus}</Text></View>
      <View style={styles.settingsRow}><View><Text style={styles.taskTitle}>Language / Idioma</Text><Text style={styles.taskDescription}>{language === 'en' ? 'English' : 'Español'}</Text></View><View style={styles.languageOptions}><Pressable onPress={() => { setLanguage('en'); onLanguageChange('en'); }}><Text style={[styles.languageOption, language === 'en' && styles.languageSelected]}>EN</Text></Pressable><Pressable onPress={() => { setLanguage('es'); onLanguageChange('es'); }}><Text style={[styles.languageOption, language === 'es' && styles.languageSelected]}>ES</Text></Pressable></View></View>
      <Pressable style={styles.resetButton} onPress={reset}><Text style={styles.resetText}>{t('resetData')}</Text></Pressable>
    </View>
  );
}
