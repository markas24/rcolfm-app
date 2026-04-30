import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PlayerScreen from './src/screens/PlayerScreen';
import PlaylistScreen from './src/screens/PlaylistScreen';
import LiveScreen from './src/screens/LiveScreen';
import { AudioProvider } from './src/context/AudioContext';
import { theme } from './src/styles/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AudioProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Lecteur') {
                  iconName = 'audiotrack';
                } else if (route.name === 'Playlist') {
                  iconName = 'queue-music';
                } else if (route.name === 'Live') {
                  iconName = 'radio';
                }
                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.textMuted,
              tabBarStyle: {
                backgroundColor: theme.colors.white,
                borderTopColor: theme.colors.border,
                height: 60,
                paddingBottom: 8,
              },
              headerStyle: {
                backgroundColor: theme.colors.white,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              },
              headerTitleStyle: {
                color: theme.colors.textPrimary,
                fontWeight: 'bold',
              },
            })}
          >
            <Tab.Screen name="Lecteur" component={PlayerScreen} />
            <Tab.Screen name="Playlist" component={PlaylistScreen} />
            <Tab.Screen name="Live" component={LiveScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </AudioProvider>
    </SafeAreaProvider>
  );
}