import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Slider } from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAudio } from '../context/AudioContext';
import { theme } from '../styles/theme';

export default function VolumeControl() {
  const { volume, changeVolume } = useAudio();
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const handleVolumeChange = (value) => {
    changeVolume(value);
    if (value === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      changeVolume(previousVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      changeVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMute}>
        <Icon
          name={isMuted ? 'volume-off' : volume < 0.5 ? 'volume-down' : 'volume-up'}
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>
      <Slider
        style={styles.slider}
        value={isMuted ? 0 : volume}
        onValueChange={handleVolumeChange}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.progressBg}
        thumbTintColor={theme.colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  slider: {
    flex: 1,
    height: 30,
  },
});