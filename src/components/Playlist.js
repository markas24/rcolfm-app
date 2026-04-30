import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Playlist({ 
  tracks, 
  currentTrack, 
  onTrackSelect, 
  isPlaying,
  onPlayPause,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, title, duration
  const [isDescending, setIsDescending] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const categories = ['all', 'Matinale', 'Culture', 'Sport', 'Musique', 'Actualités', 'Débats'];

  // Filtrer et trier les pistes
  const getFilteredAndSortedTracks = () => {
    let filtered = tracks.filter(track => {
      const matchSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'all' || track.category === selectedCategory;
      return matchSearch && matchCategory;
    });

    // Trier
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date.split('/').reverse().join('-')) - 
                    new Date(b.date.split('/').reverse().join('-'));
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'duration') {
        const getSeconds = (duration) => {
          const parts = duration.split(':');
          return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        };
        comparison = getSeconds(a.duration) - getSeconds(b.duration);
      }
      return isDescending ? -comparison : comparison;
    });

    return filtered;
  };

  const filteredTracks = getFilteredAndSortedTracks();

  const toggleFavorite = (trackId) => {
    if (favorites.includes(trackId)) {
      setFavorites(favorites.filter(id => id !== trackId));
    } else {
      setFavorites([...favorites, trackId]);
    }
  };

  const addToRecentlyPlayed = (track) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 10);
    });
  };

  const handleTrackSelect = (track) => {
    onTrackSelect(track);
    addToRecentlyPlayed(track);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Matinale': return 'wb-sunny';
      case 'Culture': return 'local-library';
      case 'Sport': return 'sports-soccer';
      case 'Musique': return 'music-note';
      case 'Actualités': return 'newspaper';
      case 'Débats': return 'record-voice-over';
      default: return 'folder';
    }
  };

  const renderItem = ({ item, index }) => {
    const isFavorite = favorites.includes(item.id);
    const isCurrent = currentTrack?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.playlistItem,
          isCurrent && styles.activePlaylistItem,
        ]}
        onPress={() => handleTrackSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.playlistItemLeft}>
          <Text style={styles.playlistItemNumber}>
            {String(index + 1).padStart(2, '0')}
          </Text>
          <View style={[styles.playlistItemIcon, isCurrent && styles.activePlaylistItemIcon]}>
            <Icon 
              name={getCategoryIcon(item.category)} 
              size={20} 
              color={isCurrent ? '#fff' : '#dc2626'} 
            />
          </View>
        </View>

        <View style={styles.playlistItemContent}>
          <View style={styles.playlistItemHeader}>
            <Text style={[styles.playlistItemTitle, isCurrent && styles.activeText]} numberOfLines={1}>
              {item.title}
            </Text>
            {isCurrent && isPlaying && (
              <Animated.View style={styles.nowPlayingIndicator}>
                <Icon name="volume-up" size={14} color="#dc2626" />
                <Text style={styles.nowPlayingText}>En cours</Text>
              </Animated.View>
            )}
          </View>
          
          <View style={styles.playlistItemMeta}>
            <Icon name="calendar-today" size={10} color="#94a3b8" />
            <Text style={styles.playlistItemDate}>{item.date}</Text>
            <View style={styles.metaDot} />
            <Icon name="access-time" size={10} color="#94a3b8" />
            <Text style={styles.playlistItemDuration}>{item.duration}</Text>
            <View style={styles.metaDot} />
            <View style={styles.categoryChipSmall}>
              <Text style={styles.categoryChipSmallText}>{item.category}</Text>
            </View>
          </View>
        </View>

        <View style={styles.playlistItemActions}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => toggleFavorite(item.id)}
          >
            <Icon 
              name={isFavorite ? 'favorite' : 'favorite-border'} 
              size={20} 
              color={isFavorite ? '#dc2626' : '#94a3b8'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => handleTrackSelect(item)}
          >
            <Icon 
              name={isCurrent && isPlaying ? 'pause' : 'play-arrow'} 
              size={20} 
              color="#475569" 
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="queue-music" size={24} color="#dc2626" />
          <Text style={styles.statNumber}>{tracks.length}</Text>
          <Text style={styles.statLabel}>Émissions</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="favorite" size={24} color="#dc2626" />
          <Text style={styles.statNumber}>{favorites.length}</Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="history" size={24} color="#dc2626" />
          <Text style={styles.statNumber}>{recentlyPlayed.length}</Text>
          <Text style={styles.statLabel}>Récentes</Text>
        </View>
      </View>

      {/* Recherche */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une émission..."
          placeholderTextColor="#94a3b8"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Icon name="close" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Catégories */}
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
              selectedCategory === cat && styles.activeCategoryChip,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Icon 
              name={getCategoryIcon(cat === 'all' ? 'folder' : cat)} 
              size={14} 
              color={selectedCategory === cat ? '#fff' : '#475569'} 
            />
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === cat && styles.activeCategoryChipText,
              ]}
            >
              {cat === 'all' ? 'Tous' : cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Options de tri */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Trier par :</Text>
        <TouchableOpacity 
          style={[styles.sortBtn, sortBy === 'date' && styles.activeSortBtn]}
          onPress={() => {
            if (sortBy === 'date') setIsDescending(!isDescending);
            else setSortBy('date');
          }}
        >
          <Icon name="date-range" size={16} color={sortBy === 'date' ? '#dc2626' : '#475569'} />
          <Text style={[styles.sortBtnText, sortBy === 'date' && styles.activeSortText]}>
            Date {sortBy === 'date' && (isDescending ? '↓' : '↑')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sortBtn, sortBy === 'title' && styles.activeSortBtn]}
          onPress={() => {
            if (sortBy === 'title') setIsDescending(!isDescending);
            else setSortBy('title');
          }}
        >
          <Icon name="sort-by-alpha" size={16} color={sortBy === 'title' ? '#dc2626' : '#475569'} />
          <Text style={[styles.sortBtnText, sortBy === 'title' && styles.activeSortText]}>
            Titre {sortBy === 'title' && (isDescending ? '↓' : '↑')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.sortBtn, sortBy === 'duration' && styles.activeSortBtn]}
          onPress={() => {
            if (sortBy === 'duration') setIsDescending(!isDescending);
            else setSortBy('duration');
          }}
        >
          <Icon name="access-time" size={16} color={sortBy === 'duration' ? '#dc2626' : '#475569'} />
          <Text style={[styles.sortBtnText, sortBy === 'duration' && styles.activeSortText]}>
            Durée {sortBy === 'duration' && (isDescending ? '↓' : '↑')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="queue-music" size={80} color="#cbd5e1" />
      <Text style={styles.emptyStateTitle}>Aucune émission trouvée</Text>
      <Text style={styles.emptyStateText}>
        Essayez de modifier vos critères de recherche
      </Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        <Icon name="music-note" size={12} /> {filteredTracks.length} / {tracks.length} émissions
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={['#f5f7fa', '#e8edf2']} style={styles.container}>
      <FlatList
        data={filteredTracks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 14,
    color: '#1e293b',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeCategoryChip: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  activeCategoryChipText: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    paddingTop: 8,
  },
  sortLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeSortBtn: {
    borderColor: '#dc2626',
    backgroundColor: 'rgba(220, 38, 38, 0.05)',
  },
  sortBtnText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  activeSortText: {
    color: '#dc2626',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activePlaylistItem: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderColor: '#dc2626',
  },
  playlistItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playlistItemNumber: {
    width: 30,
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  playlistItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eef2f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePlaylistItemIcon: {
    backgroundColor: '#dc2626',
  },
  playlistItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  playlistItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  playlistItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  activeText: {
    color: '#dc2626',
  },
  nowPlayingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  nowPlayingText: {
    fontSize: 9,
    color: '#dc2626',
    fontWeight: '600',
  },
  playlistItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playlistItemDate: {
    fontSize: 10,
    color: '#94a3b8',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#cbd5e1',
  },
  playlistItemDuration: {
    fontSize: 10,
    color: '#94a3b8',
  },
  categoryChipSmall: {
    backgroundColor: '#eef2f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryChipSmallText: {
    fontSize: 9,
    color: '#475569',
    fontWeight: '500',
  },
  playlistItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    color: '#1e293b',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 8,
  },
  footerText: {
    fontSize: 11,
    color: '#94a3b8',
  },
});