import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import AdminUsersManagement from './src/screens/AdminUsersManagement';
import AdminProfessionalValidation from './src/screens/AdminProfessionalValidation';
import AdminChatModeration from './src/screens/AdminChatModeration';
import AdminPasswordRecovery from './src/screens/AdminPasswordRecovery';
import AdminReports from './src/screens/AdminReports';
import AdminSettings from './src/screens/AdminSettings';

import { COLORS } from './src/constants';
import { ThemeProvider } from './src/context/ThemeContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AdminTabNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Group
        screenOptions={{
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="AdminTabs" component={AdminBottomTabs} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          animationEnabled: true,
          presentation: 'card',
          cardOverlayEnabled: true,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="Reportes"
          component={AdminReports}
          options={{
            headerShown: true,
            headerTitle: 'Reportes',
            headerStyle: {
              backgroundColor: COLORS.surface,
            },
            headerTintColor: COLORS.primary,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Configuracion"
          component={AdminSettings}
          options={{
            headerShown: true,
            headerTitle: 'Configuración',
            headerStyle: {
              backgroundColor: COLORS.surface,
            },
            headerTintColor: COLORS.primary,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function AdminBottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.surface,
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Usuarios') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Validacion') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Passwords') {
            iconName = focused ? 'key' : 'key-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Usuarios"
        component={AdminUsersManagement}
        options={{ title: 'Usuarios' }}
      />
      <Tab.Screen
        name="Validacion"
        component={AdminProfessionalValidation}
        options={{ title: 'Validación' }}
      />
      <Tab.Screen
        name="Chats"
        component={AdminChatModeration}
        options={{ title: 'Chats' }}
      />
      <Tab.Screen
        name="Passwords"
        component={AdminPasswordRecovery}
        options={{ title: 'Contraseñas' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminLogin();
  }, []);

  const checkAdminLogin = async () => {
    try {
      const adminUser = await AsyncStorage.getItem('manospy_admin_user');
      if (adminUser) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking admin login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (email, password) => {
    // Simple validation - in production use proper authentication
    if (email === 'admin@manospy.com' && password === 'admin123') {
      try {
        const adminUser = { email, role: 'admin', loginTime: new Date().toISOString() };
        await AsyncStorage.setItem('manospy_admin_user', JSON.stringify(adminUser));
        setIsLoggedIn(true);
        return true;
      } catch (error) {
        console.error('Error saving admin login:', error);
        return false;
      }
    }
    return false;
  };

  const handleAdminLogout = async () => {
    try {
      await AsyncStorage.removeItem('manospy_admin_user');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background || '#f5f5f5'} />
        {loading ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Loading" component={() => <Text>Cargando...</Text>} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            {!isLoggedIn ? (
              <Stack.Screen
                name="AdminLogin"
                component={(props) => <AdminLoginScreen {...props} onLogin={handleAdminLogin} />}
                options={{ animationEnabled: false }}
              />
            ) : (
              <Stack.Screen
                name="AdminTabs"
                component={AdminTabNavigator}
                options={{ animationEnabled: false }}
              />
            )}
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </ThemeProvider>
  );
}
