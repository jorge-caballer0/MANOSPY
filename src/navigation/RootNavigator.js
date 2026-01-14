import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context';
import { COLORS } from '../constants';

// Auth Screens
import { RoleSelectionScreen } from '../screens/auth/RoleSelectionScreen';

// Client Screens
import {
  ClientLoginScreen,
  ClientHomeScreen,
  ClientSearchScreen,
  ClientReservationsScreen,
  ClientChatScreen,
  ClientProfileScreen,
  ClientEditProfileScreen,
  RequestServiceScreen,
  ProfessionalDetailScreen,
  ChatDetailScreen,
} from '../screens/client';

// Admin Screens
import { AdminDashboardScreen } from '../screens/admin';
import {
  ProfessionalOnboardingScreen,
  ProfessionalValidationScreen,
  ProfessionalHomeScreen,
  ProfessionalRequestsScreen,
  ProfessionalAgendaScreen,
  ProfessionalChatScreen,
  ProfessionalProfileScreen,
  ProfessionalEditProfileScreen,
  ProfessionalMyWorkScreen,
} from '../screens/professional';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ClientTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
      })}
    >
      <Tab.Screen
        name="ClientHome"
        component={ClientHomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ClientSearch"
        component={ClientSearchScreen}
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="RequestService"
        component={RequestServiceScreen}
        options={{
          title: 'Solicitar',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ClientReservations"
        component={ClientReservationsScreen}
        options={{
          title: 'Reservas',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ClientChat"
        component={ClientChatScreen}
        options={{
          title: 'Mensajes',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ClientProfile"
        component={ClientProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

const ProfessionalTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.success,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
      })}
    >
      <Tab.Screen
        name="ProfessionalHome"
        component={ProfessionalHomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfessionalRequests"
        component={ProfessionalRequestsScreen}
        options={{
          title: 'Solicitudes',
          tabBarIcon: ({ color, size }) => <Ionicons name="inbox" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfessionalAgenda"
        component={ProfessionalAgendaScreen}
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfessionalChat"
        component={ProfessionalChatScreen}
        options={{
          title: 'Mensajes',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfessionalProfile"
        component={ProfessionalProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const { user, role } = useAuth();
  console.log('RootNavigator user, role:', user, role);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        <>
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          <Stack.Screen name="ClientLogin" component={ClientLoginScreen} />
          <Stack.Screen name="ProfessionalOnboarding" component={ProfessionalOnboardingScreen} />
        </>
      ) : role === 'admin' ? (
        <>
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        </>
      ) : role === 'client' ? (
        <>
          <Stack.Screen name="ClientTabs" component={ClientTabNavigator} />
          <Stack.Screen name="ClientEditProfile" component={ClientEditProfileScreen} />
          <Stack.Screen name="ProfessionalDetail" component={ProfessionalDetailScreen} />
          <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
        </>
      ) : user?.verified === false ? (
        // Profesional no validado - mostrar pantalla de validación
        <>
          <Stack.Screen name="ProfessionalValidation" component={ProfessionalValidationScreen} />
        </>
      ) : (
        // Profesional validado - mostrar tabs normales
        <>
          <Stack.Screen name="ProfessionalTabs" component={ProfessionalTabNavigator} />
          <Stack.Screen name="ProfessionalEditProfile" component={ProfessionalEditProfileScreen} />
          <Stack.Screen name="ProfessionalMyWork" component={ProfessionalMyWorkScreen} />
          <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
