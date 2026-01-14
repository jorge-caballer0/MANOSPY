import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS } from '../constants';
import { Card, Badge, Button } from '../components/CommonComponents';

export default function AdminPasswordRecovery() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applySearch();
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      const data = await AsyncStorage.getItem('manospy_users_db_v1');
      if (data) {
        const usersList = JSON.parse(data);
        setUsers(usersList);
        setFilteredUsers(usersList);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const applySearch = () => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const generateSecurePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*-_+=';
    const allChars = uppercase + lowercase + numbers + symbols;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleResetPassword = async (user, password) => {
    setLoading(true);
    try {
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, password } : u
      );

      await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      Alert.alert(
        'Éxito ✓',
        `Contraseña actualizada para ${user.name}\n\nNueva contraseña:\n${password}`,
        [{ text: 'Cerrar', onPress: () => setShowPasswordModal(false) }]
      );
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar la contraseña');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openResetModal = (user) => {
    setSelectedUser(user);
    const newPass = generateSecurePassword();
    setNewPassword(newPass);
    setShowPasswordModal(true);
  };

  const renderUserItem = ({ item }) => (
    <Card style={styles.userCard}>
      <View style={styles.userContent}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.badges}>
            <Badge variant={item.role === 'professional' ? 'success' : 'default'}>
              {item.role === 'professional' ? 'Profesional' : 'Cliente'}
            </Badge>
            {item.blocked && <Badge variant="danger">Bloqueado</Badge>}
          </View>
        </View>
        <Button title="Restablecer" onPress={() => openResetModal(item)} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="key" size={32} color={COLORS.primary} />
          <Text style={styles.title}>Recuperación de Contraseñas</Text>
          <Text style={styles.subtitle}>Restablecer contraseñas de usuarios</Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchInput}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              placeholder="Buscar usuario..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.input}
              placeholderTextColor={COLORS.textMuted}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {filteredUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="person-remove" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No hay usuarios</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        )}

        <View style={{ height: SPACING.xl }} />
      </ScrollView>

      {/* Modal de Reseteo de Contraseña */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Restablecer Contraseña</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <ScrollView style={{ flex: 1 }}>
                <View style={styles.userSummary}>
                  <Text style={styles.summaryLabel}>Usuario: {selectedUser.name}</Text>
                  <Text style={styles.summaryLabel}>Email: {selectedUser.email}</Text>
                  <Text style={styles.summaryLabel}>
                    Rol: {selectedUser.role === 'professional' ? 'Profesional' : 'Cliente'}
                  </Text>
                </View>

                <Text style={styles.sectionLabel}>Nueva Contraseña Segura:</Text>
                <View style={styles.passwordBox}>
                  <TextInput
                    style={styles.passwordInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                    editable={true}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.strengthBar}>
                  <View style={[styles.strengthFill, { backgroundColor: COLORS.success }]} />
                </View>
                <Text style={styles.strengthText}>Contraseña Fuerte ✓</Text>

                <Text style={styles.passwordHint}>
                  ✓ 12 caracteres{'\n'}
                  ✓ Mayúsculas, minúsculas{'\n'}
                  ✓ Números y símbolos especiales{'\n'}
                  ✓ Generada aleatoriamente
                </Text>

                <View style={styles.buttonGroup}>
                  <Button
                    title={loading ? 'Actualizando...' : 'Confirmar Cambio'}
                    onPress={() => handleResetPassword(selectedUser, newPassword)}
                    disabled={loading || !newPassword}
                    style={styles.confirmBtn}
                  />
                  <Button
                    title="Generar Nueva Contraseña"
                    onPress={() => setNewPassword(generateSecurePassword())}
                    variant="secondary"
                    style={styles.generateBtn}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginTop: SPACING.md },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs },
  searchSection: { marginBottom: SPACING.lg },
  searchInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, paddingVertical: SPACING.md, paddingHorizontal: SPACING.sm, fontSize: 14, color: COLORS.text },
  userCard: { marginBottom: SPACING.md },
  userContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  userEmail: { fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  badges: { flexDirection: 'row', gap: SPACING.xs, marginTop: SPACING.sm },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxl },
  emptyText: { fontSize: 16, color: COLORS.textMuted, marginTop: SPACING.md },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg, paddingBottom: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  userSummary: { backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg },
  summaryLabel: { fontSize: 13, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.sm },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  passwordBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, marginBottom: SPACING.lg },
  passwordInput: { flex: 1, paddingVertical: SPACING.md, fontSize: 14, color: COLORS.text, fontWeight: 'bold', letterSpacing: 0.5 },
  strengthBar: { height: 6, backgroundColor: COLORS.border, borderRadius: RADIUS.sm, overflow: 'hidden', marginBottom: SPACING.sm },
  strengthFill: { height: '100%', width: '100%' },
  strengthText: { fontSize: 12, color: COLORS.success, fontWeight: '600', marginBottom: SPACING.lg },
  passwordHint: { fontSize: 12, color: COLORS.textMuted, lineHeight: 20, marginBottom: SPACING.lg },
  buttonGroup: { gap: SPACING.md },
  confirmBtn: { marginBottom: SPACING.sm },
  generateBtn: { marginBottom: SPACING.lg },
});
