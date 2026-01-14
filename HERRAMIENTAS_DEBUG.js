/**
 * HERRAMIENTA DE DEPURACIÓN
 * 
 * Para usar en la consola del navegador (F12) en http://localhost:8084
 * 
 * Copia y pega estas funciones en la consola para debugging
 */

// ============================================
// FUNCIÓN 1: Ver todos los datos guardados
// ============================================
async function verDatos() {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const data = await AsyncStorage.getItem('manospy_users_db_v1');
    if (data) {
      console.log('📊 USUARIOS EN BASE DE DATOS:');
      console.table(JSON.parse(data));
      console.log(`✓ Total: ${JSON.parse(data).length} usuarios`);
    } else {
      console.log('⚠️ No hay datos guardados');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// ============================================
// FUNCIÓN 2: Agregar usuario de prueba
// ============================================
async function agregarUsuarioPrueba() {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const data = await AsyncStorage.getItem('manospy_users_db_v1');
    const users = data ? JSON.parse(data) : [];
    
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: 'Usuario Prueba ' + new Date().getTime(),
      email: `prueba${Date.now()}@mail.com`,
      phone: '595991234567',
      password: 'test123',
      role: 'client',
      city: 'Asunción',
      blocked: false,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(users));
    console.log('✓ Usuario agregado:', newUser);
    console.log('Total ahora:', users.length);
  } catch (error) {
    console.error('Error:', error);
  }
}

// ============================================
// FUNCIÓN 3: Limpiar todos los datos
// ============================================
async function limpiarDatos() {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.removeItem('manospy_users_db_v1');
    console.log('✓ Base de datos limpiada');
    console.log('⚠️ Recarga la página para crear datos de prueba nuevamente');
  } catch (error) {
    console.error('Error:', error);
  }
}

// ============================================
// FUNCIÓN 4: Ver estadísticas
// ============================================
async function verEstadisticas() {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const data = await AsyncStorage.getItem('manospy_users_db_v1');
    if (!data) {
      console.log('⚠️ No hay datos');
      return;
    }
    
    const users = JSON.parse(data);
    const stats = {
      total: users.length,
      clientes: users.filter(u => u.role === 'client').length,
      profesionales: users.filter(u => u.role === 'professional').length,
      verificados: users.filter(u => u.verified === true).length,
      pendientes: users.filter(u => u.verified === false && u.role === 'professional').length,
      bloqueados: users.filter(u => u.blocked).length,
    };
    
    console.log('📈 ESTADÍSTICAS:');
    console.table(stats);
  } catch (error) {
    console.error('Error:', error);
  }
}

// ============================================
// FUNCIÓN 5: Buscar usuario por email
// ============================================
async function buscarUsuario(email) {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const data = await AsyncStorage.getItem('manospy_users_db_v1');
    if (!data) {
      console.log('⚠️ No hay datos');
      return;
    }
    
    const users = JSON.parse(data);
    const user = users.find(u => u.email.includes(email));
    
    if (user) {
      console.log('✓ Usuario encontrado:');
      console.table(user);
    } else {
      console.log(`❌ No se encontró usuario con email: ${email}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// ============================================
// FUNCIÓN 6: Validar integridad de datos
// ============================================
async function validarIntegridad() {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const data = await AsyncStorage.getItem('manospy_users_db_v1');
    if (!data) {
      console.log('⚠️ No hay datos');
      return;
    }
    
    const users = JSON.parse(data);
    let errores = [];
    
    users.forEach((user, index) => {
      if (!user.id) errores.push(`Usuario ${index}: Falta ID`);
      if (!user.name) errores.push(`Usuario ${index}: Falta nombre`);
      if (!user.email) errores.push(`Usuario ${index}: Falta email`);
      if (!user.role) errores.push(`Usuario ${index}: Falta role`);
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
}

// ============================================
// INSTRUCCIONES DE USO
// ============================================
console.log(`
╔════════════════════════════════════════════════════════════╗
║           🔧 HERRAMIENTAS DE DEBUGGING                    ║
╚════════════════════════════════════════════════════════════╝

Funciones disponibles:

1. verDatos()
   → Muestra todos los usuarios guardados

2. agregarUsuarioPrueba()
   → Agrega un usuario de prueba aleatorio

3. limpiarDatos()
   → Borra TODOS los datos (cuidado!)

4. verEstadisticas()
   → Muestra resumen de estadísticas

5. buscarUsuario('email@mail.com')
   → Busca un usuario por email

6. validarIntegridad()
   → Verifica si los datos están bien formados

Ejemplos:
  verDatos()
  buscarUsuario('juan')
  agregarUsuarioPrueba()
`);
