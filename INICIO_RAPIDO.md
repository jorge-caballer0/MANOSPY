## ⚡ QUICK START - SINCRONIZACIÓN EN 5 MINUTOS

### 🎯 OBJETIVO
Hacer que los usuarios registrados en **MANOSPY2** aparezcan automáticamente en **admin-app**

---

## PASO 1: VERIFICAR MANOSPY2 (2 minutos)

Abre tu código de MANOSPY2 y busca dónde registra usuarios.

**Debe tener:**

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// ... cuando guarda un usuario:
const users = await AsyncStorage.getItem('manospy_users_db_v1');
const usersList = users ? JSON.parse(users) : [];
// ... agregar usuario ...
await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(usersList));
```

**Si ves esto ✓** → Vas bien
**Si ves `localStorage` ❌** → Necesitas cambiar a AsyncStorage

---

## PASO 2: REGISTRA UN USUARIO EN MANOSPY2 (1 minuto)

1. Abre MANOSPY2 en tu celular o emulador
2. Crea una cuenta nueva (puede ser cliente o profesional)
3. Usa email: `testuser@mail.com`
4. Completa los demás datos

---

## PASO 3: ABRE admin-app (1 minuto)

1. En tu navegador, ve a: **http://localhost:8084**
2. Espera a que cargue (si no aparece nada, refreshea F5)
3. Deberías ver el Dashboard con estadísticas

---

## PASO 4: VERIFICA LOS DATOS (1 minuto)

Opción A - Ir a "Usuarios":
1. Haz clic en la pestaña **"Usuarios"** (segunda pestaña)
2. **Deberías ver tu usuario nuevo en la lista**
3. Si es profesional → también aparecerá en "Validación"

Opción B - Ver en consola (más detalles):
1. Presiona **F12** (Abre Developer Tools)
2. Ve a la pestaña **"Console"**
3. Copia y pega:
   ```javascript
   const AsyncStorage = require('@react-native-async-storage/async-storage').default;
   (async () => {
     const data = await AsyncStorage.getItem('manospy_users_db_v1');
     console.table(JSON.parse(data));
   })();
   ```
4. Presiona Enter

---

## ✅ SI VES TU USUARIO → FUNCIONANDO ✓

**¡Sincronización completada!**

Los cambios que hagas en MANOSPY2 aparecerán automáticamente en admin-app cada 3 segundos.

---

## ❌ SI NO VES TU USUARIO → DEBUGGING

### Causa 1: MANOSPY2 no está guardando en AsyncStorage

**Solución:**
1. Abre el archivo de registro en MANOSPY2
2. Busca dónde guarda el usuario
3. Cambia cualquier `localStorage` por `AsyncStorage`
4. La clave debe ser: `'manospy_users_db_v1'`
5. Reinicia MANOSPY2
6. Intenta registrarte de nuevo

### Causa 2: Diferentes claves de almacenamiento

**Solución:**
- En MANOSPY2: debe ser `'manospy_users_db_v1'`
- En admin-app: también `'manospy_users_db_v1'`
- Deben ser **EXACTAMENTE IGUALES**

### Causa 3: admin-app no está actualizando

**Solución:**
1. Presiona F5 en admin-app para refrescar
2. Espera a que se recargue completamente
3. Los datos deberían sincronizarse automáticamente cada 3 segundos

---

## 🔍 VER EXACTAMENTE QUÉ HAY GUARDADO

En http://localhost:8084, abre la consola (F12) y ejecuta:

```javascript
// Ver todos los usuarios
async function verTodo() {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const data = await AsyncStorage.getItem('manospy_users_db_v1');
  console.log('📊 USUARIOS GUARDADOS:');
  console.table(JSON.parse(data || '[]'));
}
verTodo();
```

Deberías ver una tabla con:
- ID
- Nombre
- Email
- Rol (client / professional)
- Verificado (para profesionales)

---

## 🚨 RESUMEN RÁPIDO

| Elemento | Valor |
|----------|-------|
| **Clave AsyncStorage** | `manospy_users_db_v1` |
| **URL admin-app** | http://localhost:8084 |
| **Actualización** | Cada 3 segundos |
| **Puerto** | 8084 |

---

## 💡 PRÓXIMOS PASOS

Después de que funcione:

1. **Prueba con profesionales**
   - Registra un profesional en MANOSPY2
   - En admin-app → "Validación" → debe aparecer en "Solicitudes Pendientes"
   - Haz clic en "Validar" para aprobarlo

2. **Prueba bloqueos**
   - En admin-app → "Usuarios"
   - Busca un usuario y haz clic en el ícono de candado
   - En MANOSPY2 → intenta hacer login con ese usuario
   - Deberá mostrar "Cuenta bloqueada"

3. **Prueba búsqueda**
   - En admin-app → "Usuarios"
   - Busca por nombre, email o teléfono

---

## 📞 SI TIENES DUDAS

Revisa estos archivos:
- `RESUMEN_CAMBIOS_SINCRONIZACION.md` - Cambios técnicos realizados
- `CODIGO_MANOSPY2.md` - Código exacto para copiar en MANOSPY2
- `HERRAMIENTAS_DEBUG.js` - Funciones para ver datos
- `ARQUITECTURA_VISUAL.md` - Diagrama de cómo funciona todo

---

## ✨ ¡LISTO!

Tu sincronización de base de datos está configurada. 

**admin-app ya está escuchando por nuevos usuarios desde MANOSPY2.**

Solo asegúrate que MANOSPY2 use AsyncStorage con la clave correcta. 🚀

