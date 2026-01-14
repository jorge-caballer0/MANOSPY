/**
 * PUENTE DE SINCRONIZACIÓN
 * 
 * Este archivo actúa como puente entre:
 * 1. MANOSPY_ADMIN (panel web antigua) - usa localStorage
 * 2. MANOSPY2 (app principal) - debe usar AsyncStorage
 * 3. admin-app (app mobile) - usa AsyncStorage
 * 
 * CLAVE COMPARTIDA: manospy_users_db_v1
 * 
 * Sincronización en tiempo real entre todas las apps
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_KEY = 'manospy_users_db_v1';

/**
 * Verifica la integridad de los datos
 * Asegura que todos los usuarios tengan los campos requeridos
 */
export const validateAndFixUsers = async () => {
  try {
    const data = await AsyncStorage.getItem(DB_KEY);
    if (!data) return null;

    let users = JSON.parse(data);
    let hasChanges = false;

    users = users.map(user => {
      const requiredFields = {
        id: user.id || Math.random() * 10000,
        name: user.name || 'Usuario',
        email: user.email || `user${user.id}@example.com`,
        phone: user.phone || '',
        password: user.password || '',
        role: user.role || 'client',
        city: user.city || '',
        blocked: user.blocked === undefined ? false : user.blocked,
        createdAt: user.createdAt || new Date().toISOString(),
      };

      // Campos adicionales para profesionales
      if (user.role === 'professional') {
        requiredFields.specialty = user.specialty || '';
        requiredFields.verified = user.verified === undefined ? false : user.verified;
      }

      const updated = { ...requiredFields, ...user };
      if (JSON.stringify(updated) !== JSON.stringify(user)) {
        hasChanges = true;
      }
      return updated;
    });

    if (hasChanges) {
      await AsyncStorage.setItem(DB_KEY, JSON.stringify(users));
      console.log('✓ Datos reparados y validados');
    }

    return users;
  } catch (error) {
    console.error('Error validando datos:', error);
    return null;
  }
};

/**
 * Obtiene el siguiente ID disponible
 */
export const getNextUserId = async () => {
  try {
    const users = await AsyncStorage.getItem(DB_KEY);
    if (!users) return 1;

    const parsed = JSON.parse(users);
    const ids = parsed.map(u => u.id || 0);
    return Math.max(...ids, 0) + 1;
  } catch (error) {
    console.error('Error obteniendo ID siguiente:', error);
    return Date.now();
  }
};

/**
 * Sincroniza un usuario nuevo desde MANOSPY2
 * Crea o actualiza el usuario en AsyncStorage
 */
export const syncNewUser = async (user) => {
  try {
    // Validar que tenga campos mínimos
    if (!user.name || !user.email) {
      console.warn('Usuario inválido:', user);
      return false;
    }

    const users = await AsyncStorage.getItem(DB_KEY);
    let usersList = users ? JSON.parse(users) : [];

    // Buscar si el usuario ya existe (por email)
    const existingIndex = usersList.findIndex(u => u.email === user.email);

    // Asegurar que tenga ID
    if (!user.id) {
      user.id = await getNextUserId();
    }

    if (existingIndex !== -1) {
      // Actualizar usuario existente
      usersList[existingIndex] = { ...usersList[existingIndex], ...user };
      console.log(`✓ Usuario actualizado: ${user.name}`);
    } else {
      // Agregar nuevo usuario
      usersList.push({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: user.password || '',
        role: user.role || 'client',
        city: user.city || '',
        specialty: user.specialty || '',
        verified: user.verified === undefined ? (user.role === 'professional' ? false : undefined) : user.verified,
        blocked: user.blocked || false,
        createdAt: user.createdAt || new Date().toISOString(),
      });
      console.log(`✓ Nuevo usuario sincronizado: ${user.name}`);
    }

    await AsyncStorage.setItem(DB_KEY, JSON.stringify(usersList));
    return true;
  } catch (error) {
    console.error('Error sincronizando usuario:', error);
    return false;
  }
};

/**
 * Obtiene todos los usuarios sincronizados
 */
export const getAllSyncedUsers = async () => {
  try {
    const data = await AsyncStorage.getItem(DB_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error obteniendo usuarios sincronizados:', error);
    return [];
  }
};

/**
 * Limpia datos obsoletos o duplicados
 */
export const cleanupDuplicateUsers = async () => {
  try {
    const users = await getAllSyncedUsers();
    if (users.length === 0) return;

    // Eliminar duplicados por email
    const seen = new Set();
    const unique = users.filter(user => {
      if (seen.has(user.email)) {
        console.log(`⚠ Usuario duplicado encontrado: ${user.email}`);
        return false;
      }
      seen.add(user.email);
      return true;
    });

    if (unique.length < users.length) {
      await AsyncStorage.setItem(DB_KEY, JSON.stringify(unique));
      console.log(`✓ ${users.length - unique.length} duplicado(s) removido(s)`);
    }
  } catch (error) {
    console.error('Error limpiando duplicados:', error);
  }
};

export default {
  validateAndFixUsers,
  getNextUserId,
  syncNewUser,
  getAllSyncedUsers,
  cleanupDuplicateUsers,
};
