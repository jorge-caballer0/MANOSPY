import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '../constants';
import { Card } from '../components/CommonComponents';
import { useTheme } from '../context/ThemeContext';

const ReportCard = ({ icon, title, value, subtitle, color }) => (
  <Card style={[styles.reportCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
    <View style={styles.reportCardContent}>
      <View style={[styles.cardIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
        {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  </Card>
);

const StatBar = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <View style={styles.statBar}>
      <View style={styles.statLabel}>
        <Text style={styles.statLabelText}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
    </View>
  );
};

export default function AdminReports() {
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
    loadReportData();
    // Recargar cada 5 segundos para datos en tiempo real
    const interval = setInterval(loadReportData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadReportData = async () => {
    try {
      const usersData = await AsyncStorage.getItem('manospy_users_db_v1');
      if (!usersData) {
        setLoading(false);
        return;
      }

      const users = JSON.parse(usersData);
      const professionalUsers = users.filter(u => u.role === 'professional');

      const reportStats = {
        totalUsers: users.length,
        clients: users.filter(u => u.role === 'client').length,
        professionals: professionalUsers.length,
        verified: professionalUsers.filter(u => u.verified).length,
        pending: professionalUsers.filter(u => !u.verified).length,
        blocked: users.filter(u => u.blocked).length,
      };

      setStats(reportStats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading report data:', error);
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const usersData = await AsyncStorage.getItem('manospy_users_db_v1');
      const users = JSON.parse(usersData || '[]');

      const report = {
        generatedAt: new Date().toLocaleString('es-ES'),
        summary: {
          totalUsers: stats.totalUsers,
          clients: stats.clients,
          professionals: stats.professionals,
          verified: stats.verified,
          pending: stats.pending,
          blocked: stats.blocked,
        },
        professionals: users
          .filter(u => u.role === 'professional')
          .map(p => ({
            nombre: p.name,
            email: p.email,
            especialidad: p.specialty || 'N/A',
            estado: p.verified ? 'Validado' : 'Pendiente',
            registrado: new Date(p.createdAt).toLocaleDateString('es-ES'),
          })),
      };

      const reportText = `
REPORTE DE MANOSPY ADMIN
${new Date().toLocaleString('es-ES')}
${'='.repeat(60)}

RESUMEN
${'-'.repeat(60)}
Total de Usuarios: ${stats.totalUsers}
Clientes: ${stats.clients}
Profesionales: ${stats.professionals}
  - Validados: ${stats.verified}
  - Pendientes: ${stats.pending}
Bloqueados: ${stats.blocked}

PROFESIONALES REGISTRADOS
${'-'.repeat(60)}
${report.professionals
  .map(
    (p, i) =>
      `${i + 1}. ${p.nombre}
   Email: ${p.email}
   Especialidad: ${p.especialidad}
   Estado: ${p.estado}
   Registrado: ${p.registrado}`
  )
  .join('\n\n')}

Generado: ${report.generatedAt}
`;

      // Compartir el reporte
      await Share.share({
        message: reportText,
        title: 'Reporte ManosPy Admin',
        url: reportText,
      });

      Alert.alert('✅ Éxito', 'Reporte exportado correctamente');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('❌ Error', 'Error al exportar reporte');
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await loadReportData();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Ionicons name="bar-chart" size={32} color={COLORS.primary} />
              <Text style={styles.title}>Reportes</Text>
              <Text style={styles.subtitle}>Panel de Estadísticas</Text>
            </View>
            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={handleRefresh}
              disabled={loading}
            >
              <Ionicons
                name="refresh"
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Estadísticas Principales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas Principales</Text>
          <ReportCard
            icon="people"
            title="Total de Usuarios"
            value={stats.totalUsers.toString()}
            color={COLORS.primary}
          />
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <ReportCard
                icon="person"
                title="Clientes"
                value={stats.clients.toString()}
                color="#4CAF50"
              />
            </View>
            <View style={styles.gridItem}>
              <ReportCard
                icon="briefcase"
                title="Profesionales"
                value={stats.professionals.toString()}
                color="#2196F3"
              />
            </View>
          </View>
        </View>

        {/* Estado de Validación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado de Validación</Text>
          <Card>
            <StatBar
              label="Validados"
              value={stats.verified}
              total={stats.professionals}
              color="#4CAF50"
            />
            <View style={styles.divider} />
            <StatBar
              label="Pendientes"
              value={stats.pending}
              total={stats.professionals}
              color="#FF9800"
            />
            <View style={styles.divider} />
            <StatBar
              label="Bloqueados"
              value={stats.blocked}
              total={stats.totalUsers}
              color="#F44336"
            />
          </Card>
        </View>

        {/* Distribución de Usuarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribución de Usuarios</Text>
          <Card>
            <StatBar
              label="Clientes"
              value={stats.clients}
              total={stats.totalUsers}
              color="#4CAF50"
            />
            <View style={styles.divider} />
            <StatBar
              label="Profesionales"
              value={stats.professionals}
              total={stats.totalUsers}
              color="#2196F3"
            />
          </Card>
        </View>

        {/* Información Adicional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <Card>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Tasa de Validación: {stats.professionals > 0 ? Math.round((stats.verified / stats.professionals) * 100) : 0}%
              </Text>
            </View>
          </Card>
        </View>

        {/* Botón Exportar */}
        <TouchableOpacity
          style={styles.exportBtn}
          onPress={handleExportReport}
          disabled={loading}
        >
          <Ionicons name="download" size={20} color="#fff" />
          <Text style={styles.exportBtnText}>Exportar Reporte</Text>
        </TouchableOpacity>

        <View style={styles.footer} />
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
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  reportCard: {
    marginBottom: SPACING.md,
  },
  reportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  gridItem: {
    flex: 1,
  },
  statBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statLabel: {
    width: 80,
  },
  statLabelText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: SPACING.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    width: 45,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.md,
    fontWeight: '500',
  },
  exportBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  exportBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    height: SPACING.xl,
  },
});
