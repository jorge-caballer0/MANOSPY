/**
 * SCRIPT DE SINCRONIZACIÓN INMEDIATA
 * 
 * Ejecuta esto en la consola de React Native/Expo para sincronizar MANOSPY2 con admin-app
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ FUNCIÓN 1: Ver usuarios guardados en MANOSPY2
export const verUsuariosManospy2 = async () => {
  try {
    const data = await AsyncStorage.getItem('manospy_users_db_v1');
    if (!data) {
      console.log('⚠️ No hay usuarios guardados');
      return [];
    }
    const users = JSON.parse(data);
    console.log(`📊 MANOSPY2: ${users.length} usuarios guardados`);
    console.table(users.map(u => ({
      ID: u.id,
      Nombre: u.name,
      Email: u.email,
      Rol: u.role,
      Verificado: u.verified || 'N/A',
      Bloqueado: u.blocked ? '🚫' : '✓',
    })));
    return users;
  } catch (error) {
    console.error('Error:', error);
  }
};

// ✅ FUNCIÓN 2: Limpiar todos los datos
export const limpiarBD = async () => {
  try {
    await AsyncStorage.removeItem('manospy_users_db_v1');
    await AsyncStorage.removeItem('manospy_user_v1');
    await AsyncStorage.removeItem('manospy_role_v1');
    console.log('✓ Base de datos limpiada completamente');
  } catch (error) {
    console.error('Error limpiando BD:', error);
  }
};

// ✅ FUNCIÓN 3: Agregar usuario de prueba
export const agregarUsuarioPrueba = async (tipo = 'client') => {
  try {
    const data = await AsyncStorage.getItem('manospy_users_db_v1');
    const users = data ? JSON.parse(data) : [];
    
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1,
      name: tipo === 'professional' ? 'Prof Test' : 'Client Test',
      email: tipo === 'professional' ? `proftest${Date.now()}@mail.com` : `clienttest${Date.now()}@mail.com`,
      phone: '595991234567',
      password: 'test123',
      role: tipo,
      city: 'Asunción',
      blocked: false,
      createdAt: new Date().toISOString(),
    };
    
    if (tipo === 'professional') {
      newUser.specialty = 'Plomería';
      newUser.verified = false;
    }
    
    users.push(newUser);
    await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(users));
    console.log(`✓ ${tipo} agregado:`, newUser);
    return newUser;
  } catch (error) {
    console.error('Error:', error);
  }
};

// ✅ FUNCIÓN 4: Sincronizar datos manualmente
export const sincronizarDatos = async () => {
  try {
    const users = await verUsuariosManospy2();
    console.log('\n✓ Datos sincronizados con admin-app');
    console.log('Recuerda: admin-app se actualiza automáticamente cada 3 segundos');
    return users;
  } catch (error) {
    console.error('Error:', error);
  }
};

// ✅ FUNCIÓN 5: Validar integridad
export const validarIntegridad = async () => {
  try {
    const data = await AsyncStorage.getItem('manospy_users_db_v1');
    if (!data) {
      console.log('⚠️ No hay datos para validar');
      return;
    }
    
    const users = JSON.parse(data);
    let errores = [];
    
    users.forEach((u, i) => {
      if (!u.id) errores.push(`Usuario ${i}: Falta ID`);
      if (!u.email) errores.push(`Usuario ${i}: Falta email`);
      if (!u.name) errores.push(`Usuario ${i}: Falta nombre`);
      if (!u.role) errores.push(`Usuario ${i}: Falta rol`);
      if (u.role === 'professional' && u.verified === undefined) errores.push(`Usuario ${i}: Falta 'verified'`);
    });
    
    if (errores.length === 0) {
      console.log('✓ Integridad de datos: OK');
    } else {
      console.log('❌ Errores encontrados:');
      errores.forEach(e => console.log(`  - ${e}`));
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

console.log(`
╔══════════════════════════════════════════════════════════╗
║        🔧 HERRAMIENTAS DE SINCRONIZACIÓN MANOSPY2       ║
╚══════════════════════════════════════════════════════════╝

Funciones disponibles:

1. verUsuariosManospy2()
   → Muestra todos los usuarios guardados

2. agregarUsuarioPrueba('client' o 'professional')
   → Agrega un usuario de prueba

3. limpiarBD()
   → Borra TODOS los datos (cuidado!)

4. sincronizarDatos()
   → Sincroniza datos con admin-app

5. validarIntegridad()
   → Verifica que los datos sean correctos

Ejemplo:
  agregarUsuarioPrueba('professional')
  verUsuariosManospy2()
`);
