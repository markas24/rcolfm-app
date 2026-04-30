import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import AudioService from '../services/AudioService';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  
  const intervalRef = useRef(null);

  // Chargement initial
  useEffect(() => {
    loadInitialData();
    
    // Nettoyage
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const loadInitialData = async () => {
    await AudioService.init();
    setTracks(AudioService.playlist);
    setFavorites(AudioService.getFavorites());
    setHistory(AudioService.getHistory());
    setVolume(AudioService.volume);
    setPlaybackSpeed(AudioService.playbackSpeed);
    setIsRepeat(AudioService.isRepeat);
    setIsShuffle(AudioService.isShuffle);
    
    // Restaurer la piste en cours
    await AudioService.loadCurrentState();
    setCurrentTrack(AudioService.currentTrack);
    setIsPlaying(AudioService.isPlaying);
    setDuration(AudioService.duration);
    setCurrentTime(AudioService.currentPosition);
    
    // Mettre à jour la position en temps réel
    intervalRef.current = setInterval(() => {
      setCurrentTime(AudioService.currentPosition);
      setDuration(AudioService.duration);
      setIsPlaying(AudioService.isPlaying);
    }, 500);
  };

  const playTrack = async (track) => {
    const success = await AudioService.playTrack(track);
    if (success) {
      setCurrentTrack(AudioService.currentTrack);
      setIsPlaying(true);
      await AudioService.saveCurrentState();
    }
    return success;
  };

  const togglePlayPause = async () => {
    await AudioService.togglePlayPause();
    setIsPlaying(AudioService.isPlaying);
    await AudioService.saveCurrentState();
  };

  const nextTrack = async () => {
    await AudioService.playNextTrack();
    setCurrentTrack(AudioService.currentTrack);
    setIsPlaying(true);
    await AudioService.saveCurrentState();
  };

  const previousTrack = async () => {
    await AudioService.playPreviousTrack();
    setCurrentTrack(AudioService.currentTrack);
    setIsPlaying(true);
    await AudioService.saveCurrentState();
  };

  const seekTo = async (position) => {
    await AudioService.seekTo(position);
    setCurrentTime(position);
  };

  const changeVolume = async (vol) => {
    await AudioService.changeVolume(vol);
    setVolume(vol);
  };

  const changeSpeed = async (speed) => {
    await AudioService.changeSpeed(speed);
    setPlaybackSpeed(speed);
  };

  const toggleRepeat = () => {
    AudioService.toggleRepeat();
    setIsRepeat(!isRepeat);
  };

  const toggleShuffle = () => {
    AudioService.toggleShuffle();
    setIsShuffle(!isShuffle);
  };

  const addToFavorites = async (track) => {
    await AudioService.addToFavorites(track);
    setFavorites(AudioService.getFavorites());
  };

  const removeFromFavorites = async (trackId) => {
    await AudioService.removeFromFavorites(trackId);
    setFavorites(AudioService.getFavorites());
  };

  const isFavorite = (trackId) => {
    return AudioService.isFavorite(trackId);
  };

  const setSleepTimer = (minutes, callback) => {
    return AudioService.setSleepTimer(minutes, callback);
  };

  const cancelSleepTimer = () => {
    AudioService.cancelSleepTimer();
  };

  const formatTime = (seconds) => {
    return AudioService.formatTime(seconds);
  };

  const value = {
    // État
    currentTrack,
    isPlaying,
    tracks,
    currentTime,
    duration,
    volume,
    playbackSpeed,
    isRepeat,
    isShuffle,
    favorites,
    history,
    
    // Actions
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekTo,
    changeVolume,
    changeSpeed,
    toggleRepeat,
    toggleShuffle,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    setSleepTimer,
    cancelSleepTimer,
    formatTime,
    loadInitialData,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};