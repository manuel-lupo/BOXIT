import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { styles } from '../theme';

export function StartupSplash({ onFinished }: { onFinished: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.72)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 7, tension: 55, useNativeDriver: true }),
      ]),
      Animated.delay(550),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.08, duration: 300, useNativeDriver: true }),
      ]),
    ]).start(({ finished }) => {
      if (finished) onFinished();
    });
  }, [onFinished, opacity, scale]);

  return (
    <View style={styles.startupSplash}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <View style={styles.startupLogo}><Text style={styles.startupLogoText}>B</Text></View>
      </Animated.View>
    </View>
  );
}
