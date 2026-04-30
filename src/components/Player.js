import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

export default function Player({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  onSeek,
  currentTime,
  duration,
  formatTime,
  volume,
  onVolumeChange,
  playbackSpeed,
  onSpeedChange,
  isRepeat,
  onRepeatToggle,
  isShuffle,
  onShuffleToggle,
  tracks,
  onTrackSelect,
  onLivePress,
}) {
  const [isEqVisible, setIsEqVisible] = useState(true);
  const [isVolumeModalVisible, setIsVolumeModalVisible] = useState(false);
  const [isSpeedModalVisible, setIsSpeedModalVisible] = useState(false);
  const [isPlaylistModalVisible, setIsPlaylistModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const eqBars = useRef([...Array(12)].map(() => new Animated.Value(20))).current;

  // Animation de l'album art pendant la lecture
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
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
      
      // Animation de pulsation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
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
    } else {
      scaleAnim.setValue(1);
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  // Animation de l'égaliseur
  useEffect(() => {
    let animation;
    if (isPlaying && isEqVisible) {
      const animateEq = () => {
        const animations = eqBars.map(bar => {
          const randomHeight = Math.random() * 50 + 15;
          return Animated.timing(bar, {
            toValue: randomHeight,
            duration: 150,
            useNativeDriver: false,
          });
        });
        animation = Animated.parallel(animations);
        animation.start(() => {
          if (isPlaying && isEqVisible) animateEq();
        });
      };
      animateEq();
    } else {
      eqBars.forEach(bar => bar.setValue(20));
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [isPlaying, isEqVisible]);

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  
  const categories = ['all', 'Matinale', 'Culture', 'Sport', 'Musique', 'Actualités'];

  const filteredTracks = tracks.filter(track => {
    const matchSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || track.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const getSpeedLabel = (speed) => {
    if (speed === 1.0) return 'Normal';
    if (speed < 1) return 'Lent';
    return 'Rapide';
  };

  return (
    <LinearGradient colors={['#f5f7fa', '#e8edf2']} style={styles.container}>
      <View style={styles.content}>
        {/* Header avec logo et contrôles */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#dc2626', '#b91c1c']}
              style={styles.logoIcon}
            >
              <Icon name="radio" size={24} color="#fff" />
            </LinearGradient>
            <View>
              <Text style={styles.radioName}>RCOLFM 93.6</Text>
              <Text style={styles.slogan}>La voix de la communauté • 100% locale</Text>
            </View>
          </View>
          <View style={styles.headerControls}>
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={() => setIsPlaylistModalVisible(true)}
            >
              <Icon name="queue-music" size={24} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerBtn}
              onPress={onLivePress}
            >
              <Icon name="live-tv" size={24} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Album Art avec égaliseur */}
        <View style={styles.albumContainer}>
          <Animated.View 
            style={[
              styles.albumArtWrapper,
              {
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <LinearGradient
              colors={currentTrack ? ['#fee2e2', '#fecaca'] : ['#e2e8f0', '#cbd5e1']}
              style={styles.albumArt}
            >
              {currentTrack?.image ? (
                <Image source={{ uri: currentTrack.image }} style={styles.albumImage} />
              ) : (
                <Icon 
                  name="mic" 
                  size={80} 
                  color={currentTrack ? '#dc2626' : '#94a3b8'} 
                  style={{ opacity: 0.6 }} 
                />
              )}
            </LinearGradient>
            {isEqVisible && (
              <View style={styles.equalizerContainer}>
                {eqBars.map((bar, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.eqBar,
                      {
                        height: bar,
                        backgroundColor: '#dc2626',
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </Animated.View>
        </View>

        {/* Informations du morceau */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack?.title || 'Sélectionnez une émission'}
          </Text>
          <View style={styles.trackMeta}>
            <View style={styles.categoryBadge}>
              <Icon name="folder" size={12} color="#dc2626" />
              <Text style={styles.categoryText}>
                {currentTrack?.category || 'Prêt'}
              </Text>
            </View>
            <Text style={styles.duration}>
              {currentTrack?.duration || '--:--'}
            </Text>
          </View>
        </View>

        {/* Barre de progression */}
        <View style={styles.progressSection}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
          <Slider
            style={styles.slider}
            value={duration > 0 ? currentTime / duration : 0}
            onSlidingComplete={(value) => onSeek(value * duration)}
            minimumTrackTintColor="#dc2626"
            maximumTrackTintColor="#e2e8f0"
            thumbTintColor="#dc2626"
          />
        </View>

        {/* Contrôles de lecture */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.controlBtn, isShuffle && styles.activeBtn]}
            onPress={onShuffleToggle}
          >
            <Icon 
              name="shuffle" 
              size={24} 
              color={isShuffle ? '#dc2626' : '#475569'} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={onPrevious}>
            <Icon name="skip-previous" size={32} color="#1e293b" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.playBtn, styles.controlBtn]}
            onPress={onPlayPause}
          >
            <Icon 
              name={isPlaying ? 'pause' : 'play-arrow'} 
              size={40} 
              color="#fff" 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={onNext}>
            <Icon name="skip-next" size={32} color="#1e293b" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlBtn, isRepeat && styles.activeBtn]}
            onPress={onRepeatToggle}
          >
            <Icon 
              name="repeat" 
              size={24} 
              color={isRepeat ? '#dc2626' : '#475569'} 
            />
          </TouchableOpacity>
        </View>

        {/* Contrôles volume et vitesse */}
        <View style={styles.extrasContainer}>
          <TouchableOpacity 
            style={styles.extraBtn}
            onPress={() => setIsVolumeModalVisible(true)}
          >
            <Icon 
              name={volume === 0 ? 'volume-off' : volume < 0.5 ? 'volume-down' : 'volume-up'} 
              size={20} 
              color="#475569" 
            />
            <Text style={styles.extraText}>{Math.round(volume * 100)}%</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.extraBtn}
            onPress={() => setIsSpeedModalVisible(true)}
          >
            <Icon name="speed" size={20} color="#475569" />
            <Text style={styles.extraText}>{playbackSpeed}x</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.extraBtn, isEqVisible && styles.activeExtra]}
            onPress={() => setIsEqVisible(!isEqVisible)}
          >
            <Icon name="equalizer" size={20} color={isEqVisible ? '#dc2626' : '#475569'} />
            <Text style={[styles.extraText, isEqVisible && { color: '#dc2626' }]}>EQ</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Icon name="music-note" size={12} /> {tracks.length} émissions disponibles
          </Text>
        </View>
      </View>

      {/* Modal Volume */}
      <Modal
        visible={isVolumeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVolumeModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsVolumeModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Volume</Text>
                <Slider
                  style={styles.modalSlider}
                  value={volume}
                  onValueChange={onVolumeChange}
                  minimumValue={0}
                  maximumValue={1}
                  step={0.01}
                  minimumTrackTintColor="#dc2626"
                  maximumTrackTintColor="#e2e8f0"
                  thumbTintColor="#dc2626"
                />
                <Text style={styles.modalValue}>{Math.round(volume * 100)}%</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
                <Text style={styles.modalSubtitle}>{getSpeedLabel(playbackSpeed)}</Text>
                <View style={styles.speedGrid}>
                  {speeds.map((speed) => (
                    <TouchableOpacity
                      key={speed}
                      style={[
                        styles.speedOption,
                        playbackSpeed === speed && styles.activeSpeedOption,
                      ]}
                      onPress={() => {
                        onSpeedChange(speed);
                        setIsSpeedModalVisible(false);
                      }}
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

      {/* Modal Playlist */}
      <Modal
        visible={isPlaylistModalVisible}
        animationType="slide"
        onRequestClose={() => setIsPlaylistModalVisible(false)}
      >
        <LinearGradient colors={['#f5f7fa', '#e8edf2']} style={styles.modalFullScreen}>
          <View style={styles.playlistModalHeader}>
            <Text style={styles.playlistModalTitle}>Playlist</Text>
            <TouchableOpacity onPress={() => setIsPlaylistModalVisible(false)}>
              <Icon name="close" size={28} color="#1e293b" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher..."
              placeholderTextColor="#94a3b8"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
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
                    styles.categoryChipText,
                    selectedCategory === cat && styles.activeCategoryChipText,
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
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.playlistItem,
                  currentTrack?.id === item.id && styles.activePlaylistItem,
                ]}
                onPress={() => {
                  onTrackSelect(item);
                  setIsPlaylistModalVisible(false);
                }}
              >
                <Text style={styles.playlistItemNumber}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <View style={styles.playlistItemIcon}>
                  <Icon 
                    name="headset" 
                    size={20} 
                    color={currentTrack?.id === item.id ? '#fff' : '#dc2626'} 
                  />
                </View>
                <View style={styles.playlistItemInfo}>
                  <Text style={styles.playlistItemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.playlistItemMeta}>
                    <Icon name="calendar-today" size={10} /> {item.date}
                  </Text>
                </View>
                <Text style={styles.playlistItemDuration}>{item.duration}</Text>
                {currentTrack?.id === item.id && isPlaying && (
                  <Animated.View 
                    style={[
                      styles.playingIndicator,
                      { transform: [{ scale: pulseAnim }] }
                    ]}
                  >
                    <Icon name="volume-up" size={16} color="#dc2626" />
                  </Animated.View>
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.playlistList}
            showsVerticalScrollIndicator={false}
          />
        </LinearGradient>
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
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  radioName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  slogan: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '500',
  },
  headerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eef2f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  albumArtWrapper: {
    width: width - 100,
    height: width - 100,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  albumArt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumImage: {
    width: '100%',
    height: '100%',
  },
  equalizerContainer: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  eqBar: {
    width: 4,
    borderRadius: 2,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  trackMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '500',
  },
  duration: {
    fontSize: 12,
    color: '#94a3b8',
  },
  progressSection: {
    marginBottom: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 30,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 24,
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    backgroundColor: '#dc2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  activeBtn: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  extrasContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  extraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeExtra: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  extraText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: width - 80,
    alignItems: 'center',
    gap: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  modalSlider: {
    width: '100%',
    height: 30,
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
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
    borderRadius: 12,
    backgroundColor: '#eef2f6',
    alignItems: 'center',
  },
  activeSpeedOption: {
    backgroundColor: '#dc2626',
  },
  speedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  activeSpeedText: {
    color: '#fff',
  },
  modalFullScreen: {
    flex: 1,
  },
  playlistModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  playlistModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 24,
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
    paddingHorizontal: 20,
  },
  categoryChip: {
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
  playlistList: {
    paddingHorizontal: 20,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activePlaylistItem: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderColor: '#dc2626',
  },
  playlistItemNumber: {
    width: 30,
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textAlign: 'center',
  },
  playlistItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eef2f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistItemInfo: {
    flex: 1,
  },
  playlistItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  playlistItemMeta: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
  },
  playlistItemDuration: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  playingIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});