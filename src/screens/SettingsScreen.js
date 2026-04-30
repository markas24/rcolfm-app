import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudio } from '../context/AudioContext';
import { theme } from '../styles/theme';

export default function SettingsScreen({ navigation }) {
  const {
    volume,
    playbackSpeed,
    isRepeat,
    isShuffle,
    changeVolume,
    changeSpeed,
    toggleRepeat,
    toggleShuffle,
  } = useAudio();

  const [notifications, setNotifications] = useState(true);
  const [backgroundPlay, setBackgroundPlay] = useState(true);
  const [equalizerPreset, setEqualizerPreset] = useState('normal');

  const speedOptions = [
    { label: '0.5x', value: 0.5 },
    { label: '0.75x', value: 0.75 },
    { label: '1.0x', value: 1.0 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 },
    { label: '2.0x', value: 2.0 },
  ];

  const equalizerPresets = [
    { label: 'Normal', value: 'normal' },
    { label: 'Pop', value: 'pop' },
    { label: 'Rock', value: 'rock' },
    { label: 'Jazz', value: 'jazz' },
    { label: 'Classique', value: 'classical' },
    { label: 'Électronique', value: 'electronic' },
  ];

  const handleSpeedChange = (speed) => {
    changeSpeed(speed);
  };

  const handleEqualizerChange = (preset) => {
    setEqualizerPreset(preset);
    // TODO: Connecter au vrai égaliseur quand disponible
  };

  const clearHistory = () => {
    Alert.alert(
      'Effacer l\'historique',
      'Voulez-vous vraiment effacer tout votre historique d\'écoute ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          onPress: async () => {
            // TODO: Implémenter clearHistory dans AudioService
            Alert.alert('Succès', 'Historique effacé');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const SettingRow = ({ icon, label, rightElement }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={22} color={theme.colors.primary} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {rightElement}
    </View>
  );

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lecture</Text>
          
          <SettingRow
            icon="repeat"
            label="Répétition"
            rightElement={
              <Switch
                value={isRepeat}
                onValueChange={toggleRepeat}
                trackColor={{ false: '#e2e8f0', true: theme.colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          
          <SettingRow
            icon="shuffle"
            label="Lecture aléatoire"
            rightElement={
              <Switch
                value={isShuffle}
                onValueChange={toggleShuffle}
                trackColor={{ false: '#e2e8f0', true: theme.colors.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitesse de lecture</Text>
          <View style={styles.speedGrid}>
            {speedOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.speedButton,
                  playbackSpeed === option.value && styles.activeSpeedButton,
                ]}
                onPress={() => handleSpeedChange(option.value)}
              >
                <Text
                  style={[
                    styles.speedButtonText,
                    playbackSpeed === option.value && styles.activeSpeedButtonText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Égaliseur</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsScroll}>
            {equalizerPresets.map((preset) => (
              <TouchableOpacity
                key={preset.value}
                style={[
                  styles.presetButton,
                  equalizerPreset === preset.value && styles.activePresetButton,
                ]}
                onPress={() => handleEqualizerChange(preset.value)}
              >
                <Text
                  style={[
                    styles.presetButtonText,
                    equalizerPreset === preset.value && styles.activePresetButtonText,
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          
          <SettingRow
            icon="notifications"
            label="Notifications"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#e2e8f0', true: theme.colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          
          <SettingRow
            icon="play-circle-outline"
            label="Lecture en arrière-plan"
            rightElement={
              <Switch
                value={backgroundPlay}
                onValueChange={setBackgroundPlay}
                trackColor={{ false: '#e2e8f0', true: theme.colors.primary }}
                thumbColor="#fff"
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Données</Text>
          
          <TouchableOpacity style={styles.actionRow} onPress={clearHistory}>
            <View style={styles.settingLeft}>
              <Icon name="delete-sweep" size={22} color="#ef4444" />
              <Text style={[styles.settingLabel, { color: '#ef4444' }]}>Effacer l'historique</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.aboutButton}
            onPress={() => navigation.navigate('About')}
          >
            <Text style={styles.aboutButtonText}>À propos de RCOLFM</Text>
            <Icon name="info-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  speedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  speedButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.gray,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeSpeedButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  speedButtonText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  activeSpeedButtonText: {
    color: '#fff',
  },
  presetsScroll: {
    flexGrow: 0,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.gray,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activePresetButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  presetButtonText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  activePresetButtonText: {
    color: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  aboutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutButtonText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  versionText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});