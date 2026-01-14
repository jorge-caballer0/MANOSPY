import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS } from '../constants';
import { Card } from '../components/CommonComponents';
import { useTheme } from '../context/ThemeContext';

const SettingItem = ({ icon, title, subtitle, onPress, showSwitch = false, switchValue = false, onSwitchChange }) => {
  if (showSwitch) {
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#767577', true: COLORS.primary }}
          thumbColor={switchValue ? COLORS.primary : '#f4f3f4'}
        />
      </View>
    );
  }
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingItem}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

export default function AdminSettings() {
  const navigation = useNavigation();
  const { isDarkMode, toggleDarkMode, colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoValidation, setAutoValidation] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem('setting_notifications');
      const autoVal = await AsyncStorage.getItem('setting_autoValidation');
      
      if (notifications !== null) setNotificationsEnabled(notifications === 'true');
      if (autoVal !== null) setAutoValidation(autoVal === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateNotifications = async (value) => {
    try {
      setNotificationsEnabled(value);
      await AsyncStorage.setItem('setting_notifications', value.toString());
      console.log('✅ Notificaciones', value ? 'activadas' : 'desactivadas');
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar notificaciones');
    }
  };

  const updateDarkMode = async (value) => {
    try {
      await toggleDarkMode(value);
      console.log('✅ Modo oscuro', value ? 'activado' : 'desactivado');
      Alert.alert(
        '🌙 Modo Oscuro',
        `Modo oscuro ${value ? 'activado ✓' : 'desactivado ✗'}`
      );
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar modo oscuro');
    }
  };

  const updateAutoValidation = async (value) => {
    try {
      setAutoValidation(value);
      await AsyncStorage.setItem('setting_autoValidation', value.toString());
      console.log('✅ Validación automática', value ? 'activada' : 'desactivada');
      Alert.alert('Validación Automática', `Validación automática ${value ? 'activada ✓' : 'desactivada ✗'}`);
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar validación automática');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('manospy_admin_user');
              navigation.reset({
                index: 0,
                routes: [{ name: 'AdminLogin' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Error al cerrar sesión');
            }
          },
        },
      ]
    );
  };

  const handleAboutApp = () => {
    console.log('📱 Abriendo Acerca De...');
    Alert.alert(
      'ℹ️ Acerca de ManosPy Admin',
      'ManosPy Admin v1.0.0\n\nAplicación de administración para servicios profesionales.\n\n© 2026 ManosPy. Todos los derechos reservados.'
    );
  };

  const handleClearCache = () => {
    console.log('🗑️ Abriendo Limpiar Caché...');
    Alert.alert(
      '🗑️ Limpiar Caché',
      '¿Deseas limpiar el caché temporal?\n\n(No se eliminarán datos de usuarios)',
      [
        { 
          text: 'Cancelar', 
          onPress: () => console.log('Cancelado') 
        },
        {
          text: 'Limpiar Caché',
          onPress: async () => {
            try {
              console.log('Limpiando caché...');
              await AsyncStorage.removeItem('temp_cache');
              Alert.alert(
                '✅ Éxito',
                'Caché limpiado correctamente\n\nEspacio liberado: ~2MB'
              );
              console.log('✅ Caché limpiado');
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('❌ Error', 'Error al limpiar caché');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="settings" size={32} color={COLORS.primary} />
          <Text style={styles.title}>Configuración</Text>
          <Text style={styles.subtitle}>Personaliza tu experiencia</Text>
        </View>

        {/* Notificaciones */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          <SettingItem
            icon="notifications"
            title="Activar Notificaciones"
            subtitle={notificationsEnabled ? '✓ Notificaciones activas' : '✗ Notificaciones desactivadas'}
            showSwitch={true}
            switchValue={notificationsEnabled}
            onSwitchChange={updateNotifications}
          />
        </Card>

        {/* Apariencia */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Apariencia</Text>
          <SettingItem
            icon="moon"
            title="Modo Oscuro"
            subtitle={isDarkMode ? '✓ Activado' : '✗ Desactivado'}
            showSwitch={true}
            switchValue={isDarkMode}
            onSwitchChange={updateDarkMode}
          />
        </Card>

        {/* Validación Automática */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Validación</Text>
          <SettingItem
            icon="shield-checkmark"
            title="Validación Automática"
            subtitle={autoValidation ? '✓ Validación automática activa' : '✗ Validación manual'}
            showSwitch={true}
            switchValue={autoValidation}
            onSwitchChange={updateAutoValidation}
          />
        </Card>

        {/* General */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <SettingItem
            icon="information-circle"
            title="Acerca de"
            subtitle="Información de la aplicación"
            onPress={handleAboutApp}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="trash"
            title="Limpiar Caché"
            subtitle="Libera espacio de almacenamiento"
            onPress={handleClearCache}
          />
        </Card>

        {/* Sesión */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Sesión</Text>
          <TouchableOpacity onPress={handleLogout}>
            <View style={styles.logoutItem}>
              <View style={styles.logoutIcon}>
                <Ionicons name="log-out" size={24} color="#FF3B30" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: '#FF3B30' }]}>
                  Cerrar Sesión
                </Text>
                <Text style={styles.settingSubtitle}>
                  Salir de la cuenta administrador
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#FF3B30" />
            </View>
          </TouchableOpacity>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>ManosPy Admin v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.lg,
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FF3B30' + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
