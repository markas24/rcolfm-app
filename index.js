/**
 * RCOLFM Studio - Application Radio Communautaire
 * @format
 * @description Point d'entrée principal de l'application
 */

import 'react-native-gesture-handler';
import { AppRegistry, LogBox, Platform, UIManager } from 'react-native';
import { name as appName } from './app.json';
import App from './App';
import { enableScreens } from 'react-native-screens';

// ==================== CONFIGURATION INITIALE ====================

// Activer les écrans optimisés pour la performance
enableScreens(true);

// Configuration spécifique à Android pour le layout animé
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Ignorer les avertissements non critiques pour une meilleure expérience
// (Ces avertissements sont souvent liés à des bibliothèques tierces)
LogBox.ignoreLogs([
  'Require cycle:',
  'Remote debugger',
  'AsyncStorage has been extracted from react-native core',
  'Warning: ...',
  '`new NativeEventEmitter()` was called with a non-null argument',
  'Module RCTImageLoader requires main queue setup',
  'Possible Unhandled Promise Rejection',
  'Setting a timer for a long period of time',
]);

// Ignorer spécifiquement les avertissements de dépendances non critiques
if (__DEV__) {
  console.log('🚀 RCOLFM Studio - Mode Développement');
  console.log(`📱 Plateforme: ${Platform.OS} ${Platform.Version}`);
  console.log(`🎵 Application prête à être utilisée`);
} else {
  console.log('🎙️ RCOLFM Studio - Mode Production');
}

// ==================== GESTION DES ERREURS GLOBALES ====================

// Gestionnaire d'erreurs globales pour le développement
if (__DEV__) {
  const originalError = console.error;
  console.error = (...args) => {
    // Filtrer les erreurs de redondance
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') ||
        args[0].includes('Require cycle:') ||
        args[0].includes('`new NativeEventEmitter()`'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

// Gestionnaire d'erreurs non capturées
const errorHandler = (error, isFatal) => {
  if (__DEV__) {
    console.error('⚠️ Erreur non capturée:', error);
    if (isFatal) {
      console.error('❌ Erreur fatale:', error);
    }
  } else {
    // En production, logger silencieusement
    // (Envoyer à un service de monitoring si configuré)
    console.log('Erreur capturée:', error.message);
  }
};

// Enregistrer le gestionnaire d'erreurs
ErrorUtils.setGlobalHandler(errorHandler);

// Gestionnaire de promesses non capturées
if (typeof __METRO_GLOBAL_ERROR_EVENT_LISTENER__ === 'undefined') {
  if (typeof global !== 'undefined' && global.HermesInternal) {
    // Configuration Hermes spécifique
    console.log('🎯 Moteur JavaScript: Hermes');
  }
}

// ==================== FONCTIONS UTILITAIRES GLOBALES ====================

/**
 * Fonction de débogage globale (accessible dans la console)
 * @param {any} data - Données à logger
 * @param {string} label - Label optionnel
 */
global.debug = (data, label = 'DEBUG') => {
  if (__DEV__) {
    console.log(`🔍 [${label}]:`, data);
  }
};

/**
 * Fonction de mesure de performance globale
 * @param {string} label - Label de la mesure
 * @returns {Function} Fonction à appeler pour terminer la mesure
 */
global.measurePerf = (label) => {
  if (!__DEV__) return () => {};
  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
  };
};

/**
 * Fonction pour vider le cache de l'application
 */
global.clearAppCache = async () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    console.log('✅ Cache vidé avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du vidage du cache:', error);
    return false;
  }
};

/**
 * Fonction pour obtenir les informations de l'application
 */
global.getAppInfo = () => {
  return {
    name: 'RCOLFM Studio',
    version: '1.0.0',
    platform: Platform.OS,
    platformVersion: Platform.Version,
    isDev: __DEV__,
    timestamp: new Date().toISOString(),
  };
};

// ==================== CONFIGURATION AUDIO GLOBALE ====================

// Configuration audio pour le mode silencieux
if (Platform.OS === 'ios') {
  // Configuration spécifique iOS pour l'audio en arrière-plan
  const Audio = require('expo-av').Audio;
  Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
  }).catch(error => {
    console.error('Erreur configuration audio:', error);
  });
}

// ==================== CONFIGURATION DES NOTIFICATIONS ====================

// Configurer les notifications pour le contrôle audio (si nécessaire)
const setupNotifications = async () => {
  try {
    if (Platform.OS === 'android') {
      // Configuration des canaux de notification pour Android
      const { default: Notifee } = await import('@notifee/react-native');
      await Notifee.createChannel({
        id: 'audio_channel',
        name: 'Lecture Audio',
        importance: 3,
        vibration: false,
        sound: undefined,
      });
      console.log('📢 Canal de notification configuré');
    }
  } catch (error) {
    // Les notifications ne sont pas critiques pour le fonctionnement
    console.log('Notifications non configurées:', error.message);
  }
};

// Appeler la configuration des notifications de manière asynchrone
setupNotifications();

// ==================== CONFIGURATION DES BACKGROUND TASKS ====================

// Configurer les tâches en arrière-plan pour l'audio
const setupBackgroundTasks = async () => {
  try {
    const { default: BackgroundFetch } = await import('react-native-background-fetch');
    
    // Configurer la récupération en arrière-plan
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // minutes
        stopOnTerminate: false,
        startOnBoot: true,
      },
      async (taskId) => {
        console.log('🔄 Tâche de fond exécutée');
        // Ici, vous pouvez ajouter des tâches comme la mise à jour de la playlist
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.error('❌ Erreur background fetch:', error);
      }
    );
  } catch (error) {
    console.log('Background tasks non configurées:', error.message);
  }
};

// Appeler la configuration des tâches de fond
setupBackgroundTasks();

// ==================== MONITORING DE PERFORMANCE ====================

// Suivi des performances en développement
if (__DEV__) {
  let interactionCount = 0;
  let lastInteraction = Date.now();

  const trackInteraction = () => {
    interactionCount++;
    const now = Date.now();
    const timeSinceLast = now - lastInteraction;
    if (timeSinceLast > 5000 && interactionCount > 10) {
      console.log(`📊 Interactions: ${interactionCount} en ${timeSinceLast}ms`);
      interactionCount = 0;
    }
    lastInteraction = now;
  };

  // Tracer les interactions utilisateur
  const originalAddEventListener = document?.addEventListener;
  if (originalAddEventListener) {
    document.addEventListener = function(type, listener, options) {
      if (type === 'click' || type === 'touchstart') {
        trackInteraction();
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
  }
}

// ==================== ENREGISTREMENT DE L'APPLICATION ====================

/**
 * Point d'entrée principal
 * Enregistre le composant principal de l'application
 */
AppRegistry.registerComponent(appName, () => App);

// ==================== CONFIGURATION POUR LE WEB ====================

// Configuration spécifique pour la plateforme Web
if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root');
  if (rootTag) {
    // Configuration supplémentaire pour le web
    const style = document.createElement('style');
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background: linear-gradient(135deg, #f5f7fa 0%, #e8edf2 100%);
        min-height: 100vh;
      }
      
      #root {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
      
      /* Scrollbar personnalisée pour le web */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: #e2e8f0;
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #dc2626;
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #b91c1c;
      }
      
      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(style);
    
    // Détection du mode sombre
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      console.log('🌙 Mode sombre détecté');
    }
  }
}

// ==================== CONFIGURATION POUR TESTS ====================

// Exporter des utilitaires pour les tests (si en environnement de test)
if (process.env.NODE_ENV === 'test') {
  module.exports = {
    // Exporter des fonctions utilitaires pour les tests
    resetApp: async () => {
      await global.clearAppCache();
      console.log('🔄 Application réinitialisée pour les tests');
    },
    getAppState: () => {
      return global.getAppInfo();
    },
  };
}

// ==================== MESSAGE DE DÉMARRAGE ====================

// Afficher un message de démarrage personnalisé
const startupMessage = `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║     🎙️  RCOLFM STUDIO - Radio Communautaire 93.6 FM     ║
║                                                          ║
║     📱 Plateforme: ${Platform.OS === 'ios' ? '🍎 iOS' : Platform.OS === 'android' ? '🤖 Android' : '🌐 Web'}                         
║     🎵 Version: 1.0.0                                   
║     🚀 Mode: ${__DEV__ ? '🔧 Développement' : '⚡ Production'}                                   
║                                                          ║
║     "La voix de la communauté - 100% locale"            ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`;

console.log(startupMessage);

// ==================== EXPORT PAR DÉFAUT ====================
// Note: L'exportation n'est pas nécessaire pour React Native
// Le registre de l'application est suffisant