import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS } from '../constants';
import { Card, Badge, Button } from '../components/CommonComponents';

const MessageCard = ({ message, onBlock, onDelete }) => (
  <Card style={styles.messageCard}>
    <View style={styles.messageHeader}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {message.userName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </Text>
        </View>
        <View style={styles.nameAndTime}>
          <Text style={styles.userName}>{message.userName}</Text>
          <Text style={styles.timestamp}>
            {new Date(message.timestamp).toLocaleString('es-PY')}
          </Text>
        </View>
      </View>
      {message.flagged && <Badge variant="danger">Reportado</Badge>}
    </View>

    <View style={styles.messageContent}>
      <Text style={styles.messageText}>{message.content}</Text>
    </View>

    {message.flagReason && (
      <View style={styles.flagReason}>
        <Ionicons name="warning" size={16} color={COLORS.danger} />
        <Text style={styles.flagReasonText}>{message.flagReason}</Text>
      </View>
    )}

    <View style={styles.actionsSection}>
      {message.flagged && (
        <>
          <Button
            title="✓ Aprobar"
            onPress={() => onDelete(message, 'approved')}
            style={[styles.actionBtn, { backgroundColor: COLORS.success }]}
          />
          <Button
            title="✗ Bloquear Usuario"
            onPress={() => onBlock(message)}
            variant="danger"
            style={styles.actionBtn}
          />
        </>
      )}
      <Button
        title="🗑 Eliminar Mensaje"
        onPress={() => onDelete(message, 'deleted')}
        variant="danger"
        style={styles.actionBtn}
      />
    </View>
  </Card>
);

export default function AdminChatModeration() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('flagged'); // 'all' | 'flagged'
  const [stats, setStats] = useState({
    total: 0,
    flagged: 0,
    approved: 0,
    deleted: 0,
  });

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [messages, searchQuery, filterMode]);

  const loadMessages = async () => {
    try {
      const data = await AsyncStorage.getItem('manospy_chat_messages_v1');
      const msgs = data ? JSON.parse(data) : [];
      setMessages(msgs);

      // Calcular estadísticas
      setStats({
        total: msgs.length,
        flagged: msgs.filter((m) => m.flagged).length,
        approved: msgs.filter((m) => m.status === 'approved').length,
        deleted: msgs.filter((m) => m.status === 'deleted').length,
      });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const applyFilters = () => {
    let filtered = messages;

    if (filterMode === 'flagged') {
      filtered = filtered.filter((m) => m.flagged);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.userName.toLowerCase().includes(query) ||
          m.content.toLowerCase().includes(query)
      );
    }

    setFilteredMessages(filtered);
  };

  const handleBlockUser = async (message) => {
    Alert.alert(
      'Bloquear Usuario',
      `¿Deseas bloquear a ${message.userName} por conducta inapropiada?`,
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Bloquear',
          onPress: async () => {
            try {
              // Bloquear usuario en la base de datos de usuarios
              const usersData = await AsyncStorage.getItem('manospy_users_db_v1');
              const users = JSON.parse(usersData);

              const updatedUsers = users.map((u) =>
                u.name === message.userName ? { ...u, blocked: true } : u
              );

              await AsyncStorage.setItem(
                'manospy_users_db_v1',
                JSON.stringify(updatedUsers)
              );

              // Actualizar mensaje
              const updatedMessages = messages.map((m) =>
                m.id === message.id
                  ? { ...m, status: 'user_blocked', flagged: false }
                  : m
              );

              await AsyncStorage.setItem(
                'manospy_chat_messages_v1',
                JSON.stringify(updatedMessages)
              );

              setMessages(updatedMessages);
              Alert.alert(
                'Éxito',
                `${message.userName} ha sido bloqueado de la plataforma`
              );
            } catch (error) {
              Alert.alert('Error', 'Error al bloquear usuario');
              console.error('Error:', error);
            }
          },
        },
      ]
    );
  };

  const handleMessageAction = async (message, action) => {
    try {
      const updatedMessages = messages.map((m) =>
        m.id === message.id ? { ...m, status: action, flagged: false } : m
      );

      await AsyncStorage.setItem(
        'manospy_chat_messages_v1',
        JSON.stringify(updatedMessages)
      );

      setMessages(updatedMessages);

      const actionText =
        action === 'approved' ? 'aprobado' : 'eliminado';
      Alert.alert('Éxito', `Mensaje ${actionText}`);
    } catch (error) {
      Alert.alert('Error', 'Error al procesar el mensaje');
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
          <Text style={styles.title}>Moderación de Chat</Text>
          <Text style={styles.subtitle}>Gestiona mensajes inapropiados</Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#FF9500' }]}>
            <Text style={[styles.statValue, { color: '#FF9500' }]}>
              {stats.flagged}
            </Text>
            <Text style={styles.statLabel}>Reportados</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {stats.approved}
            </Text>
            <Text style={styles.statLabel}>Aprobados</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: COLORS.danger }]}>
            <Text style={[styles.statValue, { color: COLORS.danger }]}>
              {stats.deleted}
            </Text>
            <Text style={styles.statLabel}>Eliminados</Text>
          </View>
        </View>

        {/* Búsqueda y Filtros */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por usuario o contenido..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterBtn,
                filterMode === 'flagged' && styles.filterBtnActive,
              ]}
              onPress={() => setFilterMode('flagged')}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  filterMode === 'flagged' && styles.filterBtnTextActive,
                ]}
              >
                Reportados ({stats.flagged})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterBtn,
                filterMode === 'all' && styles.filterBtnActive,
              ]}
              onPress={() => setFilterMode('all')}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  filterMode === 'all' && styles.filterBtnTextActive,
                ]}
              >
                Todos ({stats.total})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de Mensajes */}
        {filteredMessages.length === 0 ? (
          <View style={styles.emptySection}>
            <Ionicons name="checkmark-done-circle" size={64} color={COLORS.success} />
            <Text style={styles.emptyText}>
              {filterMode === 'flagged'
                ? 'No hay mensajes reportados'
                : 'No hay mensajes'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredMessages}
            renderItem={({ item }) => (
              <MessageCard
                message={item}
                onBlock={() => handleBlockUser(item)}
                onDelete={(msg, action) => handleMessageAction(msg, action)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        )}

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
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  searchSection: {
    marginBottom: SPACING.lg,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.text,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterBtnText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  filterBtnTextActive: {
    color: '#fff',
  },
  messageCard: {
    marginBottom: SPACING.lg,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  nameAndTime: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  messageContent: {
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
  },
  messageText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  flagReason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#FFEBEE',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  flagReasonText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '500',
  },
  actionsSection: {
    gap: SPACING.sm,
  },
  actionBtn: {
    marginBottom: SPACING.sm,
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
});
