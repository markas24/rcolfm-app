import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Animated,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../styles/theme';

export default function LiveScreen() {
  const [isAnimating, setIsAnimating] = useState(false);
  const pulseAnim = useState(new Animated.Value(1))[0];
  const [currentProgram, setCurrentProgram] = useState(null);

  const schedule = [
    { time: '06:00', name: 'Le Grand Réveil', end: '09:00', description: 'Commencez votre journée avec les meilleurs titres et l\'actualité locale' },
    { time: '09:00', name: 'Les Titres du Jour', end: '12:00', description: 'Toute l\'actualité de votre région' },
    { time: '12:00', name: 'Déjeuner en Musique', end: '15:00', description: 'Musique et bonne humeur pour votre pause déjeuner' },
    { time: '15:00', name: 'Culture Locale', end: '18:00', description: 'Découvrez la richesse culturelle de notre région' },
    { time: '18:00', name: 'Le Club des Sports', end: '20:00', description: 'Toute l\'actualité sportive locale et nationale' },
    { time: '20:00', name: 'Soirée Musicale', end: '23:00', description: 'Les meilleurs titres pour votre soirée' },
  ];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Trouver le programme actuel
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    const current = schedule.find(prog => {
      const [startHour, startMin] = prog.time.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const [endHour, endMin] = prog.end.split(':').map(Number);
      const endMinutes = endHour * 60 + endMin;
      return currentTimeInMinutes >= startMinutes && currentTimeInMinutes < endMinutes;
    });

    setCurrentProgram(current || schedule[0]);
  }, []);

  const openLiveStream = () => {
    setIsAnimating(true);
    Linking.openURL('https://stream.rcolfm.com/live');
    setTimeout(() => setIsAnimating(false), 2000);
  };

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Animation live */}
          <View style={styles.liveIndicator}>
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>EN DIRECT</Text>
          </View>

          {/* Icône radio */}
          <View style={styles.radioIconContainer}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              style={styles.radioIcon}
            >
              <Icon name="radio" size={80} color={theme.colors.white} />
            </LinearGradient>
          </View>

          {/* Informations */}
          <Text style={styles.stationName}>RCOLFM 93.6</Text>
          <Text style={styles.frequency}>FM • 93.6 MHz</Text>
          
          <View style={styles.infoCard}>
            <Icon name="info" size={20} color={theme.colors.primary} />
            <Text style={styles.infoText}>
              La radio 100% communautaire - Musique, informations locales, émissions culturelles
            </Text>
          </View>

          {/* Programme actuel */}
          {currentProgram && (
            <View style={styles.programCard}>
              <Text style={styles.programTitle}>En ce moment</Text>
              <Text style={styles.programName}>{currentProgram.name}</Text>
              <Text style={styles.programTime}>{currentProgram.time} - {currentProgram.end}</Text>
              <Text style={styles.programDesc}>{currentProgram.description}</Text>
            </View>
          )}

          {/* Bouton lecture - style maquette */}
          <TouchableOpacity
            style={[styles.listenBtn, isAnimating && styles.listeningBtn]}
            onPress={openLiveStream}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDark]}
              style={styles.btnGradient}
            >
              <Icon name="play-arrow" size={28} color={theme.colors.white} />
              <Text style={styles.btnText}>
                {isAnimating ? 'OUVERTURE...' : 'ÉCOUTER LE DIRECT'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Grille des programmes */}
          <View style={styles.scheduleSection}>
            <Text style={styles.scheduleTitle}>Grille des programmes</Text>
            <View style={styles.scheduleGrid}>
              {schedule.map((item, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <Text style={styles.scheduleTime}>{item.time}</Text>
                  <Text style={styles.scheduleName}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  liveIndicator: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(220, 38, 38, 0.3)',
  },
  liveDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 2,
  },
  radioIconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  radioIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.lg,
  },
  stationName: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  frequency: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  programCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadow.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  programTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  programName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  programTime: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
    marginBottom: theme.spacing.sm,
  },
  programDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  listenBtn: {
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
    ...theme.shadow.md,
  },
  listeningBtn: {
    opacity: 0.7,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  scheduleSection: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  scheduleGrid: {
    gap: theme.spacing.sm,
  },
  scheduleItem: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  scheduleTime: {
    width: 70,
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  scheduleName: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});