/**
 * Servicio de Lectura Local (sin servidor)
 * Para admin-app - Solo AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_KEY = 'manospy_users_db_v1';

/**
 * Obtener todos los usuarios desde AsyncStorage local
 */
export const fetchUsersFromServer = async () => {
  try {
    console.log('📥 Obteniendo usuarios de AsyncStorage...');
    
    const data = await AsyncStorage.getItem(DB_KEY);
    const users = data ? JSON.parse(data) : [];
    
    console.log(`✅ ${users.length} usuarios obtenidos de AsyncStorage`);
    return { ok: true, data: users };
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    return { ok: false, error: error.message, data: [] };
  }
};

/**
 * Sincronizar usuarios desde AsyncStorage local
 */
export const syncUsersFromServer = async () => {
  try {
    const result = await fetchUsersFromServer();
    
    if (!result.ok) {
      return result;
    }
    
    console.log(`✅ ${result.data.length} usuarios sincronizados desde AsyncStorage`);
    return { ok: true, data: result.data };
  } catch (error) {
    console.error('❌ Error sincronizando:', error);
    return { ok: false, error: error.message, data: [] };
  }
};

/**
 * Obtener estadísticas del servidor
 */
export const fetchStatsFromServer = async () => {
  try {
    const response = await fetch(`${SYNC_SERVER_URL}/api/sync/stats`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return { ok: true, data: data.data };
  } catch (error) {
    console.error('❌ Error al obtener estadísticas del servidor:', error);
    return { ok: false, error: error.message };
  }
};

/**
 * Verificar conexión con el servidor
 */
export const checkServerConnection = async () => {
  try {
    const response = await fetch(`${SYNC_SERVER_URL}/health`);
    return response.ok;
  } catch (error) {
    console.warn('⚠️  Servidor no disponible:', error.message);
    return false;
  }
};
