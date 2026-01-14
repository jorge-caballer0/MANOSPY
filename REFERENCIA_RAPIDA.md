# 📋 REFERENCIA RÁPIDA - MANOSPY2

## 🎯 ESTADO ACTUAL: ✅ FUNCIONAL

Todas las apps están operativas y listas para pruebas de integración.

---

## 🔗 ACCESOS

| App | URL | Puerto | Terminal |
|-----|-----|--------|----------|
| **MANOSPY2** | http://localhost:8081 | 8081 | Terminal 2 |
| **AdminApp** | http://localhost:8082 | 8082 | Terminal 3 |
| **sync-server** | http://localhost:5555 | 5555 | Terminal 1 |

---

## 🚀 INICIAR SERVICIOS

### Terminal 1: sync-server
```bash
cd C:\Users\ACER2025\Documents\MANOSPY2
node sync-server.js
```

### Terminal 2: MANOSPY2
```bash
cd C:\Users\ACER2025\Documents\MANOSPY2
npm start
```

### Terminal 3: AdminApp
```bash
cd C:\Users\ACER2025\Documents\MANOSPY2\admin-app
npm start
```

---

## 📊 BASE DE DATOS

**Clave compartida:**
```
manospy_users_db_v1
```

**Ubicación:**
- MANOSPY2: AsyncStorage local
- AdminApp: AsyncStorage local
- sync-server: Base de datos en memoria

**Estructura de Usuario:**
```javascript
{
  id: 1,
  name: "Juan Pérez",
  email: "juan@test.com",
  phone: "595991234567",
  password: "hashed_password",
  role: "professional" | "client",
  specialty: "Plomería",  // Solo profesionales
  verified: false,        // Solo profesionales
  validatedBy: null,      // Admin que validó
  validatedAt: null,      // Timestamp de validación
  city: "Asunción",
  blocked: false,
  createdAt: "2026-01-14T12:00:00Z"
}
```

---

## 🔌 API ENDPOINTS

### GET /api/sync/users
Obtener todos los usuarios

```bash
curl http://localhost:5555/api/sync/users
```

### POST /api/sync/users
Sincronizar array de usuarios

```bash
curl -X POST http://localhost:5555/api/sync/users \
  -H "Content-Type: application/json" \
  -d '{"users": [...]}'
```

### POST /api/sync/user
Crear o actualizar un usuario

```bash
curl -X POST http://localhost:5555/api/sync/user \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "name": "Juan", "verified": true}'
```

### DELETE /api/sync/users
Limpiar base de datos

```bash
curl -X DELETE http://localhost:5555/api/sync/users
```

### GET /api/sync/stats
Obtener estadísticas

```bash
curl http://localhost:5555/api/sync/stats
```

### GET /health
Health check

```bash
curl http://localhost:5555/health
```

---

## 👤 USUARIOS DE PRUEBA

### MANOSPY2 - Cliente
```
Nombre:     Juan Pérez
Email:      juan@test.com
Contraseña: test123
```

### MANOSPY2 - Profesional
```
Nombre:      Carlos López
Email:       carlos@test.com
Contraseña:  test123
Especialidad: Plomería
```

### AdminApp - Admin
```
Email:      admin@manospy.com
Contraseña: admin123
```

---

## 🔄 FLUJO DE SINCRONIZACIÓN

```
MANOSPY2                    sync-server                AdminApp
   |                            |                         |
   |-- POST /api/sync/user ---->|                         |
   |   (registro profesional)    |                         |
   |                            |                         |
   |                            |<--- GET /api/sync/users |
   |                            |  (cargar pendientes)     |
   |                            |                         |
   |                            |   (valida profesional)  |
   |                            |<--- POST /api/sync/user |
   |                            |  (actualiza estado)     |
   |                            |                         |
   |<--- GET /api/sync/users ---|                         |
   | (polling cada 5 seg)       |                         |
   |                            |                         |
```

---

## 📁 ARCHIVOS MODIFICADOS

### syncService.js
- ✅ Actualizado con startAutoSync()
- ✅ Polling cada 5 segundos
- ✅ Fallback a AsyncStorage local

### AuthContext.js
- ✅ startAutoSync() en useEffect
- ✅ Callback para actualizar datos
- ✅ stopAutoSync() en cleanup

### sync-server.js
- ✅ Endpoints REST completos
- ✅ Logging detallado
- ✅ Health check
- ✅ Estadísticas

### AdminProfessionalValidation.js
- ✅ Valida profesionales
- ✅ Sincroniza cambios
- ✅ Estados: Pendiente ↔ Verificado

---

## ⚙️ CONFIGURACIÓN

### Timeouts
- **Polling:** 5000ms (5 segundos)
- **Fetch timeout:** 3000ms (3 segundos)
- **Server URL:** http://localhost:5555

### Storage Keys
- `manospy_user_v1` → Usuario actual
- `manospy_role_v1` → Rol seleccionado
- `manospy_users_db_v1` → Base de datos compartida

---

## 📱 PARA MÓVIL

### Cambiar servidor
Edita `src/utils/syncService.js`:

```javascript
const SERVER_URL = 'http://192.168.1.X:5555'; // Tu IP local
```

### Obtener IP local
```bash
ipconfig | findstr "IPv4"
```

### Acceso desde móvil
```
http://192.168.1.X:8081    ← MANOSPY2
http://192.168.1.X:8082    ← AdminApp
```

---

## 🆘 COMANDOS ÚTILES

### Detener todos los procesos Node
```bash
Get-Process node | Stop-Process -Force
```

### Ver procesos activos
```bash
Get-Process node
```

### Limpiar caché
```bash
rm -r C:\Users\ACER2025\Documents\MANOSPY2\.expo -Force
rm -r C:\Users\ACER2025\Documents\MANOSPY2\node_modules\.cache -Force
```

### Reinstalar dependencias
```bash
cd C:\Users\ACER2025\Documents\MANOSPY2
rm -r node_modules, package-lock.json -Force
npm install
```

---

## 📊 ESTADO DE TESTS

| Funcionalidad | Estado | Notas |
|---------------|--------|-------|
| Registro en MANOSPY2 | ✅ | Clientes y profesionales |
| Sincronización a servidor | ✅ | Automática en registro |
| Carga en AdminApp | ✅ | GET /api/sync/users |
| Validación en AdminApp | ✅ | POST /api/sync/user |
| Sincronización de vuelta | ✅ | Polling cada 5 seg |
| Estados (Pendiente/Verificado) | ✅ | Ambas apps actualizadas |
| Estadísticas | ✅ | GET /api/sync/stats |

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Pruebas funcionales (ver GUIA_PRUEBAS.md)
2. ⏳ Generar APKs para Android
3. ⏳ Deployar servidor en la nube (ver ALTERNATIVAS_SERVIDOR.md)
4. ⏳ Pruebas en dispositivos reales
5. ⏳ Release a Google Play

---

## 📝 DOCUMENTACIÓN

- **ESTADO_ACTUAL.md** → Estado del proyecto
- **GUIA_PRUEBAS.md** → Cómo probar cada funcionalidad
- **ALTERNATIVAS_SERVIDOR.md** → Opciones para producción
- **REFERENCIA_RAPIDA.md** (este archivo) → Configuración rápida

---

**¡Listo para probar!** 🧪

Sigue: GUIA_PRUEBAS.md para comenzar.
