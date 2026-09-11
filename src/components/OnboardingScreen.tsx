import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { COLORS, styles } from '../theme';
import { PrimaryButton } from './PrimaryButton';

export function OnboardingScreen({ onComplete }: { onComplete: (name: string) => void }) {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);
  return (
    <View style={styles.onboarding}>
      <View style={styles.logoMark}><Text style={styles.logoText}>B</Text></View>
      <Text style={styles.eyebrow}>WELCOME TO BOXIT</Text>
      {step === 0 ? (
        <>
          <Text style={styles.heroTitle}>Make space for{'\n'}what matters.</Text>
          <Text style={styles.heroBody}>A calm, focused way to time-box your day and build momentum.</Text>
          <TextInput value={name} onChangeText={setName} placeholder="What should we call you?" placeholderTextColor={COLORS.muted} style={styles.nameInput} />
          <PrimaryButton label="Let's get started" onPress={() => setStep(1)} disabled={!name.trim()} />
        </>
      ) : (
        <>
          <Text style={styles.heroTitle}>Your day,{'\n'}one box at a time.</Text>
          <View style={styles.tourCard}><Text style={styles.tourIcon}>◷</Text><View style={styles.tourCopy}><Text style={styles.tourTitle}>Plan with intention</Text><Text style={styles.tourBody}>Create focused time-boxes and see your whole day at a glance.</Text></View></View>
          <View style={styles.tourCard}><Text style={styles.tourIcon}>✦</Text><View style={styles.tourCopy}><Text style={styles.tourTitle}>Keep your streak alive</Text><Text style={styles.tourBody}>Complete your important boxes and watch your consistency grow.</Text></View></View>
          <PrimaryButton label="Build my first day" onPress={() => onComplete(name.trim())} />
        </>
      )}
      <Text style={styles.stepText}>{step + 1} / 2</Text>
    </View>
  );
}
