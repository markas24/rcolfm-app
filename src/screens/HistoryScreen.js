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

export default function HistoryScreen() {
  const { history, playTrack, currentTrack, isPlaying, formatTime } = useAudio();
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    setHistoryList(history);
  }, [history]);

  const handlePlay = (track) => {
    playTrack(track);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const renderItem = ({ item, index }) => {
    const isCurrent = currentTrack?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.historyItem, isCurrent && styles.activeItem]}
        onPress={() => handlePlay(item)}
        activeOpacity={0.7}
      >
        <View style={styles.itemIcon}>
          <Icon
            name="history"
            size={20}
            color={isCurrent ? theme.colors.primary : '#94a3b8'}
          />
        </View>

        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, isCurrent && styles.activeText]} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemDate}>{formatDate(item.playedAt)}</Text>
            <View style={styles.metaDot} />
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
      <Icon name="history" size={80} color="#cbd5e1" />
      <Text style={styles.emptyStateTitle}>Historique vide</Text>
      <Text style={styles.emptyStateText}>
        Les émissions que vous écoutez apparaîtront ici
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={theme.colors.backgroundGradient} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historique</Text>
        <Text style={styles.headerCount}>
          {historyList.length} émission{historyList.length > 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={historyList}
        keyExtractor={(item, index) => `${item.id}-${index}`}
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
  historyItem: {
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
    width: 44,
    height: 44,
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
    gap: 6,
  },
  itemDate: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#cbd5e1',
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
});