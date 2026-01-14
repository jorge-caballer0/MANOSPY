import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS } from '../constants';
import { Card, Button } from '../components/CommonComponents';
import { getStats, createDemoData, startDataSync } from '../utils/dataService';
import { validateAndFixUsers, cleanupDuplicateUsers } from '../utils/syncBridge';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ icon, label, value, color, variant }) => (
  <View style={[styles.statCard, { backgroundColor: color + '15', borderLeftColor: color }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
      <Ionicons name={icon} size={32} color={color} />
    </View>
  </View>
);

export default function AdminDashboard() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [stats, setStats] = useState({
    totalUsers: 0,
    clients: 0,
    professionals: 0,
    verified: 0,
    pending: 0,
    blocked: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Crear datos de demostración SOLO si no hay nada
    createDemoData();
    
    // Cargar estadísticas iniciales
    loadStats();
    
    // Iniciar sincronización periódica
    startDataSync();
    
    // Actualizar stats cada 3 segundos (detecta nuevos registros rápidamente)
    const interval = setInterval(loadStats, 3000);
    return () => clearInterval(interval);
  }, [navigation]);

  const loadStats = async () => {
    try {
      // Validar integridad de datos
      await validateAndFixUsers();
      
      // Limpiar duplicados
      await cleanupDuplicateUsers();
      
      // Obtener estadísticas (lee de AsyncStorage)
      const calculatedStats = await getStats();
      
      console.log('📊 Stats actualizados:', calculatedStats);
      setStats(calculatedStats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    console.log('Acción ejecutada:', action);
    switch (action) {
      case 'newuser':
        navigation.navigate('Usuarios');
        break;
      case 'validations':
        navigation.navigate('Validacion');
        break;
      case 'reports':
        navigation.navigate('Reportes');
        break;
      case 'settings':
        navigation.navigate('Configuracion');
        break;
      default:
        console.log('Acción desconocida:', action);
        break;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Bienvenido al panel de administración</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="people"
            label="Total Usuarios"
            value={stats.totalUsers.toString()}
            color={COLORS.primary}
          />
          <StatCard
            icon="person"
            label="Clientes"
            value={stats.clients.toString()}
            color="#FF9500"
          />
          <StatCard
            icon="briefcase"
            label="Profesionales"
            value={stats.professionals.toString()}
            color="#5856D6"
          />
          <StatCard
            icon="checkmark-circle"
            label="Verificados"
            value={stats.verified.toString()}
            color={COLORS.success}
          />
          <StatCard
            icon="hourglass"
            label="Pendientes"
            value={stats.pending.toString()}
            color="#FF3B30"
          />
          <StatCard
            icon="lock-closed"
            label="Bloqueados"
            value={stats.blocked.toString()}
            color="#8E8E93"
          />
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Sistema en Línea</Text>
          </View>
          <Text style={styles.infoText}>
            • Versión: 1.0.0{'\n'}
            • Estado: Operativo{'\n'}
            • Últimas actualizaciones: Ahora mismo
          </Text>
        </Card>

        <Card style={styles.quickActionsCard}>
          <Text style={styles.quickActionsTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('newuser')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#007AFF15' }]}>
                <Ionicons name="person-add" size={24} color="#007AFF" />
              </View>
              <Text style={styles.actionLabel}>Nuevo Usuario</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('validations')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#34C75915' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#34C759" />
              </View>
              <Text style={styles.actionLabel}>Validaciones</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('reports')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FF3B3015' }]}>
                <Ionicons name="alert-circle" size={24} color="#FF3B30" />
              </View>
              <Text style={styles.actionLabel}>Reportes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('settings')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#5856D615' }]}>
                <Ionicons name="settings" size={24} color="#5856D6" />
              </View>
              <Text style={styles.actionLabel}>Configuración</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={{ height: SPACING.xl }} />
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
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  statsGrid: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  infoCard: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  quickActionsCard: {
    backgroundColor: COLORS.surface,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});

