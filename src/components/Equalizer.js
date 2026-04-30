import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '../styles/theme';

export default function Equalizer({ isPlaying }) {
  const bars = useRef([...Array(12)].map(() => new Animated.Value(8))).current;

  useEffect(() => {
    let animation;
    if (isPlaying) {
      const animateBars = () => {
        const animations = bars.map(bar => {
          const randomHeight = Math.random() * 35 + 8;
          return Animated.timing(bar, {
            toValue: randomHeight,
            duration: 120,
            useNativeDriver: false,
          });
        });
        animation = Animated.parallel(animations);
        animation.start(() => {
          if (isPlaying) animateBars();
        });
      };
      animateBars();
    } else {
      bars.forEach(bar => {
        bar.setValue(8);
      });
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              height: bar,
              backgroundColor: theme.colors.primary,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 8,
    borderRadius: 20,
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
  },
});