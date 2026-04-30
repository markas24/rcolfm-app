import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Slider } from '@react-native-community/slider';
import { theme } from '../styles/theme';

export default function ProgressBar({ currentTime, duration, onSeek, formatTime }) {
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      <Slider
        style={styles.slider}
        value={progress}
        onSlidingComplete={(value) => onSeek(value * duration)}
        minimumTrackTintColor={theme.colors.progressFill}
        maximumTrackTintColor={theme.colors.progressBg}
        thumbTintColor={theme.colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  timeText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 30,
  },
});