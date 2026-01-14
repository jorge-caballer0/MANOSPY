/**
 * TEST AUTOMATIZADO: Validación de Profesionales
 * 
 * Ejecutar con: node test-validation-flow.js
 * 
 * Prueba el flujo completo:
 * 1. Admin valida profesional
 * 2. Profesional intenta iniciar sesión
 * 3. Verifica que el acceso sea permitido
 */

const API_URL = 'http://192.168.1.135:5555';

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
};

async function testValidationFlow() {
  console.log(`\n${colors.blue}=== TEST: VALIDACIÓN DE PROFESIONALES ===${colors.reset}\n`);

  try {
    // 1. Obtener estado inicial del servidor
    log.info('Conectando al servidor de sincronización...');
    const healthRes = await fetch(`${API_URL}/health`);
    if (!healthRes.ok) throw new Error('Servidor no disponible');
    log.success('Servidor conectado');

    // 2. Obtener usuarios actuales
    log.info('Obteniendo usuarios actuales...');
    const usersRes = await fetch(`${API_URL}/api/sync/users`);
    const usersData = await usersRes.json();
    const users = usersData.data || [];
    log.success(`${users.length} usuarios en la base de datos`);

    // 3. Buscar profesional pendiente
    const pendingPro = users.find(
      (u) => u.role === 'professional' && u.verified !== true
    );

    if (!pendingPro) {
      log.warn('No hay profesionales pendientes de validación');
      log.info('Para probar, registra un profesional en MANOSPY2 primero');
      return;
    }

    log.info(`Profesional pendiente encontrado: ${pendingPro.name} (${pendingPro.email})`);

    // 4. Validar al profesional (simulando click del admin)
    log.info(`Validando a ${pendingPro.name}...`);
    const validatedPro = { ...pendingPro, verified: true, updatedAt: new Date().toISOString() };

    const validateRes = await fetch(`${API_URL}/api/sync/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedPro),
    });

    if (!validateRes.ok) throw new Error('Error al validar profesional');
    const validateData = await validateRes.json();
    log.success(`Profesional validado: ${validateData.message}`);

    // 5. Sincronizar array completo
    log.info('Sincronizando base de datos completa...');
    const updatedUsers = users.map((u) =>
      u.id === pendingPro.id ? validatedPro : u
    );

    const syncRes = await fetch(`${API_URL}/api/sync/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users: updatedUsers }),
    });

    if (!syncRes.ok) throw new Error('Error en sincronización');
    log.success('Base de datos sincronizada');

    // 6. Obtener profesional actualizado y verificar
    log.info('Verificando que el profesional esté validado...');
    const checkRes = await fetch(`${API_URL}/api/sync/users`);
    const checkData = await checkRes.json();
    const verifiedPro = checkData.data.find((u) => u.id === pendingPro.id);

    if (!verifiedPro) {
      throw new Error('Profesional no encontrado después de validación');
    }

    if (verifiedPro.verified !== true) {
      throw new Error(`Profesional no está validado: verified=${verifiedPro.verified}`);
    }

    log.success(`Profesional ${verifiedPro.name} está validado (verified=true)`);

    // 7. Simular login del profesional
    log.info(`Simulando login del profesional ${pendingPro.email}...`);

    // Verificar que está en la BD
    const foundUser = updatedUsers.find(
      (u) => u.email.toLowerCase() === pendingPro.email.toLowerCase()
    );

    if (!foundUser) {
      throw new Error('Profesional no encontrado en la BD');
    }

    if (foundUser.blocked) {
      throw new Error('Profesional está bloqueado');
    }

    if (foundUser.role === 'professional' && foundUser.verified !== true) {
      throw new Error('Profesional no está verificado');
    }

    log.success(`✅ Profesional ${pendingPro.name} puede iniciar sesión`);

    // 8. Obtener estadísticas finales
    log.info('Obteniendo estadísticas finales...');
    const statsRes = await fetch(`${API_URL}/api/sync/stats`);
    const stats = await statsRes.json();

    console.log('\n📊 ESTADÍSTICAS FINALES:');
    console.log(`   Total usuarios: ${stats.data.totalUsers}`);
    console.log(`   Profesionales: ${stats.data.professionals}`);
    console.log(`   Profesionales verificados: ${stats.data.verified}`);
    console.log(`   Profesionales pendientes: ${stats.data.pending}`);
    console.log(`   Clientes: ${stats.data.clients}`);
    console.log(`   Bloqueados: ${stats.data.blocked}`);

    console.log(`\n${colors.green}=== TEST COMPLETADO EXITOSAMENTE ===${colors.reset}\n`);
  } catch (error) {
    log.error(`Test fallido: ${error.message}`);
    console.log('\n🔍 Debugging:');
    console.log('   1. ¿Está corriendo el sync-server.js?');
    console.log('   2. ¿La IP 192.168.1.105:5555 es correcta?');
    console.log('   3. ¿Hay profesionales pendientes en la BD?');
    console.log('\n   Ejecuta: curl http://192.168.1.105:5555/health\n');
  }
}

testValidationFlow();
