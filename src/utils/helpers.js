import { Platform, Dimensions, PixelRatio } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ==================== FORMATAGE ====================

/**
 * Formate le temps en mm:ss
 * @param {number} seconds - Temps en secondes
 * @returns {string} Temps formaté
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
    return '00:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formate la durée en heures, minutes, secondes
 * @param {number} seconds - Durée en secondes
 * @returns {string} Durée formatée
 */
export const formatDurationLong = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0 secondes';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours} heure${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs} seconde${secs > 1 ? 's' : ''}`);
  
  return parts.join(' ');
};

/**
 * Formate la date
 * @param {string|Date} date - Date à formater
 * @param {string} format - Format souhaité
 * @returns {string} Date formatée
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Date invalide';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('HH', hours)
    .replace('mm', minutes);
};

/**
 * Formate le nombre avec séparateurs
 * @param {number} num - Nombre à formater
 * @returns {string} Nombre formaté
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

/**
 * Tronque un texte
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte tronqué
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// ==================== VALIDATION ====================

/**
 * Vérifie si une chaîne est une URL valide
 * @param {string} url - URL à vérifier
 * @returns {boolean} Est une URL valide
 */
export const isValidUrl = (url) => {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocole
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // nom de domaine
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // IP
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port et chemin
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // paramètres
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment
  return !!pattern.test(url);
};

/**
 * Vérifie si une chaîne est un email valide
 * @param {string} email - Email à vérifier
 * @returns {boolean} Est un email valide
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Vérifie si une chaîne est un numéro de téléphone valide
 * @param {string} phone - Téléphone à vérifier
 * @returns {boolean} Est un téléphone valide
 */
export const isValidPhone = (phone) => {
  const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  return regex.test(phone);
};

// ==================== STOCKAGE LOCAL ====================

/**
 * Sauvegarde des données dans AsyncStorage
 * @param {string} key - Clé de stockage
 * @param {any} value - Valeur à sauvegarder
 */
export const saveToStorage = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
    return false;
  }
};

/**
 * Récupère des données depuis AsyncStorage
 * @param {string} key - Clé de stockage
 * @returns {any|null} Données récupérées
 */
export const getFromStorage = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Erreur récupération:', error);
    return null;
  }
};

/**
 * Supprime des données d'AsyncStorage
 * @param {string} key - Clé à supprimer
 */
export const removeFromStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erreur suppression:', error);
    return false;
  }
};

// ==================== RESPONSIVE DESIGN ====================

/**
 * Scale en fonction de la largeur de l'écran
 * @param {number} size - Taille de base
 * @returns {number} Taille adaptée
 */
export const scaleWidth = (size) => {
  const guidelineBaseWidth = 375;
  return (SCREEN_WIDTH / guidelineBaseWidth) * size;
};

/**
 * Scale en fonction de la hauteur de l'écran
 * @param {number} size - Taille de base
 * @returns {number} Taille adaptée
 */
export const scaleHeight = (size) => {
  const guidelineBaseHeight = 667;
  return (SCREEN_HEIGHT / guidelineBaseHeight) * size;
};

/**
 * Scale en fonction de la densité de pixels
 * @param {number} size - Taille de base
 * @returns {number} Taille adaptée
 */
export const scaleFont = (size) => {
  const scale = Math.min(SCREEN_WIDTH / 375, 1.5);
  return Math.round(size * scale);
};

/**
 * Vérifie si l'appareil est un tablette
 * @returns {boolean} Est une tablette
 */
export const isTablet = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
  return adjustedWidth >= 600 || adjustedHeight >= 600;
};

/**
 * Vérifie si l'orientation est paysage
 * @returns {boolean} Est en paysage
 */
export const isLandscape = () => {
  return SCREEN_WIDTH > SCREEN_HEIGHT;
};

// ==================== COULEURS ====================

/**
 * Génère une couleur aléatoire
 * @returns {string} Couleur hexadécimale
 */
export const randomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Assombrit une couleur
 * @param {string} color - Couleur hexadécimale
 * @param {number} percent - Pourcentage d'assombrissement
 * @returns {string} Couleur assombrie
 */
export const darkenColor = (color, percent) => {
  let r, g, b;
  if (color.startsWith('#')) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else {
    return color;
  }
  
  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Éclaircit une couleur
 * @param {string} color - Couleur hexadécimale
 * @param {number} percent - Pourcentage d'éclaircissement
 * @returns {string} Couleur éclaircie
 */
export const lightenColor = (color, percent) => {
  let r, g, b;
  if (color.startsWith('#')) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else {
    return color;
  }
  
  r = Math.floor(r + (255 - r) * (percent / 100));
  g = Math.floor(g + (255 - g) * (percent / 100));
  b = Math.floor(b + (255 - b) * (percent / 100));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// ==================== ANIMATIONS ====================

/**
 * Crée une animation de pulsation
 * @param {number} duration - Durée en ms
 * @returns {Object} Configuration d'animation
 */
export const pulseAnimation = (duration = 1000) => {
  return {
    from: { scale: 1, opacity: 1 },
    to: { scale: 1.05, opacity: 0.7 },
    duration,
    useNativeDriver: true,
  };
};

/**
 * Crée une animation de fondu
 * @param {number} duration - Durée en ms
 * @returns {Object} Configuration d'animation
 */
export const fadeAnimation = (duration = 300) => {
  return {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration,
    useNativeDriver: true,
  };
};

/**
 * Crée une animation de slide
 * @param {number} distance - Distance en pixels
 * @param {string} direction - Direction ('up', 'down', 'left', 'right')
 * @returns {Object} Configuration d'animation
 */
export const slideAnimation = (distance = 100, direction = 'up') => {
  const from = { translateY: 0 };
  const to = { translateY: 0 };
  
  switch (direction) {
    case 'up':
      from.translateY = distance;
      to.translateY = 0;
      break;
    case 'down':
      from.translateY = -distance;
      to.translateY = 0;
      break;
    case 'left':
      from.translateX = distance;
      to.translateX = 0;
      break;
    case 'right':
      from.translateX = -distance;
      to.translateX = 0;
      break;
  }
  
  return {
    from,
    to,
    duration: 300,
    useNativeDriver: true,
  };
};

// ==================== DEBOUNCE & THROTTLE ====================

/**
 * Fonction debounce
 * @param {Function} func - Fonction à exécuter
 * @param {number} delay - Délai en ms
 * @returns {Function} Fonction debouncée
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Fonction throttle
 * @param {Function} func - Fonction à exécuter
 * @param {number} limit - Limite en ms
 * @returns {Function} Fonction throttlée
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// ==================== FICHIERS ====================

/**
 * Obtient l'extension d'un fichier
 * @param {string} filename - Nom du fichier
 * @returns {string} Extension
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Vérifie si un fichier est un audio
 * @param {string} filename - Nom du fichier
 * @returns {boolean} Est un fichier audio
 */
export const isAudioFile = (filename) => {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'];
  const ext = getFileExtension(filename).toLowerCase();
  return audioExtensions.includes(ext);
};

/**
 * Taille lisible d'un fichier
 * @param {number} bytes - Taille en bytes
 * @returns {string} Taille formatée
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ==================== RÉSEAU ====================

/**
 * Vérifie si l'appareil est connecté à internet
 * @returns {Promise<boolean>} Connecté ou non
 */
export const isConnected = async () => {
  try {
    // Utiliser NetInfo si disponible
    const NetInfo = require('@react-native-community/netinfo').default;
    const state = await NetInfo.fetch();
    return state.isConnected;
  } catch (error) {
    console.error('Erreur vérification connexion:', error);
    return true; // Assume connecté en cas d'erreur
  }
};

/**
 * Construit une URL avec paramètres
 * @param {string} baseUrl - URL de base
 * @param {Object} params - Paramètres
 * @returns {string} URL complète
 */
export const buildUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

// ==================== PERFORMANCE ====================

/**
 * Mesure le temps d'exécution d'une fonction
 * @param {Function} func - Fonction à mesurer
 * @returns {number} Temps d'exécution
 */
export const measurePerformance = (func) => {
  const start = performance.now();
  func();
  const end = performance.now();
  return end - start;
};

/**
 * Cache simple en mémoire
 */
export class SimpleCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes par défaut
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const expiry = Date.now() + this.ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

// ==================== PLATEFORME ====================

/**
 * Vérifie si l'appareil est iOS
 * @returns {boolean} Est iOS
 */
export const isIOS = () => Platform.OS === 'ios';

/**
 * Vérifie si l'appareil est Android
 * @returns {boolean} Est Android
 */
export const isAndroid = () => Platform.OS === 'android';

/**
 * Vérifie si l'appareil est Web
 * @returns {boolean} Est Web
 */
export const isWeb = () => Platform.OS === 'web';

/**
 * Obtient la version de l'OS
 * @returns {string} Version
 */
export const getOSVersion = () => {
  return Platform.Version;
};

// ==================== EXTRACTION DE DONNÉES ====================

/**
 * Extrait les paramètres d'une URL
 * @param {string} url - URL
 * @returns {Object} Paramètres
 */
export const getUrlParams = (url) => {
  const params = {};
  const urlObj = new URL(url);
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

/**
 * Extrait l'ID d'une URL YouTube
 * @param {string} url - URL YouTube
 * @returns {string|null} ID de la vidéo
 */
export const getYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// ==================== GESTION DES ERREURS ====================

/**
 * Formate une erreur pour l'affichage
 * @param {Error} error - Erreur
 * @returns {string} Message formaté
 */
export const formatError = (error) => {
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return 'Une erreur est survenue';
};

/**
 * Journalise une erreur
 * @param {Error} error - Erreur
 * @param {string} context - Contexte
 */
export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ${context ? `[${context}] ` : ''}${formatError(error)}`;
  console.error(message);
  
  // Sauvegarder dans AsyncStorage pour debug
  saveToStorage('last_error', { message, timestamp, context });
};

// ==================== EXPORT PAR DÉFAUT ====================

export default {
  formatTime,
  formatDurationLong,
  formatDate,
  formatNumber,
  truncateText,
  isValidUrl,
  isValidEmail,
  isValidPhone,
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  scaleWidth,
  scaleHeight,
  scaleFont,
  isTablet,
  isLandscape,
  randomColor,
  darkenColor,
  lightenColor,
  pulseAnimation,
  fadeAnimation,
  slideAnimation,
  debounce,
  throttle,
  getFileExtension,
  isAudioFile,
  formatFileSize,
  isConnected,
  buildUrl,
  measurePerformance,
  SimpleCache,
  isIOS,
  isAndroid,
  isWeb,
  getOSVersion,
  getUrlParams,
  getYoutubeId,
  formatError,
  logError,
};