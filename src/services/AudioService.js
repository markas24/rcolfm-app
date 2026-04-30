// src/services/AudioService.js - Version COMPLÈTE

import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Configuration API - À MODIFIER avec votre URL
const API_BASE_URL = 'http://192.168.1.XX/api'; // Remplacez par votre IP

// Configuration audio
Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
});

class AudioService {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.currentPosition = 0;
    this.duration = 0;
    this.volume = 0.7;
    this.playbackSpeed = 1.0;
    this.isRepeat = false;
    this.isShuffle = false;
    this.playlist = [];
    this.currentIndex = -1;
    this.history = [];
    this.favorites = [];
    this.positionListener = null;
    this.sleepTimer = null;
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadFavoritesFromAPI();
    await this.loadHistoryFromAPI();
    await this.loadPlaylistFromAPI();
  }

  // ==================== API CALLS ====================

  async loadPlaylistFromAPI() {
    try {
      const response = await axios.get(`${API_BASE_URL}/emissions.php`, {
        params: { limit: 100 }
      });
      
      if (response.data.success) {
        this.playlist = response.data.data;
        return this.playlist;
      }
      throw new Error('API response invalid');
    } catch (error) {
      console.error('Erreur chargement playlist API:', error);
      this.playlist = this.getMockPlaylist();
      return this.playlist;
    }
  }

  async loadFavoritesFromAPI() {
    try {
      const response = await axios.get(`${API_BASE_URL}/favorites.php`);
      if (response.data.success) {
        this.favorites = response.data.data;
        return this.favorites;
      }
    } catch (error) {
      console.error('Erreur chargement favoris API:', error);
      this.favorites = [];
    }
    return this.favorites;
  }

  async loadHistoryFromAPI() {
    try {
      const response = await axios.get(`${API_BASE_URL}/history.php`, {
        params: { limit: 50 }
      });
      if (response.data.success) {
        this.history = response.data.data;
        return this.history;
      }
    } catch (error) {
      console.error('Erreur chargement historique API:', error);
      this.history = [];
    }
    return this.history;
  }

  async addToHistory(track) {
    try {
      await axios.post(`${API_BASE_URL}/history.php`, {
        id: track.id,
        progress: Math.floor(this.currentPosition)
      });
      
      this.history = this.history.filter(t => t.id !== track.id);
      this.history.unshift({
        ...track,
        played_at: new Date().toISOString()
      });
      this.history = this.history.slice(0, 50);
      await this.saveHistory();
    } catch (error) {
      console.error('Erreur ajout historique:', error);
    }
  }

  async addToFavorites(track) {
    try {
      await axios.post(`${API_BASE_URL}/favorites.php`, { id: track.id });
      if (!this.favorites.find(t => t.id === track.id)) {
        this.favorites.push(track);
        await this.saveFavorites();
      }
      return true;
    } catch (error) {
      console.error('Erreur ajout favori:', error);
      return false;
    }
  }

  async removeFromFavorites(trackId) {
    try {
      await axios.delete(`${API_BASE_URL}/favorites.php`, {
        params: { id: trackId }
      });
      this.favorites = this.favorites.filter(t => t.id !== trackId);
      await this.saveFavorites();
    } catch (error) {
      console.error('Erreur suppression favori:', error);
    }
  }

  isFavorite(trackId) {
    return this.favorites.some(t => t.id === trackId);
  }

  getFavorites() {
    return [...this.favorites];
  }

  getHistory() {
    return [...this.history];
  }

  async updatePlayStats(trackId) {
    try {
      await axios.post(`${API_BASE_URL}/increment_play.php`, { id: trackId });
    } catch (error) {
      console.error('Erreur mise à jour statistiques:', error);
    }
  }

  async searchTracks(query, categoryId = null) {
    try {
      const response = await axios.get(`${API_BASE_URL}/search.php`, {
        params: { q: query, category: categoryId, limit: 30 }
      });
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Erreur recherche:', error);
      return [];
    }
  }

  // ==================== MOCK DATA ====================

  getMockPlaylist() {
    return [
      {
        id: '1',
        title: 'Le Grand Réveil - Émission du Matin',
        category: 'Matinale',
        duration: '45:30',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        date: '15/12/2024',
        image: null,
        description: 'Commencez votre journée avec les meilleurs titres',
        plays: 1250,
      },
      {
        id: '2',
        title: 'Culture Locale - Traditions et Patrimoine',
        category: 'Culture',
        duration: '52:15',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        date: '14/12/2024',
        image: null,
        description: 'Découvrez la richesse culturelle de notre région',
        plays: 890,
      },
      {
        id: '3',
        title: 'Les Titans du Terrain - Sports',
        category: 'Sport',
        duration: '38:45',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        date: '13/12/2024',
        image: null,
        description: 'Toute l\'actualité sportive locale et nationale',
        plays: 2100,
      },
      {
        id: '4',
        title: 'Les Tubes du Moment',
        category: 'Musique',
        duration: '60:00',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        date: '12/12/2024',
        image: null,
        description: 'Les meilleurs titres du moment',
        plays: 3450,
      },
      {
        id: '5',
        title: 'Flash Info - Journal Local',
        category: 'Actualités',
        duration: '15:30',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        date: '11/12/2024',
        image: null,
        description: 'Toute l\'actualité de votre région',
        plays: 5670,
      },
    ];
  }

  // ==================== LOAD/SAVE SETTINGS ====================

  async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem('audio_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.volume = parsed.volume ?? 0.7;
        this.playbackSpeed = parsed.playbackSpeed ?? 1.0;
        this.isRepeat = parsed.isRepeat ?? false;
        this.isShuffle = parsed.isShuffle ?? false;
      }
    } catch (error) {
      console.error('Erreur chargement settings:', error);
    }
  }

  async saveSettings() {
    try {
      const settings = {
        volume: this.volume,
        playbackSpeed: this.playbackSpeed,
        isRepeat: this.isRepeat,
        isShuffle: this.isShuffle,
      };
      await AsyncStorage.setItem('audio_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erreur sauvegarde settings:', error);
    }
  }

  async saveFavorites() {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Erreur sauvegarde favoris:', error);
    }
  }

  async saveHistory() {
    try {
      await AsyncStorage.setItem('history', JSON.stringify(this.history));
    } catch (error) {
      console.error('Erreur sauvegarde historique:', error);
    }
  }

  async saveCurrentState() {
    try {
      const state = {
        currentTrack: this.currentTrack,
        currentPosition: this.currentPosition,
        isPlaying: this.isPlaying,
        currentIndex: this.currentIndex,
      };
      await AsyncStorage.setItem('current_state', JSON.stringify(state));
    } catch (error) {
      console.error('Erreur sauvegarde état:', error);
    }
  }

  async loadCurrentState() {
    try {
      const state = await AsyncStorage.getItem('current_state');
      if (state) {
        const parsed = JSON.parse(state);
        if (parsed.currentTrack) {
          this.currentTrack = parsed.currentTrack;
          this.currentPosition = parsed.currentPosition || 0;
          this.currentIndex = parsed.currentIndex || -1;
          if (parsed.isPlaying) {
            await this.resumePlayback();
          }
        }
      }
    } catch (error) {
      console.error('Erreur chargement état:', error);
    }
  }

  async resumePlayback() {
    if (this.currentTrack && this.currentTrack.url) {
      await this.loadSound(this.currentTrack.url, this.currentPosition);
    }
  }

  // ==================== LECTURE AUDIO ====================

  async loadSound(url, position = 0) {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { 
          shouldPlay: true,
          volume: this.volume,
          rate: this.playbackSpeed,
          positionMillis: position * 1000,
        },
        this.onPlaybackStatusUpdate.bind(this)
      );
      
      this.sound = sound;
      return true;
    } catch (error) {
      console.error('Erreur chargement son:', error);
      return false;
    }
  }

  onPlaybackStatusUpdate(status) {
    if (status.isLoaded) {
      this.currentPosition = status.positionMillis / 1000;
      this.duration = status.durationMillis / 1000;
      this.isPlaying = status.isPlaying;

      // Fin du morceau
      if (status.didJustFinish) {
        this.onTrackFinished();
      }
    }
  }

  async onTrackFinished() {
    if (this.isRepeat) {
      await this.seekTo(0);
      await this.sound?.playAsync();
    } else {
      await this.playNextTrack();
    }
  }

  async playTrack(track) {
    const success = await this.loadSound(track.url);
    if (success) {
      this.currentTrack = track;
      this.currentIndex = this.playlist.findIndex(t => t.id === track.id);
      this.isPlaying = true;
      
      await this.updatePlayStats(track.id);
      await this.addToHistory(track);
      await this.saveCurrentState();
    }
    return success;
  }

  async togglePlayPause() {
    if (!this.sound) return;
    
    if (this.isPlaying) {
      await this.sound.pauseAsync();
    } else {
      await this.sound.playAsync();
    }
    this.isPlaying = !this.isPlaying;
    await this.saveCurrentState();
  }

  async playNextTrack() {
    if (this.playlist.length === 0) return false;
    
    let nextIndex;
    if (this.isShuffle) {
      nextIndex = Math.floor(Math.random() * this.playlist.length);
    } else {
      nextIndex = (this.currentIndex + 1) % this.playlist.length;
    }
    
    const nextTrack = this.playlist[nextIndex];
    if (nextTrack) {
      return await this.playTrack(nextTrack);
    }
    return false;
  }

  async playPreviousTrack() {
    if (this.currentPosition > 3) {
      await this.seekTo(0);
      return true;
    }
    
    let prevIndex = this.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.playlist.length - 1;
    }
    
    const prevTrack = this.playlist[prevIndex];
    if (prevTrack) {
      return await this.playTrack(prevTrack);
    }
    return false;
  }

  async seekTo(position) {
    if (this.sound && position >= 0 && position <= this.duration) {
      await this.sound.setPositionAsync(position * 1000);
      this.currentPosition = position;
    }
  }

  async changeVolume(vol) {
    this.volume = Math.min(1, Math.max(0, vol));
    if (this.sound) {
      await this.sound.setVolumeAsync(this.volume);
    }
    await this.saveSettings();
  }

  async changeSpeed(speed) {
    this.playbackSpeed = speed;
    if (this.sound) {
      await this.sound.setRateAsync(speed, { pitchCorrectionQuality: Audio.PitchCorrectionQuality.High });
    }
    await this.saveSettings();
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.saveSettings();
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    this.saveSettings();
  }

  // ==================== MINUTERIE ====================

  setSleepTimer(minutes, callback) {
    this.cancelSleepTimer();
    this.sleepTimer = setTimeout(() => {
      this.togglePlayPause();
      if (callback) callback();
      this.sleepTimer = null;
    }, minutes * 60 * 1000);
    return this.sleepTimer;
  }

  cancelSleepTimer() {
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
  }

  // ==================== UTILITAIRES ====================

  formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
      return '00:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

export default new AudioService();