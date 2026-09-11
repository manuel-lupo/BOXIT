import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { COLORS, styles } from '../theme';

const steps = [
  { title: 'Track your momentum', body: 'Your score shows how much of today you have completed.', top: 115, left: 22 },
  { title: 'Choose your day', body: 'Swipe through the week to preview and plan upcoming boxes.', top: 275, left: 75 },
  { title: 'Tap any box', body: 'Open a dedicated focus screen with the live countdown and actions.', top: 410, left: 105 },
  { title: 'Add a new box', body: 'Use + Add box whenever you want to make room for something that matters.', top: 228, left: 105 },
];

export function TutorialOverlay({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const last = step === steps.length - 1;
  return (
    <View style={styles.tutorialBackdrop}>
      <View style={[styles.tutorialBubble, { top: current.top, left: current.left }]}>
        <View style={[styles.tutorialPointer, { top: -7, left: 30 }]} />
        <Text style={styles.tutorialTitle}>{current.title}</Text>
        <Text style={styles.tutorialBody}>{current.body}</Text>
        <View style={styles.tutorialFooter}>
          <Text style={styles.tutorialStep}>{step + 1} / {steps.length}</Text>
          <Pressable style={styles.tutorialButton} onPress={() => last ? onDone() : setStep(step + 1)}>
            <Text style={styles.tutorialButtonText}>{last ? 'Got it' : 'Next'}</Text>
          </Pressable>
        </View>
      </View>
      <Pressable onPress={onDone} style={{ position: 'absolute', bottom: 35, left: 22 }}><Text style={{ color: COLORS.muted, fontSize: 12 }}>Skip tutorial</Text></Pressable>
    </View>
  );
}
