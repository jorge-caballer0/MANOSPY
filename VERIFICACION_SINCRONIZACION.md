## 🚀 VERIFICACIÓN DE SINCRONIZACIÓN - MANOSPY2 ↔ admin-app

### 📊 ESTADO ACTUAL

✅ **admin-app (React Native Expo)**
- Puerto: 8084
- AsyncStorage: `manospy_users_db_v1`
- Actualiza datos cada 3 segundos
- Validación automática de integridad
- Limpieza de duplicados

✅ **Cambios implementados:**
- Sincronización periódica iniciada
- Validación de datos automática
- Detección de nuevos registros en tiempo real

---

### ❌ PENDIENTE: MANOSPY2

Tu app principal MANOSPY2 debe verificar que esté usando **AsyncStorage** con la clave `manospy_users_db_v1` cuando guarda nuevos usuarios.

---

### 🔍 CÓMO VERIFICAR

#### Paso 1: Abrir admin-app en el navegador
```
http://localhost:8084
```

#### Paso 2: Verificar que ve usuarios
- Ve a la pestaña **"Usuarios"**
- Deberías ver una lista de usuarios

#### Paso 3: Verificar sincronización

**Opción A - Registra un usuario en MANOSPY2:**
1. Abre MANOSPY2
2. Registra un nuevo cliente con:
   - Email: `testclient@mail.com`
   - Nombre: `Test Client`
   - Teléfono: `595991234567`
   - Ciudad: `Asunción`
3. Espera 3 segundos
4. Regresa a admin-app y recarga (F5)
5. **El nuevo usuario debe aparecer en la lista**

**Opción B - Registra un profesional:**
1. En MANOSPY2, registra como profesional:
   - Email: `testpro@mail.com`
   - Nombre: `Test Professional`
   - Especialidad: `Plomería`
   - Verificado: `false` (pendiente)
2. En admin-app, ve a **"Validación"**
3. **Debe aparecer en "Solicitudes Pendientes"**

---

### 🎯 CHECKLIST - VERIFICAR EN MANOSPY2

Abre tu carpeta de MANOSPY2 y verifica estos archivos:

**Busca en tus pantallas de registro:**

```javascript
// Debe tener estos imports:
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cuando guarde un usuario:
const users = await AsyncStorage.getItem('manospy_users_db_v1');
const usersList = users ? JSON.parse(users) : [];
// ... agregar usuario ...
await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(usersList));
```

**Si ves `localStorage.getItem`** → ❌ INCORRECTO (eso es web)
**Si ves `AsyncStorage.getItem`** → ✅ CORRECTO

---

### ⚠️ SI NO VES LOS USUARIOS NUEVOS

**Causa más probable:** MANOSPY2 no está guardando en AsyncStorage

**Solución rápida:**
1. Abre el archivo de registro en MANOSPY2
2. Busca dónde guarda el usuario nuevo
3. Asegúrate que use:
   ```javascript
   await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(usersList));
   ```
4. Reinicia MANOSPY2
5. Registra un usuario nuevo
6. Deberá aparecer automáticamente en admin-app

---

### 📱 ACCESO A LA APP

**admin-app (Expo):**
- Web: http://localhost:8084
- Expo Go: Escanea el QR en el terminal

**QR visible en terminal:**
```
npm start (en C:\Users\ACER2025\Documents\MANOSPY2\admin-app)
```

---

### 🔧 DATOS DE PRUEBA

Si quieres limpiar todo y empezar de cero:

1. En admin-app, abre la consola (F12)
2. En el pestaña "Application" → "AsyncStorage"
3. Busca la clave: `manospy_users_db_v1`
4. Elimínala
5. Recarga la página - se crearán datos de prueba automáticamente

---

### 📞 RESUMEN RÁPIDO

| Sistema | Almacenamiento | Clave | Estado |
|---------|---|---|---|
| MANOSPY2 | AsyncStorage | `manospy_users_db_v1` | ⚠️ Verificar |
| admin-app | AsyncStorage | `manospy_users_db_v1` | ✅ Listo |
| MANOSPY_ADMIN (web viejo) | localStorage | `manospy_users_db_v1` | ✅ Independiente |

---

### 💡 PRÓXIMOS PASOS

Después de verificar la sincronización:
1. Prueba registrando más usuarios
2. Prueba la aprobación/rechazo de profesionales
3. Verifica que los cambios se reflejen en tiempo real

