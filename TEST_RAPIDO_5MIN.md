## ✅ TEST RÁPIDO DE SINCRONIZACIÓN

### 🚀 PASOS (5 MINUTOS)

#### 1. Reinicia MANOSPY2 (1 min)
```
Si está corriendo: presiona Ctrl+C en terminal
npm start
```

#### 2. Registra un usuario (2 min)
Escoge uno:

**OPCIÓN A - Cliente:**
- Pantalla de login cliente
- Clic en "Crear cuenta"
- Nombre: "Test Client"
- Email: "testclient123@mail.com"
- Teléfono: "595991234567"
- Contraseña: "test123"
- Clic en "Crear cuenta"

**OPCIÓN B - Profesional:**
- Pantalla de login profesional
- Clic en "Crear cuenta"
- Nombre: "Test Pro"
- Email: "testpro123@mail.com"
- Teléfono: "595991234567"
- Especialidad: "Plomería"
- Contraseña: "test123"
- Clic en "Crear cuenta"

#### 3. Abre admin-app (1 min)
```
http://localhost:8084
```

#### 4. Ve a "Usuarios" (1 min)
- Haz clic en la pestaña "Usuarios" (segunda pestaña)
- **Busca tu usuario nuevo en la lista**

---

### ✨ VERIFICACIÓN VISUAL

Si ves el usuario → **✅ SINCRONIZACIÓN FUNCIONANDO**

| Campo | Cliente | Profesional |
|-------|---------|------------|
| Nombre | Test Client | Test Pro |
| Email | testclient123@mail.com | testpro123@mail.com |
| Rol | 👤 Cliente | 🔧 Profesional |
| Estado | ✓ Activo | ⏳ Pendiente |

---

### 📊 DASHBOARD

También deberías ver actualizado:
- Total Usuarios: incrementado
- Clientes: +1
- Profesionales: +1 (si registraste profesional)
- Pendientes: +1 (si registraste profesional)

---

### 🔍 SI NO VES EL USUARIO

**Paso 1: Refrescar (F5)**
```
http://localhost:8084
F5
```
Espera 3 segundos, recarga nuevamente.

**Paso 2: Verificar qué está guardado**
En MANOSPY2, abre la consola y ejecuta:
```javascript
import { verUsuariosManospy2 } from './src/utils/syncDebug.js';
await verUsuariosManospy2();
```

Deberías ver una tabla con tu usuario.

**Paso 3: Verificar en admin-app**
En http://localhost:8084, abre F12 (Developer Tools)
Ve a "Application" → "Storage" → "AsyncStorage"
Busca la clave: `manospy_users_db_v1`
Deberías ver el usuario guardado

**Paso 4: Reiniciar admin-app**
En terminal donde corre admin-app (puerto 8084):
- Presiona "r" (reload)
- Espera a que recompile
- Debería sincronizar automáticamente

---

### ✅ ESCENARIOS DE ÉXITO

#### Escenario 1: Cliente registrado correctamente
```json
{
  "id": 1,
  "name": "Test Client",
  "email": "testclient123@mail.com",
  "phone": "595991234567",
  "password": "test123",
  "role": "client",
  "city": "",
  "blocked": false,
  "createdAt": "2026-01-13T15:30:00.000Z"
}
✓ NO tiene campo "verified"
✓ Aparece en admin-app → Usuarios
```

#### Escenario 2: Profesional registrado correctamente
```json
{
  "id": 2,
  "name": "Test Pro",
  "email": "testpro123@mail.com",
  "phone": "595991234567",
  "password": "test123",
  "role": "professional",
  "specialty": "Plomería",
  "city": "",
  "verified": false,
  "blocked": false,
  "createdAt": "2026-01-13T15:30:00.000Z"
}
✓ TIENE campo "verified": false
✓ Aparece en admin-app → Usuarios
✓ Aparece en admin-app → Validación → Solicitudes Pendientes
```

---

### 🎯 META

El usuario debe aparecer en la lista de admin-app dentro de 3-5 segundos de haber registrado en MANOSPY2.

**Si eso sucede → ✅ SINCRONIZACIÓN 100% FUNCIONAL**

---

### 📝 NOTAS

- Los datos se guardan en `AsyncStorage['manospy_users_db_v1']`
- Ambas apps leen de la misma clave
- admin-app actualiza cada 3 segundos automáticamente
- No es necesario refrescar manualmente
- Los datos persisten aunque cierres y abras apps

---

### 🎉 ¿LISTO?

1. Reinicia MANOSPY2
2. Registra un usuario
3. Abre admin-app
4. Ve a "Usuarios"
5. **¡Deberías verlo! ✓**

**Tiempo total: 5 minutos**
