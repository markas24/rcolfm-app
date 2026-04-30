import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

export default function AboutScreen() {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            style={styles.logoIcon}
          >
            <Icon name="radio" size={50} color="#fff" />
          </LinearGradient>
          <Text style={styles.appName}>RCOLFM Studio</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.description}>
            RCOLFM est la radio communautaire 100% locale. Notre mission est de
            promouvoir la culture locale, informer la communauté et diffuser
            la meilleure musique.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          
          <View style={styles.infoRow}>
            <Icon name="favorite" size={20} color={theme.colors.primary} />
            <Text style={styles.infoText}>Radio 100% communautaire</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="mic" size={20} color={theme.colors.primary} />
            <Text style={styles.infoText}>Émissions locales et variées</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="music-note" size={20} color={theme.colors.primary} />
            <Text style={styles.infoText}>Musique sans publicité</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coordonnées</Text>
          
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => openLink('mailto:contact@rcolfm.com')}
          >
            <Icon name="email" size={20} color={theme.colors.primary} />
            <Text style={styles.contactText}>contact@rcolfm.com</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => openLink('tel:+33123456789')}
          >
            <Icon name="phone" size={20} color={theme.colors.primary} />
            <Text style={styles.contactText}>01 23 45 67 89</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => openLink('https://rcolfm.com')}
          >
            <Icon name="language" size={20} color={theme.colors.primary} />
            <Text style={styles.contactText}>www.rcolfm.com</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suivez-nous</Text>
          
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => openLink('https://facebook.com/rcolfm')}
            >
              <Icon name="facebook" size={24} color="#1877f2" />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => openLink('https://twitter.com/rcolfm')}
            >
              <Icon name="twitter" size={24} color="#1da1f2" />
              <Text style={styles.socialText}>Twitter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.socialBtn}
              onPress={() => openLink('https://instagram.com/rcolfm')}
            >
              <Icon name="instagram" size={24} color="#e4405f" />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 RCOLFM - Tous droits réservés
          </Text>
          <Text style={styles.footerSubtext}>
            "La voix de la communauté - 100% locale"
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.xl,
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.md,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
  },
  version: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  section: {
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: theme.spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: theme.spacing.sm,
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: theme.spacing.md,
  },
  socialBtn: {
    alignItems: 'center',
    gap: 8,
  },
  socialText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  footerSubtext: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
});