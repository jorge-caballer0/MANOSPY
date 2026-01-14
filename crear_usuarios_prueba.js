/**
 * Script para crear usuarios de prueba en AsyncStorage
 * Ejecutar en la consola del navegador cuando admin-app esté corriendo
 * 
 * IMPORTANTE: Copiar y pegar el contenido en la consola del navegador
 * mientras admin-app está abierto en http://localhost:8084
 */

// Función para guardar usuarios de prueba
async function crearUsuariosPrueba() {
  // Importar AsyncStorage
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  
  const usuarios = [
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
      verified: false,  // Pendiente de verificación
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
      verified: true,  // Ya verificado
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

  try {
    // Guardar en AsyncStorage con la misma clave que MANOSPY2
    await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(usuarios));
    console.log('✅ Usuarios de prueba creados correctamente');
    console.log('Usuarios:', usuarios);
    return usuarios;
  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
  }
}

// Función para ver usuarios guardados
async function verUsuarios() {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  
  try {
    const data = await AsyncStorage.getItem('manospy_users_db_v1');
    if (data) {
      const usuarios = JSON.parse(data);
      console.log('📋 Usuarios en AsyncStorage:');
      console.table(usuarios);
      return usuarios;
    } else {
      console.log('❌ No hay usuarios guardados');
      return [];
    }
  } catch (error) {
    console.error('❌ Error al leer usuarios:', error);
  }
}

// Función para limpiar la BD
async function limpiarBD() {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  
  try {
    await AsyncStorage.removeItem('manospy_users_db_v1');
    console.log('🗑️  BD limpiada correctamente');
  } catch (error) {
    console.error('❌ Error al limpiar:', error);
  }
}

// Exportar para usar en consola
window.crearUsuariosPrueba = crearUsuariosPrueba;
window.verUsuarios = verUsuarios;
window.limpiarBD = limpiarBD;

console.log('🚀 Funciones disponibles:');
console.log('- crearUsuariosPrueba() : Crea usuarios de prueba');
console.log('- verUsuarios() : Ve los usuarios guardados');
console.log('- limpiarBD() : Limpia la base de datos');
