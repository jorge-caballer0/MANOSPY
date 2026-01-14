import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncNewUser, startAutoSync, stopAutoSync } from '../utils/syncService';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  USER: 'manospy_user_v1',
  ROLE: 'manospy_role_v1',
  USERS_DB: 'manospy_users_db_v1',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usersDb, setUsersDb] = useState([]);

  useEffect(() => {
    const load = async () => {
      console.log('[Auth] Iniciando carga de datos persistentes...');
      try {
        const u = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        const r = await AsyncStorage.getItem(STORAGE_KEYS.ROLE);
        const db = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
        console.log('[Auth] ✓ Datos cargados:', { user: !!u, role: !!r, usersDb: db ? JSON.parse(db).length : 0 });
        if (u) setUser(JSON.parse(u));
        if (r) setRole(r);
        if (db) setUsersDb(JSON.parse(db));
        
        // 🔄 Iniciar sincronización automática con el servidor
        console.log('[Auth] 🔄 Iniciando sincronización automática con servidor...');
        startAutoSync((updatedUsers) => {
          console.log('[Auth] 📥 Datos sincronizados del servidor:', updatedUsers.length, 'usuarios');
          setUsersDb(updatedUsers);
        });
      } catch (e) {
        console.error('[Auth] ✗ Load error', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    
    // Cleanup: detener sincronización al desmontar
    return () => {
      stopAutoSync();
    };
  }, []);

  const persistRole = async (selectedRole) => {
    try {
      if (selectedRole) await AsyncStorage.setItem(STORAGE_KEYS.ROLE, selectedRole);
      else await AsyncStorage.removeItem(STORAGE_KEYS.ROLE);
    } catch (e) {
      console.warn('Persist role error', e);
    }
  };

  const persistUser = async (u) => {
    try {
      if (u) await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
      else await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.warn('Persist user error', e);
    }
  };

  const persistUsersDb = async (db) => {
    try {
      const jsonStr = JSON.stringify(db);
      console.log('[Auth] Persisting usersDb:', jsonStr.length, 'bytes');
      await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, jsonStr);
      console.log('[Auth] ✓ usersDb persisted');
    } catch (e) {
      console.error('[Auth] ✗ Persist users db error', e);
    }
  };

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    persistRole(selectedRole);
  };

  const register = async (data) => {
    console.log('[Auth] Register called with:', { email: data.email, hasPassword: !!data.password });
    setIsLoading(true);
    try {
      if (!data.email) {
        setIsLoading(false);
        return { ok: false, error: 'Email requerido' };
      }
      const existing = usersDb.find(u => u.email.toLowerCase() === data.email.toLowerCase());
      if (existing) {
        console.log('[Auth] Email ya existe:', data.email);
        setIsLoading(false);
        return { ok: false, error: 'Email ya registrado' };
      }
      const newUser = {
        id: Date.now(),
        name: data.name || data.email.split('@')[0] || 'Usuario',
        email: data.email,
        phone: data.phone || null,
        city: data.city || null,
        role: role || 'client',
        password: data.password || '123456',
        createdAt: new Date().toISOString(),
        verified: role === 'professional' ? false : true,
      };
      console.log('[Auth] Creating new user:', newUser);
      const newDb = [...usersDb, newUser];
      setUsersDb(newDb);
      console.log('[Auth] Updated usersDb length:', newDb.length);
      await persistUsersDb(newDb);
      
      // Sincronizar con el servidor central
      console.log('[Auth] 📤 Sincronizando nuevo usuario con servidor...');
      syncNewUser(newUser).catch(err => {
        console.warn('[Auth] Advertencia: No se pudo sincronizar con servidor:', err);
      });
      
      // NO setUser aquí - solo guardar en la BD, sin iniciar sesión
      console.log('[Auth] ✓ User saved to database (NOT logged in)');
      setIsLoading(false);
      return { ok: true, user: newUser };
    } catch (error) {
      console.error('[Auth] Registration error:', error);
      setIsLoading(false);
      return { ok: false, error: error.message || 'Error en registro' };
    }
  };

  const login = async (email, password) => {
    console.log('[Auth] Login attempt:', { email, usersDbLength: usersDb.length });
    setIsLoading(true);
    try {
      if (!email || !password) {
        setIsLoading(false);
        return { ok: false, error: 'Email y contraseña requeridos' };
      }

      // USAR BD LOCAL (sin servidor)
      let latestDb = usersDb;
      const latestDbJSON = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      if (latestDbJSON) {
        latestDb = JSON.parse(latestDbJSON);
        console.log('[Auth] ✅ BD local cargada:', latestDb.length, 'usuarios');
      }

      console.log('[Auth] Buscando usuario en BD de', latestDb.length, 'usuarios');

      // BUSCAR USUARIO
      const foundUser = latestDb.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!foundUser) {
        console.log('[Auth] ❌ Usuario no encontrado:', email);
        setIsLoading(false);
        return {
          ok: false,
          error: 'Usuario no encontrado. Por favor regístrate.',
        };
      }

      console.log('[Auth] ✓ Usuario encontrado:', foundUser.email);

      // VERIFICAR CONTRASEÑA
      if (foundUser.password !== password) {
        console.log('[Auth] ❌ Contraseña incorrecta para:', email);
        setIsLoading(false);
        return { ok: false, error: 'Contraseña incorrecta' };
      }

      // VERIFICAR SI ESTÁ BLOQUEADO
      if (foundUser.blocked) {
        console.log('[Auth] ❌ Cuenta bloqueada:', email);
        setIsLoading(false);
        return {
          ok: false,
          error: 'Tu cuenta ha sido bloqueada por el administrador',
        };
      }

      // VERIFICAR SI ES PROFESIONAL SIN VALIDAR
      if (foundUser.role === 'professional' && foundUser.verified !== true) {
        console.log('[Auth] ❌ Profesional no verificado:', email);
        setIsLoading(false);
        return {
          ok: false,
          error:
            'Tu cuenta está pendiente de verificación por el administrador. Te notificaremos pronto.',
        };
      }

      // LOGIN EXITOSO
      console.log('[Auth] ✅ Login exitoso:', {
        email: foundUser.email,
        role: foundUser.role,
        verified: foundUser.verified,
      });

      setUser(foundUser);
      await persistUser(foundUser);
      setIsLoading(false);
      return { ok: true, user: foundUser };
    } catch (error) {
      console.error('[Auth] Login error:', error);
      setIsLoading(false);
      return { ok: false, error: error.message || 'Error en login' };
    }
  };

  const logout = async () => {
    setUser(null);
    setRole(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.ROLE);
    } catch (e) {
      console.warn('Logout storage error', e);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      console.log('[Auth] Actualizando usuario:', updatedUser.email);
      
      // Actualizar en usersDb
      const newDb = usersDb.map(u => u.id === updatedUser.id ? updatedUser : u);
      setUsersDb(newDb);
      await persistUsersDb(newDb);
      console.log('[Auth] ✓ Usuario actualizado en BD');

      // Actualizar usuario logeado
      setUser(updatedUser);
      await persistUser(updatedUser);
      console.log('[Auth] ✓ Usuario logeado actualizado');

      return { ok: true, user: updatedUser };
    } catch (error) {
      console.error('[Auth] Update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, selectRole, register, login, logout, updateUser, usersDb }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
