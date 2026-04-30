import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAudio } from '../context/AudioContext';
import { theme } from '../styles/theme';

export default function PlaylistScreen() {
  const { tracks, playTrack, currentTrack, isPlaying } = useAudio();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['Tous', 'Matinale', 'Culture', 'Sport', 'Musique', 'Actualités'];

  const filteredTracks = tracks.filter(track => {
    const matchSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Tous' || track.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const getCategoryIcon = (category) => {
    switch(category) {
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
        style={[styles.playlistItem, isCurrent && styles.activeItem]}
        onPress={() => playTrack(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.itemNumber}>{String(index + 1).padStart(2, '0')}</Text>
        <View style={[styles.itemIcon, isCurrent && styles.activeIcon]}>
          <Icon
            name={getCategoryIcon(item.category)}
            size={18}
            color={isCurrent ? '#fff' : theme.colors.primary}
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, isCurrent && styles.activeText]} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <Text style={styles.itemDate}>{item.date}</Text>
          </View>
        </View>
        <Text style={styles.itemDuration}>{item.duration}</Text>
        {isCurrent && isPlaying && (
          <View style={styles.playingIndicator}>
            <Icon name="volume-up" size={14} color={theme.colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      <View style={styles.header}>
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={theme.colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Catégories horizontales - comme maquette */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
        >
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.activeCategory,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.activeCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredTracks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer - comme maquette */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <Icon name="music-note" size={12} color={theme.colors.textMuted} />{' '}
          {filteredTracks.length} émissions • RCOLFM Communauté
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingLeft: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  categoriesContainer: {
    flexGrow: 0,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeCategory: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: theme.colors.white,
  },
  list: {
    padding: theme.spacing.lg,
    paddingBottom: 20,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeItem: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderColor: theme.colors.primary,
  },
  itemNumber: {
    width: 32,
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: {
    backgroundColor: theme.colors.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 2,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  itemDate: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  itemDuration: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  playingIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  footer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
});