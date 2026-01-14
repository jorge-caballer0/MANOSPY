/**
 * Sincronización de datos local con AsyncStorage
 * 
 * ARQUITECTURA:
 * - Todas las apps comparten el mismo contenedor de AsyncStorage
 * - manospy_users_db_v1 es la base de datos local compartida
 * - Sin servidor, todo es local
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_KEY = 'manospy_users_db_v1';

/**
 * Obtener usuarios desde AsyncStorage local
 */
export const getUsers = async () => {
  try {
    const data = await AsyncStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return [];
  }
};

/**
 * Guardar usuarios a AsyncStorage local
 */
export const saveUsers = async (users) => {
  try {
    await AsyncStorage.setItem(DB_KEY, JSON.stringify(users));
    console.log(`✅ ${users.length} usuarios guardados en AsyncStorage`);
    return true;
  } catch (error) {
    console.error('Error guardando usuarios:', error);
    return false;
  }
};

/**
 * Sincronizar datos locales (lectura desde AsyncStorage)
 */
export const syncDataFromServer = async () => {
  try {
    console.log('⬇️  Leyendo datos desde AsyncStorage...');
    
    const users = await getUsers();
    console.log(`✅ ${users.length} usuarios sincronizados desde AsyncStorage`);
    return true;
  } catch (error) {
    console.error('Error sincronizando datos:', error);
    return false;
  }
};

/**
 * Inicia sincronización periódica (actualiza desde AsyncStorage)
 * Se debe llamar una sola vez al iniciar la app
 */
export const startDataSync = () => {
  // En modo local, no necesitamos sincronización periódica
  // Cada cambio se guarda inmediatamente en AsyncStorage
  console.log('🔄 Sincronización local activada (AsyncStorage)');
};

/**
 * Crear datos de prueba en AsyncStorage
 * SOLO si no hay datos previos
 */
export const createDemoData = async () => {
  try {
    const existingData = await AsyncStorage.getItem('manospy_users_db_v1');
    
    // Si ya hay datos, NO hacer nada
    if (existingData) {
      console.log('✓ Datos existentes encontrados, no se crean datos demo');
      return JSON.parse(existingData);
    }
    
    // Solo crear datos de demo si está COMPLETAMENTE vacío
    const demoUsers = [
      {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@test.com',
        phone: '595991234567',
        password: 'test123',
        role: 'client',
        city: 'Asunción',
        blocked: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Carlos López',
        email: 'carlos@test.com',
        phone: '595990987654',
        password: 'test123',
        role: 'professional',
        specialty: 'Plomería',
        verified: true,
        city: 'Asunción',
        blocked: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'María García',
        email: 'maria@test.com',
        phone: '595991111111',
        password: 'test123',
        role: 'professional',
        specialty: 'Electricidad',
        verified: false,
        city: 'Itauguá',
        blocked: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: 'Pedro González',
        email: 'pedro@test.com',
        phone: '595992222222',
        password: 'test123',
        role: 'client',
        city: 'Lambaré',
        blocked: false,
        createdAt: new Date().toISOString(),
      },
    ];

    await AsyncStorage.setItem(
      'manospy_users_db_v1',
      JSON.stringify(demoUsers)
    );
    
    console.log('✓ Datos de prueba creados en AsyncStorage');
    return demoUsers;
  } catch (error) {
    console.error('Error creando datos de demo:', error);
    return [];
  }
};

/**
 * Obtener todos los usuarios
 */
export const getAllUsers = async () => {
  try {
    const data = await AsyncStorage.getItem('manospy_users_db_v1');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return [];
  }
};

/**

 * Agregar nuevo usuario
 */
export const addUser = async (user) => {
  try {
    const users = await getAllUsers();
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...user,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    await saveUsers(users);
    return newUser;
  } catch (error) {
    console.error('Error agregando usuario:', error);
    return null;
  }
};

/**
 * Actualizar usuario
 */
export const updateUser = async (userId, updatedData) => {
  try {
    const users = await getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      await saveUsers(users);
      return users[index];
    }
    return null;
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return null;
  }
};

/**
 * Eliminar usuario
 */
export const deleteUser = async (userId) => {
  try {
    const users = await getAllUsers();
    const filtered = users.filter(u => u.id !== userId);
    await saveUsers(filtered);
    return true;
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return false;
  }
};

/**
 * Obtener estadísticas
 */
export const getStats = async () => {
  try {
    const users = await getAllUsers();
    return {
      totalUsers: users.length,
      clients: users.filter(u => u.role === 'client').length,
      professionals: users.filter(u => u.role === 'professional').length,
      verified: users.filter(u => u.role === 'professional' && u.verified).length,
      pending: users.filter(u => u.role === 'professional' && !u.verified).length,
      blocked: users.filter(u => u.blocked).length,
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return {
      totalUsers: 0,
      clients: 0,
      professionals: 0,
      verified: 0,
      pending: 0,
      blocked: 0,
    };
  }
};
