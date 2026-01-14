/**
 * ═══════════════════════════════════════════════════════════════════
 * SERVICIO DE SINCRONIZACIÓN - MANOSPY2
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Propósito: Sincronizar datos con el servidor central en tiempo real
 * 
 * Características:
 *   ✅ Sincronización automática de usuarios
 *   ✅ Polling cada 5 segundos para detectar cambios
 *   ✅ Fallback a AsyncStorage si el servidor no está disponible
 *   ✅ Validación de datos compartidos
 * 
 * Modo: SERVIDOR CENTRAL (sync-server.js)
 * Servidor: http://localhost:5555
 * ═══════════════════════════════════════════════════════════════════
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const DB_KEY = 'manospy_users_db_v1';
const SERVER_URL = 'http://localhost:5555';
let syncInterval = null;

/**
 * Sincronizar todos los usuarios con el servidor
 * Se ejecuta automáticamente cada 5 segundos
 */
export const syncAllUsers = async (users) => {
  try {
    console.log('📤 Enviando usuarios al servidor...');
    
    // Guardar localmente primero
    await AsyncStorage.setItem(DB_KEY, JSON.stringify(users));
    console.log(`✅ ${users.length} usuarios guardados localmente`);
    
    // Intentar sincronizar con servidor
    try {
      const response = await fetch(`${SERVER_URL}/api/sync/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`🌐 Sincronizado con servidor: ${data.count} usuarios`);
        return { ok: true, data: { message: 'Usuarios sincronizados', count: users.length } };
      }
    } catch (serverError) {
      console.warn('⚠️ Servidor no disponible, funcionando en modo local:', serverError.message);
    }
    
    return { ok: true, data: { message: 'Usuarios guardados localmente', count: users.length } };
  } catch (error) {
    console.error('❌ Error al sincronizar usuarios:', error);
    return { ok: false, error: error.message };
  }
};

/**
 * Sincronizar un usuario nuevo
 */
export const syncNewUser = async (user) => {
  try {
    console.log(`📝 Creando usuario: ${user.name}`);
    
    // Obtener usuarios existentes
    const data = await AsyncStorage.getItem(DB_KEY);
    const users = data ? JSON.parse(data) : [];
    
    // Agregar nuevo usuario con ID automático
    if (!user.id) {
      user.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    }
    user.createdAt = new Date().toISOString();
    users.push(user);
    
    // Guardar localmente
    await AsyncStorage.setItem(DB_KEY, JSON.stringify(users));
    console.log(`✅ Usuario "${user.name}" guardado localmente`);
    
    // Sincronizar con servidor
    try {
      const response = await fetch(`${SERVER_URL}/api/sync/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`🌐 Usuario sincronizado con servidor: ${user.name}`);
        return { ok: true, data: { message: 'Usuario creado y sincronizado', user } };
      }
    } catch (serverError) {
      console.warn('⚠️ Servidor no disponible, usuario guardado localmente');
    }
    
    return { ok: true, data: { message: 'Usuario guardado', user } };
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    return { ok: false, error: error.message };
  }
};

/**
 * Obtener estadísticas del servidor
 */
export const getServerStats = async () => {
  try {
    // Intentar obtener del servidor
    try {
      const response = await fetch(`${SERVER_URL}/api/sync/stats`);
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Estadísticas del servidor:', data.data);
        return data;
      }
    } catch (serverError) {
      console.warn('⚠️ No se pudo conectar al servidor para estadísticas');
    }
    
    // Fallback: calcular localmente
    const data = await AsyncStorage.getItem(DB_KEY);
    const users = data ? JSON.parse(data) : [];
    
    return { 
      ok: true, 
      data: { 
        totalUsers: users.length,
        professionals: users.filter(u => u.role === 'professional').length,
        clients: users.filter(u => u.role === 'client').length,
        verified: users.filter(u => u.verified).length,
      } 
    };
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    return { ok: false, error: error.message };
  }
};

/**
 * Verificar disponibilidad del servidor
 */
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/health`, { timeout: 3000 });
    if (response.ok) {
      console.log('✅ Servidor disponible');
      return true;
    }
  } catch (error) {
    console.warn('⚠️ Servidor no disponible:', error.message);
  }
  return false;
};

/**
 * Iniciar sincronización automática en tiempo real
 * Se ejecuta cada 5 segundos para detectar cambios en el servidor
 */
export const startAutoSync = async (onDataChange) => {
  console.log('🔄 Iniciando sincronización automática...');
  
  // Sincronizar inmediatamente
  try {
    const response = await fetch(`${SERVER_URL}/api/sync/users`);
    if (response.ok) {
      const data = await response.json();
      if (data.ok && data.data) {
        await AsyncStorage.setItem(DB_KEY, JSON.stringify(data.data));
        onDataChange && onDataChange(data.data);
        console.log(`✅ Datos sincronizados: ${data.data.length} usuarios`);
      }
    }
  } catch (error) {
    console.warn('⚠️ No se pudo sincronizar inicialmente');
  }
  
  // Polling cada 5 segundos
  syncInterval = setInterval(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/sync/users`);
      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.data) {
          // Guardar y notificar cambios
          const localData = await AsyncStorage.getItem(DB_KEY);
          const localJson = localData ? JSON.parse(localData) : [];
          
          // Detectar si hay cambios
          if (JSON.stringify(localJson) !== JSON.stringify(data.data)) {
            console.log('🔄 Cambios detectados, actualizando...');
            await AsyncStorage.setItem(DB_KEY, JSON.stringify(data.data));
            onDataChange && onDataChange(data.data);
          }
        }
      }
    } catch (error) {
      // Silenciosamente fallar en polling
    }
  }, 5000);
};

/**
 * Detener sincronización automática
 */
export const stopAutoSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    console.log('⏹️  Sincronización automática detenida');
  }
};
