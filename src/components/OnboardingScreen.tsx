import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { COLORS, styles } from '../theme';
import { PrimaryButton } from './PrimaryButton';
import { useLanguage } from '../i18n';

export function OnboardingScreen({ onComplete }: { onComplete: (name: string) => void }) {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);
  const { language, setLanguage, t } = useLanguage();
  return (
    <View style={styles.onboarding}>
      <View style={styles.onboardingLanguage}>
        <Text style={styles.languagePrompt}>{language === 'en' ? 'LANGUAGE' : 'IDIOMA'}</Text>
        <View style={styles.languageOptions}>
          <Pressable accessibilityRole="button" onPress={() => setLanguage('en')}>
            <Text style={[styles.languageOption, language === 'en' && styles.languageSelected]}>EN</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => setLanguage('es')}>
            <Text style={[styles.languageOption, language === 'es' && styles.languageSelected]}>ES</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.logoMark}><Text style={styles.logoText}>B</Text></View>
      <Text style={styles.eyebrow}>{t('welcome')}</Text>
      {step === 0 ? (
        <>
          <Text style={styles.heroTitle}>{t('hero')}</Text>
          <Text style={styles.heroBody}>{t('intro')}</Text>
          <TextInput value={name} onChangeText={setName} placeholder={t('namePlaceholder')} placeholderTextColor={COLORS.muted} style={styles.nameInput} />
          <PrimaryButton label={t('start')} onPress={() => setStep(1)} disabled={!name.trim()} />
        </>
      ) : (
        <>
          <Text style={styles.heroTitle}>{t('yourDay')}</Text>
          <View style={styles.tourCard}><Text style={styles.tourIcon}>◷</Text><View style={styles.tourCopy}><Text style={styles.tourTitle}>{t('planTitle')}</Text><Text style={styles.tourBody}>{t('planBody')}</Text></View></View>
          <View style={styles.tourCard}><Text style={styles.tourIcon}>✦</Text><View style={styles.tourCopy}><Text style={styles.tourTitle}>{t('streakTitle')}</Text><Text style={styles.tourBody}>{t('streakBody')}</Text></View></View>
          <PrimaryButton label={t('buildDay')} onPress={() => onComplete(name.trim())} />
        </>
      )}
      <Text style={styles.stepText}>{step + 1} / 2</Text>
    </View>
  );
}
