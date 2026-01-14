import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, Avatar, Badge } from '../../components';
import { COLORS, SPACING, RADIUS } from '../../constants';
import { useAuth } from '../../context';
import { useFocusEffect } from '@react-navigation/native';

// ============ ADMIN DASHBOARD SCREEN ============
export const AdminDashboardScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [pendingProfessionals, setPendingProfessionals] = useState([]);
  const [approvedProfessionals, setApprovedProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar profesionales de la BD cada vez que la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      loadProfessionals();
    }, [])
  );

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      const usersDB = await AsyncStorage.getItem('manospy_users_db_v1');
      if (usersDB) {
        const users = JSON.parse(usersDB);
        const professionals = users.filter(u => u.role === 'professional');
        
        setPendingProfessionals(professionals.filter(p => !p.verified));
        setApprovedProfessionals(professionals.filter(p => p.verified));
      }
    } catch (error) {
      console.error('Error loading professionals:', error);
      Alert.alert('Error', 'No se pudieron cargar los profesionales');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (professional) => {
    try {
      // Obtener la BD de usuarios
      const usersDB = await AsyncStorage.getItem('manospy_users_db_v1');
      let users = usersDB ? JSON.parse(usersDB) : [];
      
      // Actualizar el profesional
      users = users.map(u => 
        u.id === professional.id ? { ...u, verified: true } : u
      );
      
      // Guardar cambios
      await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(users));
      
      // Actualizar estado local
      setPendingProfessionals(pendingProfessionals.filter(p => p.id !== professional.id));
      setApprovedProfessionals([...approvedProfessionals, { ...professional, verified: true }]);
      
      Alert.alert('✓ Éxito', `${professional.name} ha sido validado. Ya puede iniciar sesión.`);
    } catch (error) {
      console.error('Error validating professional:', error);
      Alert.alert('Error', 'No se pudo validar el profesional');
    }
  };

  const handleReject = async (professional) => {
    Alert.alert(
      'Rechazar solicitud',
      `¿Deseas rechazar la solicitud de ${professional.name}?`,
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Rechazar',
          onPress: async () => {
            try {
              // Obtener la BD de usuarios
              const usersDB = await AsyncStorage.getItem('manospy_users_db_v1');
              let users = usersDB ? JSON.parse(usersDB) : [];
              
              // Eliminar el profesional
              users = users.filter(u => u.id !== professional.id);
              
              // Guardar cambios
              await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(users));
              
              // Actualizar estado local
              setPendingProfessionals(pendingProfessionals.filter(p => p.id !== professional.id));
              
              Alert.alert('✓ Rechazado', `La solicitud de ${professional.name} ha sido rechazada.`);
            } catch (error) {
              console.error('Error rejecting professional:', error);
              Alert.alert('Error', 'No se pudo rechazar la solicitud');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: SPACING.md, color: COLORS.textMuted }}>Cargando datos...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Panel de Administrador 🔧</Text>
            <Text style={styles.subtitle2}>ManosPy - Validación de Profesionales</Text>
          </View>

          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{pendingProfessionals.length}</Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{approvedProfessionals.length}</Text>
              <Text style={styles.statLabel}>Validados</Text>
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⏳ Solicitudes Pendientes ({pendingProfessionals.length})</Text>
            {pendingProfessionals.length === 0 ? (
              <Card>
                <Text style={{ color: COLORS.textMuted, textAlign: 'center' }}>
                  No hay solicitudes pendientes de validación.
                </Text>
              </Card>
            ) : (
              pendingProfessionals.map(prof => (
                <Card key={prof.id} style={{ marginBottom: SPACING.md }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: SPACING.md }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Avatar initials={(prof.name.charAt(0) || 'P').toUpperCase()} size="md" />
                      <View style={{ marginLeft: SPACING.md, flex: 1 }}>
                        <Text style={{ fontWeight: '600', color: COLORS.text }}>{prof.name}</Text>
                        <Text style={{ fontSize: 12, color: COLORS.textMuted }}>{prof.specialty}</Text>
                      </View>
                    </View>
                    <Badge text="⏳ Pendiente" variant="warning" />
                  </View>
                  
                  <View style={{ backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.md }}>
                    <Text style={{ fontSize: 12, color: COLORS.text, marginBottom: SPACING.sm }}>
                      📧 Email: <Text style={{ fontWeight: '600' }}>{prof.email}</Text>
                    </Text>
                    <Text style={{ fontSize: 12, color: COLORS.text, marginBottom: SPACING.sm }}>
                      📱 Teléfono: <Text style={{ fontWeight: '600' }}>{prof.phone}</Text>
                    </Text>
                    <Text style={{ fontSize: 12, color: COLORS.text }}>
                      📅 Registrado: <Text style={{ fontWeight: '600' }}>{prof.createdAt || 'N/A'}</Text>
                    </Text>
                  </View>

                  <View style={{ gap: SPACING.sm, flexDirection: 'row' }}>
                    <Button
                      title="✓ Validar"
                      onPress={() => handleValidate(prof)}
                    />
                    <Button
                      title="✗ Rechazar"
                      variant="danger"
                      onPress={() => handleReject(prof)}
                    />
                  </View>
                </Card>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✓ Profesionales Validados ({approvedProfessionals.length})</Text>
            {approvedProfessionals.length === 0 ? (
              <Card>
                <Text style={{ color: COLORS.textMuted, textAlign: 'center' }}>
                  No hay profesionales validados aún.
                </Text>
              </Card>
            ) : (
              approvedProfessionals.map(prof => (
                <Card key={prof.id} style={{ marginBottom: SPACING.md }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <Avatar initials={(prof.name.charAt(0) || 'P').toUpperCase()} size="md" bgColor={COLORS.success} />
                      <View style={{ marginLeft: SPACING.md, flex: 1 }}>
                        <Text style={{ fontWeight: '600', color: COLORS.text }}>{prof.name}</Text>
                        <Text style={{ fontSize: 12, color: COLORS.textMuted }}>{prof.specialty}</Text>
                      </View>
                    </View>
                    <Badge text="✓ Validado" variant="success" />
                  </View>
                </Card>
              ))
            )}
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="🚪 Cerrar sesión"
              variant="danger"
              onPress={() => {
                Alert.alert('Cerrar sesión', '¿Deseas cerrar sesión?', [
                  { text: 'Cancelar', onPress: () => {} },
                  { text: 'Sí, cerrar', onPress: () => logout() },
                ]);
              }}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// ============ STYLES ============
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerContent: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  greeting: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  subtitle2: { fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  statCard: { width: '48.5%' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  actionButtons: { gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg },
});
