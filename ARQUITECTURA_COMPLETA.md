# 🏗️ ARQUITECTURA COMPLETA DE SINCRONIZACIÓN

## DIAGRAMA DEL SISTEMA:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SISTEMA MANOSPY COMPLETO                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   MANOSPY2 (Main)    │         │  admin-app (Web)     │
│  React Native App    │         │   Vite React         │
│   Port: 8081         │         │   Port: 8083         │
├──────────────────────┤         ├──────────────────────┤
│ • AuthContext.js     │         │ • ProfessionalVal..  │
│ • AsyncStorage       │         │ • localStorage       │
│ • syncService.js     │         │ • dataService.js     │
│                      │         │                      │
│ SYNC: ↓ POST ↓       │         │ SYNC: ↓ GET (3s) ↓   │
└──────────────────────┘         └──────────────────────┘
         │ (register)                     │ (load data)
         │                                │
         └────────────────────┬───────────┘
                              │
                              ↓
                    ┌──────────────────────┐
                    │  sync-server.js      │
                    │   Express.js         │
                    │   Port: 5555         │
                    ├──────────────────────┤
                    │ • sharedDatabase[]   │
                    │ • POST /api/sync/..  │
                    │ • GET  /api/sync/..  │
                    │                      │
                    │ FUENTE DE VERDAD ✓   │
                    └──────────────────────┘

```

---

## FLUJOS DE DATOS:

### 1️⃣ REGISTRO (MANOSPY2 → Server)

```
Usuario abre MANOSPY2
    ↓
Va a Registro
    ↓
Completa formulario (nombre, email, password, role, specialty)
    ↓
Presiona "Registrarse"
    ↓
[AuthContext] register()
    ├─ Crea usuario local: 
    │  {id, email, password, role, verified: false, ...}
    │
    ├─ Guarda en AsyncStorage: 'manospy_users_db_v1'
    │
    └─ Llama syncNewUser(usuario)
       │
       └─ POST http://192.168.1.105:5555/api/sync/user
          │
          └─ Server recibe, guarda en memoria
             └─ console.log: "✅ Usuario creado: email"
```

### 2️⃣ ADMIN VALIDA (admin-app → Server)

```
Admin abre admin-app (http://localhost:8083)
    ↓
Va a Validación
    ↓
Ve profesional pendiente (verified: false)
    ↓
Presiona "✓ Validar"
    ↓
[ProfessionalValidation.jsx] handleValidate()
    ├─ Actualiza AsyncStorage: {verified: true}
    │
    ├─ Llama syncToServer(usuario actualizado)
    │  │
    │  └─ POST http://localhost:5555/api/sync/user
    │     │
    │     └─ Server busca por ID/email
    │        └─ Actualiza: verified = true
    │           └─ console.log: "✅ Usuario validado"
    │
    └─ Recarga UI: setInterval muestra en "Verificados"
```

### 3️⃣ PROFESIONAL HACE LOGIN (MANOSPY2 ← Server) ← **ESTE ES EL FIX**

```
Profesional abre MANOSPY2
    ↓
Va a Login
    ↓
Ingresa email y password
    ↓
Presiona "Iniciar Sesión"
    ↓
[AuthContext] login(email, password)
    │
    ├─ ⭐ NUEVO: Conecta a servidor
    │  │
    │  ├─ GET http://192.168.1.105:5555/api/sync/users
    │  │  │
    │  │  └─ Server responde con todas los usuarios
    │  │     {data: [{id, email, password, role, verified: true, ...}, ...]}
    │  │
    │  ├─ Obtiene BD actualizada del servidor
    │  │
    │  └─ Guarda en AsyncStorage: 'manospy_users_db_v1'
    │
    ├─ Busca usuario en BD sincronizada
    │  │
    │  └─ Encuentra: {email, verified: true} ← Ahora tiene verified: true del servidor
    │
    ├─ Valida password
    │  │
    │  ├─ ✓ Password correcto
    │  │  └─ Valida verified === true
    │  │     └─ ✓ ES true
    │  │
    │  └─ LOGIN EXITOSO ✅
    │     └─ setUser(foundUser)
    │        └─ Navega a Home Screen
    │
    └─ FALLBACK: Si servidor offline
       │
       └─ Usa BD local (AsyncStorage)
          └─ Funciona pero puede estar desactualizada
```

---

## CAMBIOS EN ESTA SESIÓN:

### Archivo: AuthContext.js
**Función:** `login()`  
**Cambio:** Agregar sincronización con servidor ANTES de validar

```javascript
// PASO 1: Conectar a servidor
const response = await fetch('http://192.168.1.105:5555/api/sync/users');

// PASO 2: Obtener datos del servidor
const serverData = await response.json();
let latestDb = serverData.data;

// PASO 3: Guardar localmente para fallback
await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(latestDb));

// PASO 4: Usar BD sincronizada para búsqueda
const foundUser = latestDb.find(u => u.email === email);

// PASO 5: Validar verified field (que ahora está actualizado)
if (foundUser.verified === false) { 
  // Esto ahora refleja el estado actual del servidor
  return error; 
}
```

---

## ENDPOINTS DEL SERVIDOR:

| Método | Endpoint | Función | Datos Retornados |
|--------|----------|---------|------------------|
| POST | /api/sync/user | Registrar/actualizar usuario | {ok: true, user: {...}} |
| GET | /api/sync/users | **[NUEVO EN LOGIN]** Obtener todos | {data: [{...}, {...}]} |
| POST | /api/sync/users | Sincronización en lote | {ok: true, count: N} |
| GET | /health | Verificar servidor | {status: 'ok'} |

---

## FLUJO ANTES vs DESPUÉS:

### ❌ ANTES (Problema):
```
Login → Lee BD local (AsyncStorage)
     → Busca usuario
     → Verifica: verified = false (desactualizado)
     → ERROR: "Pendiente de verificación"
```

### ✅ DESPUÉS (Solución):
```
Login → Conecta a servidor
     → Obtiene BD actualizada
     → Guarda en AsyncStorage
     → Busca usuario
     → Verifica: verified = true (actualizado)
     → ✅ LOGIN EXITOSO
```

---

## DATOS EN CADA PUNTO:

### En sync-server (Memoria):
```javascript
[
  {
    id: '123abc',
    email: 'juan@mail.com',
    name: 'Juan Pérez',
    role: 'client',
    verified: true,
    blocked: false,
    ...
  },
  {
    id: '456def',
    email: 'profesional@mail.com',
    name: 'Carlos López',
    role: 'professional',
    specialty: 'Plomería',
    verified: true,  // ← Admin lo validó
    blocked: false,
    ...
  }
]
```

### En MANOSPY2 (AsyncStorage):
```javascript
// Antes de login: podría estar desactualizado
'manospy_users_db_v1' = [... datos locales ...]

// Después de syncronización en login:
'manospy_users_db_v1' = [... datos del servidor ...] ✅
```

### En admin-app (localStorage):
```javascript
// Se actualiza cada 3 segundos automáticamente
'manospy_users_db_v1' = [... datos del servidor ...]
```

---

## GARANTÍAS:

1. ✅ **Servidor es fuente de verdad**
   - Todos los cambios van al servidor primero
   - Los apps leen del servidor

2. ✅ **Fallback offline**
   - Si servidor offline, usar BD local
   - Login sigue funcionando (aunque podría estar desactualizado)

3. ✅ **Sincronización automática**
   - admin-app: cada 3 segundos (setInterval)
   - MANOSPY2: en cada login (nuevo)

4. ✅ **Datos consistentes**
   - Misma estructura en todos lados
   - Mismo storage key: 'manospy_users_db_v1'

---

## PRÓXIMOS PASOS OPCIONALES:

1. Cambiar BD servidor de memoria a base de datos real
2. Usar WebSockets en lugar de polling
3. Implementar JWT para autenticación más segura
4. Agregar encryption de passwords
5. Sincronización bidireccional en tiempo real

