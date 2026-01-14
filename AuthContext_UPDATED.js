import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncNewUser, checkServerHealth } from '../utils/syncService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usersDb, setUsersDb] = useState([]);

  const STORAGE_KEYS = {
    CURRENT_USER: 'manospy_current_user',
    USERS_DB: 'manospy_users_db_v1'
  };

  // Cargar datos persistentes al iniciar
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedUser, storedDb] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER),
        AsyncStorage.getItem(STORAGE_KEYS.USERS_DB)
      ]);

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedDb) setUsersDb(JSON.parse(storedDb));
    } catch (error) {
      console.error('[Auth] Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const persistUser = async (userData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
    } catch (error) {
      console.error('[Auth] Error persisting user:', error);
    }
  };

  const saveUsersDb = async (db) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db));
      setUsersDb(db);
    } catch (error) {
      console.error('[Auth] Error saving users DB:', error);
    }
  };

  // 🔐 REGISTRO DE USUARIO
  const register = async (userData) => {
    console.log('[Auth] Register attempt:', { email: userData.email, role: userData.role });
    setIsLoading(true);
    try {
      // Validar datos
      if (!userData.email || !userData.password || !userData.name) {
        return { ok: false, error: 'Email, nombre y contraseña requeridos' };
      }

      // Generar ID único
      const newUser = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        blocked: false,
        verified: userData.role === 'professional' ? false : true, // Clientes verificados por defecto
        createdAt: new Date().toLocaleDateString('es-ES')
      };

      // Guardar en AsyncStorage
      const updatedDb = [...usersDb, newUser];
      await saveUsersDb(updatedDb);

      console.log('[Auth] ✅ Usuario registrado localmente:', newUser.email);

      // 📤 SINCRONIZAR CON SERVIDOR
      try {
        await syncNewUser(newUser);
        console.log('[Auth] ✅ Usuario sincronizado con servidor:', newUser.email);
      } catch (syncError) {
        console.warn('[Auth] ⚠️ No se sincronizó con servidor (continuando offline):', syncError.message);
      }

      setIsLoading(false);
      return { ok: true, user: newUser };
    } catch (error) {
      console.error('[Auth] Register error:', error);
      setIsLoading(false);
      return { ok: false, error: error.message || 'Error en registro' };
    }
  };

  // 🔓 LOGIN DE USUARIO (SINCRONIZA CON SERVIDOR)
  const login = async (email, password) => {
    console.log('[Auth] Login attempt:', { email, usersDbLength: usersDb.length });
    setIsLoading(true);
    try {
      if (!email || !password) {
        setIsLoading(false);
        return { ok: false, error: 'Email y contraseña requeridos' };
      }

      // 📥 LEER LA BD DEL SERVIDOR ANTES DE BUSCAR
      console.log('[Auth] 📥 Leyendo BD desde servidor...');
      let latestDb = usersDb;
      
      try {
        const response = await fetch('http://192.168.1.105:5555/api/sync/users');
        if (response.ok) {
          const serverData = await response.json();
          latestDb = serverData.data;
          console.log('[Auth] ✅ BD sincronizada desde servidor:', latestDb.length, 'usuarios');
          
          // Guardar en AsyncStorage para futuras lecturas rápidas
          await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(latestDb));
          setUsersDb(latestDb);
        }
      } catch (syncError) {
        console.warn('[Auth] ⚠️ No se pudo conectar con servidor, usando BD local:', syncError.message);
        // Continuar con BD local si falla el servidor
        const latestDbJSON = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
        if (latestDbJSON) {
          latestDb = JSON.parse(latestDbJSON);
        }
      }

      console.log('[Auth] Buscando usuario en BD de', latestDb.length, 'usuarios');
      const foundUser = latestDb.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser) {
        console.log('[Auth] Usuario no encontrado:', email);
        setIsLoading(false);
        return { ok: false, error: 'Usuario no encontrado. Por favor regístrate...' };
      }

      console.log('[Auth] Usuario encontrado:', foundUser.email);

      if (foundUser.password !== password) {
        console.log('[Auth] Contraseña incorrecta para:', email);
        setIsLoading(false);
        return { ok: false, error: 'Contraseña incorrecta' };
      }

      // Verificar si está bloqueado
      if (foundUser.blocked) {
        console.log('[Auth] Cuenta bloqueada:', email);
        setIsLoading(false);
        return { ok: false, error: 'Tu cuenta ha sido bloqueada por el administrador' };
      }

      // Verificar si es profesional sin validar
      if (foundUser.role === 'professional' && foundUser.verified === false) {
        console.log('[Auth] Profesional no verificado:', email);
        setIsLoading(false);
        return { ok: false, error: 'Tu cuenta está pendiente de verificación. Te notificaremos pronto.' };
      }

      // ✅ TODO BIEN - LOGIN EXITOSO
      setUser(foundUser);
      console.log('[Auth] ✅ Login exitoso:', foundUser.email);
      await persistUser(foundUser);
      setIsLoading(false);
      return { ok: true, user: foundUser };
    } catch (error) {
      console.error('[Auth] Login error:', error);
      setIsLoading(false);
      return { ok: false, error: error.message || 'Error en login' };
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    console.log('[Auth] Logout');
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      setUser(null);
      setIsLoading(false);
      return { ok: true };
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      return { ok: false, error: error.message };
    }
  };

  // 👤 ACTUALIZAR PERFIL DE USUARIO
  const updateUserProfile = async (userId, updates) => {
    console.log('[Auth] Updating user profile:', userId);
    try {
      const updatedDb = usersDb.map(u => u.id === userId ? { ...u, ...updates } : u);
      await saveUsersDb(updatedDb);

      if (user?.id === userId) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        await persistUser(updatedUser);
      }

      return { ok: true, user: updatedDb.find(u => u.id === userId) };
    } catch (error) {
      console.error('[Auth] Update profile error:', error);
      return { ok: false, error: error.message };
    }
  };

  // 📊 OBTENER LISTA DE USUARIOS
  const getUsers = (role = null, filters = {}) => {
    let result = usersDb;

    if (role) {
      result = result.filter(u => u.role === role);
    }

    if (filters.verified !== undefined) {
      result = result.filter(u => u.verified === filters.verified);
    }

    if (filters.blocked !== undefined) {
      result = result.filter(u => u.blocked === filters.blocked);
    }

    return result;
  };

  const value = {
    user,
    isLoading,
    usersDb,
    register,
    login,
    logout,
    updateUserProfile,
    getUsers,
    setUsersDb // Para sincronización manual si es necesaria
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
