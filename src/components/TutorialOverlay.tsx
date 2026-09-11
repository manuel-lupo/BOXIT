import { useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { COLORS, styles } from '../theme';
import { useLanguage } from '../i18n';

const steps = [
  { title: 'tutorial1Title', body: 'tutorial1Body', anchor: 'score' },
  { title: 'tutorial2Title', body: 'tutorial2Body', anchor: 'timeline' },
  { title: 'tutorial3Title', body: 'tutorial3Body', anchor: 'days' },
  { title: 'tutorial4Title', body: 'tutorial4Body', anchor: 'timeline' },
  { title: 'tutorial5Title', body: 'tutorial5Body', anchor: 'add' },
] as const;

export function TutorialOverlay({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const { t } = useLanguage();
  const { height, width } = useWindowDimensions();
  const current = steps[step];
  const last = step === steps.length - 1;
  const bubbleWidth = Math.min(280, width - 40);
  const left = Math.max(20, Math.min(width - bubbleWidth - 20, current.anchor === 'score' ? width * 0.08 : current.anchor === 'days' ? width * 0.2 : current.anchor === 'timeline' ? width * 0.15 : width * 0.32));
  const top = current.anchor === 'score'
    ? Math.min(height * 0.26, 210)
    : current.anchor === 'days'
      ? Math.min(height * 0.51, 400)
      : current.anchor === 'timeline'
        ? Math.min(height * 0.7, 535)
        : Math.min(height * 0.39, 305);
  const pointerLeft = current.anchor === 'add' ? bubbleWidth * 0.55 : current.anchor === 'timeline' ? bubbleWidth * 0.25 : bubbleWidth * 0.12;
  return (
    <View style={styles.tutorialBackdrop}>
      <View style={[styles.tutorialBubble, { top, left, width: bubbleWidth }]}>
        <View style={[styles.tutorialPointer, { top: -7, left: pointerLeft }]} />
        <Text style={styles.tutorialTitle}>{t(current.title)}</Text>
        <Text style={styles.tutorialBody}>{t(current.body)}</Text>
        <View style={styles.tutorialFooter}>
          <Text style={styles.tutorialStep}>{step + 1} / {steps.length}</Text>
          <Pressable style={styles.tutorialButton} onPress={() => last ? onDone() : setStep(step + 1)}>
            <Text style={styles.tutorialButtonText}>{last ? t('tutorialDone') : t('tutorialNext')}</Text>
          </Pressable>
        </View>
      </View>
      <Pressable accessibilityRole="button" onPress={onDone} style={{ position: 'absolute', bottom: 35, left: 22 }}><Text style={{ color: COLORS.muted, fontSize: 12 }}>{t('tutorialSkip')}</Text></Pressable>
    </View>
  );
}
