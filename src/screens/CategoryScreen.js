import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudio } from '../context/AudioContext';
import { theme } from '../styles/theme';

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const { tracks, playTrack, currentTrack, isPlaying } = useAudio();

  const categoryTracks = tracks.filter(track => track.category === category);

  const getCategoryIcon = () => {
    switch (category) {
      case 'Matinale': return 'wb-sunny';
      case 'Culture': return 'local-library';
      case 'Sport': return 'sports-soccer';
      case 'Musique': return 'music-note';
      case 'Actualités': return 'newspaper';
      default: return 'folder';
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'Matinale': return '#f59e0b';
      case 'Culture': return '#10b981';
      case 'Sport': return '#3b82f6';
      case 'Musique': return '#ec4899';
      case 'Actualités': return '#8b5cf6';
      default: return theme.colors.primary;
    }
  };

  const renderItem = ({ item, index }) => {
    const isCurrent = currentTrack?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.trackItem, isCurrent && styles.activeItem]}
        onPress={() => playTrack(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.itemNumber}>{String(index + 1).padStart(2, '0')}</Text>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, isCurrent && styles.activeText]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemDate}>{item.date}</Text>
        </View>
        <Text style={styles.itemDuration}>{item.duration}</Text>
        {isCurrent && isPlaying && (
          <Icon name="volume-up" size={16} color={theme.colors.primary} style={styles.playingIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      <View style={[styles.header, { backgroundColor: getCategoryColor() + '15' }]}>
        <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor() }]}>
          <Icon name={getCategoryIcon()} size={32} color="#fff" />
        </View>
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.categoryCount}>
          {categoryTracks.length} émission{categoryTracks.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={categoryTracks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadow.md,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  categoryCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeItem: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderColor: theme.colors.primary,
  },
  itemNumber: {
    width: 40,
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  activeText: {
    color: theme.colors.primary,
  },
  itemDate: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  itemDuration: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '500',
    marginRight: 8,
  },
  playingIcon: {
    marginLeft: 8,
  },
});