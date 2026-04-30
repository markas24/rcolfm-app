import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

// Import des écrans
import PlayerScreen from '../screens/PlayerScreen';
import PlaylistScreen from '../screens/PlaylistScreen';
import LiveScreen from '../screens/LiveScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import SearchScreen from '../screens/SearchScreen';
import CategoryScreen from '../screens/CategoryScreen';

// Import du contexte audio
import { useAudio } from '../context/AudioContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Animation personnalisée pour les transitions
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

// Composant personnalisé pour l'onglet avec badge
function CustomTabBarButton({ children, onPress, badgeCount }) {
  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// Stack Navigator principal pour le lecteur
function PlayerStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        },
        headerTitleStyle: {
          color: '#1e293b',
          fontWeight: '600',
          fontSize: 18,
        },
        headerTintColor: '#dc2626',
        cardStyleInterpolator: forFade,
      }}
    >
      <Stack.Screen 
        name="PlayerMain" 
        component={PlayerScreen}
        options={{ 
          headerShown: false,
          title: 'Lecteur'
        }}
      />
      <Stack.Screen 
        name="PlayerDetail" 
        component={PlayerScreen}
        options={{ 
          title: 'Détails',
          headerBackTitleVisible: false
        }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator pour la playlist
function PlaylistStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        },
        headerTitleStyle: {
          color: '#1e293b',
          fontWeight: '600',
          fontSize: 18,
        },
        headerTintColor: '#dc2626',
      }}
    >
      <Stack.Screen 
        name="PlaylistMain" 
        component={PlaylistScreen}
        options={{ 
          title: 'Ma Playlist',
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Icon name="queue-music" size={22} color="#dc2626" />
              <Text style={styles.headerTitleText}>Ma Playlist</Text>
            </View>
          )
        }}
      />
      <Stack.Screen 
        name="CategoryDetail" 
        component={CategoryScreen}
        options={{ 
          title: 'Catégorie',
          headerBackTitleVisible: false
        }}
      />
      <Stack.Screen 
        name="SearchDetail" 
        component={SearchScreen}
        options={{ 
          title: 'Recherche',
          headerBackTitleVisible: false
        }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator pour le live
function LiveStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        },
        headerTitleStyle: {
          color: '#1e293b',
          fontWeight: '600',
          fontSize: 18,
        },
        headerTintColor: '#dc2626',
      }}
    >
      <Stack.Screen 
        name="LiveMain" 
        component={LiveScreen}
        options={{ 
          title: 'Direct',
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <View style={styles.liveDot} />
              <Text style={styles.headerTitleText}>En Direct</Text>
            </View>
          )
        }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator pour les favoris
function FavoritesStackNavigator() {
  const { favorites } = useAudio();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        },
        headerTitleStyle: {
          color: '#1e293b',
          fontWeight: '600',
          fontSize: 18,
        },
        headerTintColor: '#dc2626',
      }}
    >
      <Stack.Screen 
        name="FavoritesMain" 
        component={FavoritesScreen}
        options={{ 
          title: 'Favoris',
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Icon name="favorite" size={22} color="#dc2626" />
              <Text style={styles.headerTitleText}>Mes Favoris</Text>
              {favorites.length > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{favorites.length}</Text>
                </View>
              )}
            </View>
          )
        }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator pour l'historique
function HistoryStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        },
        headerTitleStyle: {
          color: '#1e293b',
          fontWeight: '600',
          fontSize: 18,
        },
        headerTintColor: '#dc2626',
      }}
    >
      <Stack.Screen 
        name="HistoryMain" 
        component={HistoryScreen}
        options={{ 
          title: 'Historique',
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Icon name="history" size={22} color="#dc2626" />
              <Text style={styles.headerTitleText}>Historique</Text>
            </View>
          )
        }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator pour les paramètres
function SettingsStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        },
        headerTitleStyle: {
          color: '#1e293b',
          fontWeight: '600',
          fontSize: 18,
        },
        headerTintColor: '#dc2626',
      }}
    >
      <Stack.Screen 
        name="SettingsMain" 
        component={SettingsScreen}
        options={{ 
          title: 'Paramètres',
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Icon name="settings" size={22} color="#dc2626" />
              <Text style={styles.headerTitleText}>Paramètres</Text>
            </View>
          )
        }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{ 
          title: 'À propos',
          headerBackTitleVisible: false
        }}
      />
    </Stack.Navigator>
  );
}

// Tab Navigator principal
function MainTabNavigator() {
  const { currentTrack, isPlaying, favorites } = useAudio();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = size || 24;
          
          if (route.name === 'Lecteur') {
            iconName = 'audiotrack';
          } else if (route.name === 'Playlist') {
            iconName = 'queue-music';
          } else if (route.name === 'Direct') {
            iconName = 'radio';
          } else if (route.name === 'Favoris') {
            iconName = 'favorite';
          } else if (route.name === 'Historique') {
            iconName = 'history';
          }
          
          return <Icon name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: '#dc2626',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Lecteur" 
        component={PlayerStackNavigator}
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} badgeCount={isPlaying ? 1 : 0} />
          ),
        }}
      />
      <Tab.Screen name="Playlist" component={PlaylistStackNavigator} />
      <Tab.Screen 
        name="Direct" 
        component={LiveStackNavigator}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View>
              <Icon name="radio" size={size} color={color} />
              {!focused && (
                <View style={styles.liveTabBadge}>
                  <Text style={styles.liveTabBadgeText}>LIVE</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen name="Favoris" component={FavoritesStackNavigator} />
      <Tab.Screen name="Historique" component={HistoryStackNavigator} />
    </Tab.Navigator>
  );
}

// Mini-player flottant
function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, formatTime, currentTime, duration } = useAudio();
  const [isVisible, setIsVisible] = React.useState(false);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (currentTrack) {
      setIsVisible(true);
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    }
  }, [currentTrack]);

  if (!isVisible || !currentTrack) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Animated.View style={[styles.miniPlayer, { transform: [{ translateY }] }]}>
      <TouchableOpacity 
        style={styles.miniPlayerContent}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.miniPlayerGradient}
        >
          <View style={styles.miniPlayerInfo}>
            <View style={styles.miniPlayerIcon}>
              <Icon name="music-note" size={20} color="#dc2626" />
            </View>
            <View style={styles.miniPlayerText}>
              <Text style={styles.miniPlayerTitle} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.miniPlayerSubtitle}>
                {currentTrack.category}
              </Text>
            </View>
          </View>
          
          <View style={styles.miniPlayerControls}>
            <TouchableOpacity 
              style={styles.miniPlayerControlBtn}
              onPress={togglePlayPause}
            >
              <Icon 
                name={isPlaying ? 'pause' : 'play-arrow'} 
                size={24} 
                color="#1e293b" 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.miniPlayerControlBtn}>
              <Icon name="skip-next" size={24} color="#1e293b" />
            </TouchableOpacity>
          </View>
          
          <View style={[styles.miniPlayerProgress, { width: `${progress}%` }]} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Drawer Navigator (optionnel, pour plus d'options)
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 280,
        },
        drawerActiveTintColor: '#dc2626',
        drawerInactiveTintColor: '#475569',
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Drawer.Screen 
        name="Main" 
        component={MainTabNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Favoris" 
        component={FavoritesStackNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="favorite" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Historique" 
        component={HistoryStackNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="history" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Paramètres" 
        component={SettingsStackNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="À propos" 
        component={AboutScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="info" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// Composant principal de navigation
export default function AppNavigator() {
  const [isReady, setIsReady] = React.useState(false);
  const { loadInitialData } = useAudio();

  React.useEffect(() => {
    const initialize = async () => {
      await loadInitialData();
      setIsReady(true);
    };
    initialize();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#dc2626', '#b91c1c']}
          style={styles.loadingLogo}
        >
          <Icon name="radio" size={50} color="#fff" />
        </LinearGradient>
        <Text style={styles.loadingText}>RCOLFM Studio</Text>
        <Text style={styles.loadingSubtext}>Chargement...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <MainTabNavigator />
        <MiniPlayer />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: '25%',
    backgroundColor: '#dc2626',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dc2626',
    marginRight: 8,
  },
  liveTabBadge: {
    position: 'absolute',
    top: -2,
    right: -8,
    backgroundColor: '#dc2626',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  liveTabBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  headerBadge: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  headerBadgeText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 16,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  miniPlayerContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  miniPlayerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  miniPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  miniPlayerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPlayerText: {
    flex: 1,
  },
  miniPlayerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  miniPlayerSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  miniPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniPlayerControlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef2f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPlayerProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: '#dc2626',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
});

// Export des navigateurs individuels pour une utilisation éventuelle
export { MainTabNavigator, PlayerStackNavigator, MiniPlayer };