/**
 * ═══════════════════════════════════════════════════════════════════
 * SERVIDOR DE SINCRONIZACIÓN CENTRAL - MANOSPY2
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Propósito: Base de datos centralizada compartida entre:
 *   - MANOSPY2 (App Principal para clientes/profesionales)
 *   - AdminApp (App de administración)
 * 
 * Características:
 *   ✅ Base de datos compartida en tiempo real
 *   ✅ Validación de profesionales
 *   ✅ Gestión de usuarios (crear, actualizar, eliminar)
 *   ✅ Sincronización automática entre apps
 *   ✅ Estadísticas y reportes
 * 
 * Puertos: 5555 (desarrollo)
 * Ejecución: node sync-server.js
 * ═══════════════════════════════════════════════════════════════════
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5555;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ═══ GESTIÓN DE BASE DE DATOS EN MEMORIA ═══
let sharedDatabase = [
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
    verified: false,
    validatedBy: null,
    validatedAt: null,
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
    verified: true,
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

/**
 * GET /api/sync/users
 * Obtener todos los usuarios (para admin-app)
 */
app.get('/api/sync/users', (req, res) => {
  console.log(`📥 GET /api/sync/users - Enviando ${sharedDatabase.length} usuarios`);
  res.json({
    ok: true,
    data: sharedDatabase,
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/sync/users
 * Recibir usuarios desde MANOSPY2
 */
app.post('/api/sync/users', (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({
        ok: false,
        error: 'users debe ser un array',
      });
    }

    // Sincronizar: usa los datos recibidos como fuente de verdad
    sharedDatabase = users;

    console.log(`📤 POST /api/sync/users - Recibidos ${users.length} usuarios desde MANOSPY2`);
    console.log('Usuarios actualizados:', users.map(u => `${u.name} (${u.email})`).join(', '));

    res.json({
      ok: true,
      message: `${users.length} usuarios sincronizados correctamente`,
      count: users.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en POST /api/sync/users:', error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/sync/user
 * Agregar o actualizar un usuario (desde MANOSPY2 o admin-app)
 */
app.post('/api/sync/user', (req, res) => {
  try {
    const user = req.body;

    // Validar usuario
    if (!user.email && !user.id) {
      return res.status(400).json({
        ok: false,
        error: 'Usuario debe tener email o id',
      });
    }

    // Buscar si existe por ID o por email
    const existingIndex = sharedDatabase.findIndex(
      u => (user.id && u.id === user.id) || (user.email && u.email === user.email)
    );

    if (existingIndex >= 0) {
      // Actualizar
      sharedDatabase[existingIndex] = { ...sharedDatabase[existingIndex], ...user };
      console.log(`✏️  Usuario actualizado: ${user.name || user.email} (ID: ${user.id || 'N/A'})`);
      
      // Si es profesional, mostrar verificación
      if (sharedDatabase[existingIndex].role === 'professional') {
        const verified = sharedDatabase[existingIndex].verified;
        console.log(`   Estado: ${verified ? '✅ VERIFICADO' : '⏳ PENDIENTE'}`);
      }
    } else {
      // Crear
      if (!user.id) {
        user.id = sharedDatabase.length > 0 ? Math.max(...sharedDatabase.map(u => u.id)) + 1 : 1;
      }
      sharedDatabase.push(user);
      console.log(`✅ Usuario creado: ${user.name || user.email} (ID: ${user.id})`);
    }

    res.json({
      ok: true,
      message: existingIndex >= 0 ? 'Usuario actualizado' : 'Usuario creado',
      user: sharedDatabase[existingIndex >= 0 ? existingIndex : sharedDatabase.length - 1],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en POST /api/sync/user:', error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/sync/users
 * Limpiar todos los usuarios
 */
app.delete('/api/sync/users', (req, res) => {
  sharedDatabase = [];
  console.log('🗑️  Base de datos limpiada');
  res.json({
    ok: true,
    message: 'Base de datos limpiada',
  });
});

/**
 * GET /api/sync/stats
 * Obtener estadísticas
 */
app.get('/api/sync/stats', (req, res) => {
  const stats = {
    totalUsers: sharedDatabase.length,
    clients: sharedDatabase.filter(u => u.role === 'client').length,
    professionals: sharedDatabase.filter(u => u.role === 'professional').length,
    verified: sharedDatabase.filter(u => u.verified === true).length,
    pending: sharedDatabase.filter(u => u.verified === false && u.role === 'professional').length,
    blocked: sharedDatabase.filter(u => u.blocked).length,
  };

  console.log(`📊 Estadísticas:`, stats);
  res.json({
    ok: true,
    data: stats,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Servidor de sincronización activo',
    users: sharedDatabase.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Ruta raíz
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Servidor de Sincronización MANOSPY',
    version: '1.0.0',
    endpoints: {
      'GET /api/sync/users': 'Obtener todos los usuarios',
      'POST /api/sync/users': 'Sincronizar array de usuarios',
      'POST /api/sync/user': 'Crear o actualizar un usuario',
      'DELETE /api/sync/users': 'Limpiar base de datos',
      'GET /api/sync/stats': 'Obtener estadísticas',
      'GET /health': 'Verificar que el servidor está activo',
    },
  });
});

// Iniciar servidor en 0.0.0.0 (accesible desde celulares y cualquier dispositivo)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║   🚀 SERVIDOR DE SINCRONIZACIÓN MANOSPY ACTIVO                ║
╚════════════════════════════════════════════════════════════════╝
  
  📱 Accesible desde:
    - Navegador: http://localhost:${PORT}
    - Red local: http://192.168.1.X:${PORT}
    - Móvil: http://<IP_TU_PC>:${PORT}
  
  ✅ Usuarios en base de datos: ${sharedDatabase.length}
  
  Endpoints disponibles:
    📥 GET    /api/sync/users        → Obtener todos los usuarios
    📤 POST   /api/sync/users        → Sincronizar usuarios
    ✏️  POST   /api/sync/user         → Crear/actualizar usuario
    🗑️  DELETE /api/sync/users        → Limpiar BD
    📊 GET    /api/sync/stats        → Estadísticas
    💚 GET    /health                → Health check
  
  🔗 Conectado a:
    - MANOSPY2: http://localhost:8081
    - AdminApp: http://localhost:8082
  
═══════════════════════════════════════════════════════════════════
`);
  
  console.log('⚠️  IMPORTANTE: Asegúrate de que ambas apps estén configuradas');
  console.log('   para usar http://localhost:5555 (o tu IP en red local)');
});
