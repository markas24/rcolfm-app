import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudio } from '../context/AudioContext';
import { theme } from '../styles/theme';

export default function FavoritesScreen() {
  const { favorites, playTrack, removeFromFavorites, currentTrack, isPlaying, formatTime } = useAudio();
  const [favoriteTracks, setFavoriteTracks] = useState([]);

  useEffect(() => {
    setFavoriteTracks(favorites);
  }, [favorites]);

  const handlePlay = (track) => {
    playTrack(track);
  };

  const handleRemove = (trackId, trackTitle) => {
    Alert.alert(
      'Retirer des favoris',
      `Voulez-vous retirer "${trackTitle}" de vos favoris ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          onPress: () => removeFromFavorites(trackId),
          style: 'destructive',
        },
      ]
    );
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Matinale': return 'wb-sunny';
      case 'Culture': return 'local-library';
      case 'Sport': return 'sports-soccer';
      case 'Musique': return 'music-note';
      case 'Actualités': return 'newspaper';
      default: return 'favorite';
    }
  };

  const renderItem = ({ item, index }) => {
    const isCurrent = currentTrack?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.favoriteItem, isCurrent && styles.activeItem]}
        onPress={() => handlePlay(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemLeft}>
          <Text style={styles.itemNumber}>{String(index + 1).padStart(2, '0')}</Text>
          <View style={[styles.itemIcon, isCurrent && styles.activeIcon]}>
            <Icon
              name={getCategoryIcon(item.category)}
              size={20}
              color={isCurrent ? '#fff' : theme.colors.primary}
            />
          </View>
        </View>

        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, isCurrent && styles.activeText]} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.itemMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <Text style={styles.itemDuration}>{item.duration}</Text>
          </View>
        </View>

        <View style={styles.itemActions}>
          {isCurrent && isPlaying && (
            <View style={styles.playingBadge}>
              <Icon name="volume-up" size={14} color={theme.colors.primary} />
            </View>
          )}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleRemove(item.id, item.title)}
          >
            <Icon name="delete-outline" size={22} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="favorite-border" size={80} color="#cbd5e1" />
      <Text style={styles.emptyStateTitle}>Aucun favori</Text>
      <Text style={styles.emptyStateText}>
        Ajoutez vos émissions préférées en appuyant sur le cœur ❤️
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        <Text style={styles.headerCount}>
          {favoriteTracks.length} émission{favoriteTracks.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={favoriteTracks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyState}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  headerCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
    backgroundColor: theme.colors.gray,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  favoriteItem: {
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
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemNumber: {
    width: 30,
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: {
    backgroundColor: theme.colors.primary,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  activeText: {
    color: theme.colors.primary,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: theme.colors.gray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  itemDuration: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playingBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
});