import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudio } from '../context/AudioContext';
import { theme } from '../styles/theme';

export default function SearchScreen() {
  const { tracks, playTrack, currentTrack, isPlaying } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Matinale', 'Culture', 'Sport', 'Musique', 'Actualités'];

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          track.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || track.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Matinale': return 'wb-sunny';
      case 'Culture': return 'local-library';
      case 'Sport': return 'sports-soccer';
      case 'Musique': return 'music-note';
      case 'Actualités': return 'newspaper';
      default: return 'folder';
    }
  };

  const renderItem = ({ item, index }) => {
    const isCurrent = currentTrack?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.resultItem, isCurrent && styles.activeItem]}
        onPress={() => playTrack(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemIcon}>
          <Icon
            name={getCategoryIcon(item.category)}
            size={20}
            color={isCurrent ? '#fff' : theme.colors.primary}
          />
        </View>

        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, isCurrent && styles.activeText]} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <Text style={styles.itemDuration}>{item.duration}</Text>
          </View>
        </View>

        {isCurrent && isPlaying && (
          <View style={styles.playingIndicator}>
            <Icon name="volume-up" size={16} color={theme.colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="search-off" size={80} color="#cbd5e1" />
      <Text style={styles.emptyStateTitle}>Aucun résultat</Text>
      <Text style={styles.emptyStateText}>
        Essayez avec d'autres mots-clés
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={22} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une émission..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              selectedCategory === cat && styles.activeCategoryChip,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.activeCategoryText,
              ]}
            >
              {cat === 'all' ? 'Tous' : cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredTracks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {filteredTracks.length} résultat{filteredTracks.length > 1 ? 's' : ''}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingLeft: theme.spacing.sm,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeCategoryChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 20,
  },
  resultItem: {
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
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
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
  itemCategory: {
    fontSize: 10,
    color: theme.colors.textMuted,
    backgroundColor: theme.colors.gray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  itemDuration: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  playingIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
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
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.sm,
  },
  footerText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
});