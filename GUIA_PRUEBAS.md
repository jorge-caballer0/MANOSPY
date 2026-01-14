# 🧪 GUÍA DE PRUEBAS - MANOSPY2

## ✅ PRE-REQUISITOS

Asegúrate de que todos los servicios estén corriendo:

### ✓ Verificar sync-server
```bash
# Terminal 1
cd C:\Users\ACER2025\Documents\MANOSPY2
node sync-server.js
```
Deberías ver:
```
🚀 SERVIDOR DE SINCRONIZACIÓN MANOSPY ACTIVO
✅ Usuarios en base de datos: 4
```

### ✓ Verificar MANOSPY2
```bash
# Terminal 2
cd C:\Users\ACER2025\Documents\MANOSPY2
npm start
```
Deberías ver:
```
› Web is waiting on http://localhost:8081
```

### ✓ Verificar AdminApp
```bash
# Terminal 3
cd C:\Users\ACER2025\Documents\MANOSPY2\admin-app
npm start
```
Deberías ver:
```
› Web is waiting on http://localhost:8082
```

---

## 🎮 PRUEBA 1: REGISTRAR PROFESIONAL

### Paso 1: Abrir MANOSPY2
- Ve a **http://localhost:8081**
- Deberías ver pantalla con "Cliente" y "Profesional"

### Paso 2: Seleccionar rol "Profesional"
- Click en botón **"Profesional"**

### Paso 3: Llenar formulario de registro
```
Nombre:        Juan Carpintero
Email:         juan.carpintero@test.com
Teléfono:      595991234567
Especialidad:  Carpintería
Ciudad:        Asunción
Contraseña:    Test123!
```

### Paso 4: Presionar "Registrarse"
- Deberías ver: **"✅ Registrado exitosamente"**
- El usuario se guardará en AsyncStorage
- Se enviará a sync-server

### ✅ Verificación
- Abre **Developer Console** (F12 > Console)
- Busca logs:
  ```
  ✅ Usuario guardado localmente
  🌐 Usuario sincronizado con servidor
  ```

---

## 🎮 PRUEBA 2: VER EN ADMINAPP

### Paso 1: Abrir AdminApp
- Ve a **http://localhost:8082**
- Login como admin (email: admin@manospy.com, password: admin123)

### Paso 2: Ir a "Validación de Profesionales"
- Navega al menú → **"Profesionales"** → **"Validación"**

### Paso 3: Buscar el profesional registrado
- Deberías ver: **"Juan Carpintero"** en la lista
- Estado: **"⏳ Pendiente"**

### ✅ Verificación
- Si no aparece, presiona **"Actualizar"**
- Revisa que el servidor esté sincronizando:
  ```
  Terminal sync-server debería mostrar:
  📥 GET /api/sync/users - Enviando X usuarios
  ```

---

## 🎮 PRUEBA 3: VALIDAR PROFESIONAL EN ADMINAPP

### Paso 1: Click en botón "✓ Validar"
- Presiona el botón verde junto a "Juan Carpintero"

### Paso 2: Confirmar validación
- Deberías ver popup: **"¿Deseas validar a Juan Carpintero?"**
- Click **"OK"**

### Paso 3: Profesional validado
- La tarjeta del profesional debería moverse a la sección **"✅ Verificados"**
- Estado ahora: **"✅ VERIFICADO"**

### ✅ Verificación
- Console debería mostrar:
  ```
  ✏️  Usuario actualizado: Juan Carpintero
     Estado: ✅ VERIFICADO
  ```

---

## 🎮 PRUEBA 4: VER CAMBIO EN MANOSPY2

### Paso 1: Volver a MANOSPY2
- Ve a **http://localhost:8081**

### Paso 2: Esperar sincronización
- MANOSPY2 hace polling cada 5 segundos
- En ~5 segundos debería actualizar automáticamente

### Paso 3: Ver profesional validado
- El profesional "Juan Carpintero" debería mostrar:
  ```
  ✅ VERIFICADO
  ```
- En lugar de "⏳ PENDIENTE"

### ✅ Verificación
- Console de MANOSPY2 debería mostrar:
  ```
  🔄 Cambios detectados, actualizando...
  📥 Datos sincronizados del servidor: X usuarios
  ```

---

## 📊 VERIFICAR ESTADÍSTICAS

### En sync-server (Terminal 1)
```
GET http://localhost:5555/api/sync/stats
```

Deberías ver:
```json
{
  "totalUsers": 5,
  "clients": 2,
  "professionals": 3,
  "verified": 2,
  "pending": 1,
  "blocked": 0
}
```

---

## 🔍 DEBUGGING

### Si no ves el profesional en AdminApp:

**Opción 1: Forzar actualización**
- Presiona **"F5"** en AdminApp
- O click en botón **"Actualizar"** (si existe)

**Opción 2: Verificar servidor manualmente**
```bash
# En PowerShell
curl http://localhost:5555/api/sync/users
```
Debería mostrar todos los usuarios

**Opción 3: Limpiar AsyncStorage**
- Developer Console en AdminApp (F12)
- Ejecuta:
  ```javascript
  localStorage.clear()
  sessionStorage.clear()
  // Recarga F5
  ```

### Si no sincroniza a MANOSPY2:

**Verificar que startAutoSync esté corriendo:**
- Console de MANOSPY2 (F12 > Console)
- Busca: `🔄 Iniciando sincronización automática`
- Si no aparece, sync no está activo

**Verificar timeout del polling:**
- Espera al menos 10 segundos
- O recarga la página (F5) para iniciar de nuevo

**Verificar conexión al servidor:**
```javascript
// En console de MANOSPY2
fetch('http://localhost:5555/health')
  .then(r => r.json())
  .then(d => console.log('✅ Servidor disponible:', d))
  .catch(e => console.log('❌ Error:', e))
```

---

## 📱 PRUEBA EN RED LOCAL (OPCIONAL)

Si quieres probar en otro dispositivo de la red:

### Paso 1: Obtén tu IP local
```bash
ipconfig | findstr "IPv4"
# Busca algo como: 192.168.1.135
```

### Paso 2: Actualiza syncService.js
```javascript
// En src/utils/syncService.js
const SERVER_URL = 'http://192.168.1.135:5555'; // Tu IP real
```

### Paso 3: Abre desde otro dispositivo
```
http://192.168.1.135:8081    ← MANOSPY2
http://192.168.1.135:8082    ← AdminApp
```

### ✅ Verificación
- Los datos deben sincronizar entre dispositivos
- Sin necesidad de Internet (solo red local)

---

## 🎯 RESUMEN DE PRUEBAS

| # | Prueba | Estado | Resultado |
|---|--------|--------|-----------|
| 1 | Registrar profesional | [ ] | Se guarda en MANOSPY2 |
| 2 | Ver en AdminApp | [ ] | Aparece como "Pendiente" |
| 3 | Validar en AdminApp | [ ] | Se marca como "Verificado" |
| 4 | Ver en MANOSPY2 | [ ] | Se actualiza automáticamente |
| 5 | Estadísticas | [ ] | Los números son correctos |
| 6 | Red local | [ ] | Sincroniza entre dispositivos |

---

## 🚀 SIGUIENTE FASE

Una vez que TODAS las pruebas pasen:

1. **Documentar flujos** adicionales
2. **Generar APKs** para Android
3. **Deployar servidor** a la nube
4. **Preparar release**

---

**¿Listo? ¡Empieza con la Prueba 1!** 🧪

Cuéntame cuando pases cada prueba:
- ✅ Paso
- ❌ Error (y qué dice la console)
