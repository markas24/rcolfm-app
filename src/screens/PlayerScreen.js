import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

import { useAudio } from '../context/AudioContext';
import ProgressBar from '../components/ProgressBar';
import VolumeControl from '../components/VolumeControl';
import Equalizer from '../components/Equalizer';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    nextTrack,
    previousTrack,
    isRepeat,
    toggleRepeat,
    isShuffle,
    toggleShuffle,
    playbackSpeed,
    changeSpeed,
    formatTime,
    currentTime,
    duration,
    seekTo,
    volume,
    changeVolume,
    setSleepTimer,
    cancelSleepTimer,
    tracks,
  } = useAudio();

  const [isEqVisible, setIsEqVisible] = useState(true);
  const [isTimerModalVisible, setIsTimerModalVisible] = useState(false);
  const [isSpeedModalVisible, setIsSpeedModalVisible] = useState(false);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const timerOptions = [15, 30, 45, 60, 90, 120];

  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isPlaying]);

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  const handleSpeedChange = (speed) => {
    changeSpeed(speed);
    setIsSpeedModalVisible(false);
  };

  const handleTimerSelect = (minutes) => {
    setTimerMinutes(minutes);
    setActiveTimer(minutes);
    setSleepTimer(minutes, () => {
      setActiveTimer(null);
      setTimerMinutes(0);
    });
    setIsTimerModalVisible(false);
  };

  const cancelTimer = () => {
    cancelSleepTimer();
    setActiveTimer(null);
    setTimerMinutes(0);
  };

  const formatTimerDisplay = () => {
    if (!activeTimer) return null;
    return `${activeTimer} min`;
  };

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      <View style={styles.content}>
        {/* Header avec logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              style={styles.logoIcon}
            >
              <Icon name="radio" size={24} color={theme.colors.white} />
            </LinearGradient>
            <View>
              <Text style={styles.radioName}>RCOLFM 93.6</Text>
              <Text style={styles.slogan}>La voix de la communauté • 100% locale</Text>
            </View>
          </View>
        </View>

        {/* Album Art + Égaliseur */}
        <View style={styles.albumContainer}>
          <Animated.View style={[styles.albumArt, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient
              colors={currentTrack ? ['#fee2e2', '#fecaca'] : ['#e2e8f0', '#cbd5e1']}
              style={styles.albumGradient}
            >
              {currentTrack?.image ? (
                <Image source={{ uri: currentTrack.image }} style={styles.albumImage} />
              ) : (
                <Icon 
                  name="mic" 
                  size={80} 
                  color={currentTrack ? theme.colors.primary : '#94a3b8'} 
                  style={{ opacity: 0.6 }} 
                />
              )}
            </LinearGradient>
            {isEqVisible && <Equalizer isPlaying={isPlaying} />}
          </Animated.View>
        </View>

        {/* Track Info - Titre sur 2 lignes comme la maquette */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={2}>
            {currentTrack?.title || 'Sélectionnez une émission'}
          </Text>
          <View style={styles.trackMeta}>
            <View style={styles.categoryBadge}>
              <Icon name="folder" size={12} color={theme.colors.primary} />
              <Text style={styles.categoryText}>
                {currentTrack?.category || 'Prêt'}
              </Text>
            </View>
            <Text style={styles.duration}>
              {currentTrack?.duration || '--:--'}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seekTo}
          formatTime={formatTime}
        />

        {/* Playback Controls - identiques à la maquette */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, isShuffle && styles.activeBtn]}
            onPress={toggleShuffle}
          >
            <Icon
              name="shuffle"
              size={24}
              color={isShuffle ? theme.colors.primary : theme.colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={previousTrack}>
            <Icon name="skip-previous" size={32} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playBtn, styles.controlBtn]}
            onPress={togglePlayPause}
          >
            <Icon
              name={isPlaying ? 'pause' : 'play-arrow'}
              size={40}
              color={theme.colors.white}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={nextTrack}>
            <Icon name="skip-next" size={32} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, isRepeat && styles.activeBtn]}
            onPress={toggleRepeat}
          >
            <Icon
              name="repeat"
              size={24}
              color={isRepeat ? theme.colors.primary : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Volume + Vitesse + Timer - comme la maquette */}
        <View style={styles.extrasContainer}>
          <View style={styles.volumeContainer}>
            <TouchableOpacity onPress={() => changeVolume(volume === 0 ? 0.7 : 0)}>
              <Icon 
                name={volume === 0 ? 'volume-off' : volume < 0.5 ? 'volume-down' : 'volume-up'} 
                size={18} 
                color={theme.colors.textSecondary} 
              />
            </TouchableOpacity>
            <Text style={styles.extraText}>{Math.round(volume * 100)}%</Text>
          </View>

          <TouchableOpacity 
            style={styles.extraBtn}
            onPress={() => setIsSpeedModalVisible(true)}
          >
            <Icon name="speed" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.extraText}>Vitesse {playbackSpeed}x</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.extraBtn, isEqVisible && styles.activeExtra]}
            onPress={() => setIsEqVisible(!isEqVisible)}
          >
            <Icon name="equalizer" size={18} color={isEqVisible ? theme.colors.primary : theme.colors.textSecondary} />
            <Text style={[styles.extraText, isEqVisible && { color: theme.colors.primary }]}>Égaliseur</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.extraBtn}
            onPress={() => setIsTimerModalVisible(true)}
          >
            <Icon name="timer" size={18} color={activeTimer ? theme.colors.primary : theme.colors.textSecondary} />
            <Text style={[styles.extraText, activeTimer && { color: theme.colors.primary }]}>
              {activeTimer ? formatTimerDisplay() : 'Minuterie'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer personnalisé - comme la maquette */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Icon name="music-note" size={12} color={theme.colors.textMuted} />{' '}
            {tracks.length} émissions disponibles • RCOLFM Communauté
          </Text>
        </View>
      </View>

      {/* Modal Vitesse */}
      <Modal
        visible={isSpeedModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSpeedModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsSpeedModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Vitesse de lecture</Text>
                <View style={styles.speedGrid}>
                  {speeds.map((speed) => (
                    <TouchableOpacity
                      key={speed}
                      style={[
                        styles.speedOption,
                        playbackSpeed === speed && styles.activeSpeedOption,
                      ]}
                      onPress={() => handleSpeedChange(speed)}
                    >
                      <Text
                        style={[
                          styles.speedText,
                          playbackSpeed === speed && styles.activeSpeedText,
                        ]}
                      >
                        {speed}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal Minuterie */}
      <Modal
        visible={isTimerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsTimerModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsTimerModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Minuterie d'arrêt</Text>
                <Text style={styles.modalSubtitle}>
                  La lecture s'arrêtera automatiquement
                </Text>
                <View style={styles.timerGrid}>
                  {timerOptions.map((minutes) => (
                    <TouchableOpacity
                      key={minutes}
                      style={[
                        styles.timerOption,
                        activeTimer === minutes && styles.activeTimerOption,
                      ]}
                      onPress={() => handleTimerSelect(minutes)}
                    >
                      <Text
                        style={[
                          styles.timerText,
                          activeTimer === minutes && styles.activeTimerText,
                        ]}
                      >
                        {minutes < 60 ? `${minutes} min` : `${minutes / 60} h`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {activeTimer && (
                  <TouchableOpacity
                    style={styles.cancelTimerBtn}
                    onPress={cancelTimer}
                  >
                    <Text style={styles.cancelTimerText}>Annuler</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xxl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.sm,
  },
  radioName: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  slogan: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  albumContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  albumArt: {
    width: width - 100,
    height: width - 100,
    borderRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
    ...theme.shadow.md,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  albumGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumImage: {
    width: '100%',
    height: '100%',
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  trackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 28,
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  categoryText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  duration: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginVertical: theme.spacing.xl,
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    backgroundColor: theme.colors.primary,
    ...theme.shadow.md,
  },
  activeBtn: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  extrasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginVertical: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  extraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.round,
  },
  activeExtra: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  extraText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: width - 80,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  speedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  speedOption: {
    width: 70,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeSpeedOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  speedText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeSpeedText: {
    color: '#fff',
  },
  timerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  timerOption: {
    width: 80,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeTimerOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  activeTimerText: {
    color: '#fff',
  },
  cancelTimerBtn: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.round,
    backgroundColor: '#fee2e2',
  },
  cancelTimerText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
});