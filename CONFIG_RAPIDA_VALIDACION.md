# ⚙️ Configuración Rápida - Validación de Profesionales

## 🚀 Inicio Rápido

### 1. Verificar IP del Servidor

**En tu máquina (donde corre sync-server.js):**
```bash
ipconfig (Windows)
# Busca: IPv4 Address = 192.168.X.X
```

**Nota la IP, ejemplo:** `192.168.1.105`

---

### 2. Actualizar IPs en las Apps (Si es diferente)

#### En MANOSPY2:
**Archivo:** `src/context/AuthContext.js`
```javascript
// Línea ~145
const serverResponse = await fetch('http://192.168.1.105:5555/api/sync/users');
                               ↑
                        REEMPLAZAR CON TU IP
```

#### En Admin-App:
**Archivo:** `admin-app/src/screens/AdminProfessionalValidation.js`
```javascript
// Línea ~150
const response = await fetch('http://192.168.1.105:5555/api/sync/user',
                                      ↑
                               REEMPLAZAR CON TU IP
```

---

### 3. Ejecutar Servidor de Sincronización

```bash
cd c:\Users\ACER2025\Documents\MANOSPY2
node sync-server.js
```

**Esperado:**
```
╔════════════════════════════════════════╗
║  🚀 Servidor de Sincronización Activo  ║
╚════════════════════════════════════════╝

📍 Puerto: http://0.0.0.0:5555
📍 Acceso local: http://192.168.1.X:5555

✅ Endpoints disponibles:
   • GET  http://192.168.1.X:5555/api/sync/users
   • POST http://192.168.1.X:5555/api/sync/users
   • POST http://192.168.1.X:5555/api/sync/user
   • GET  http://192.168.1.X:5555/api/sync/stats
   • GET  http://192.168.1.X:5555/health
```

---

### 4. Ejecutar Admin-App

```bash
cd admin-app
npm start
```

---

### 5. Ejecutar MANOSPY2

```bash
# En otra terminal
npm start
```

---

## ✅ Flujo de Prueba Rápida (5 min)

### Paso 1: Registrar Profesional (2 min)
```
MANOSPY2:
1. Click "Seleccionar Rol"
2. Click "Profesional"
3. Email: test@pro.com
4. Nombre: Test Pro
5. Teléfono: 595991234567
6. Especialidad: Prueba
7. Ciudad: Asunción
8. Contraseña: test123
9. Click "Registrarse"
✅ Profesional registrado (verified: false)
```

### Paso 2: Admin Valida (1 min)
```
ADMIN-APP:
1. Click "Validación de Profesionales"
2. Buscar "Test Pro" en "Pendientes"
3. Click "✓ VALIDAR"
4. Confirmar en alerta
✅ Profesional validado (verified: true)
✅ Se mueve a "Profesionales Verificados"
```

### Paso 3: Profesional Login (2 min)
```
MANOSPY2:
1. Click "Ir a Login"
2. Email: test@pro.com
3. Contraseña: test123
4. Click "Login"
✅ LOGIN EXITOSO
✅ Se navega a pantalla de profesional
```

---

## 🔍 Verificación Rápida

### Ver estado del servidor
```bash
curl http://192.168.1.105:5555/health
```

**Esperado:**
```json
{
  "ok": true,
  "message": "Servidor de sincronización activo",
  "users": 5,
  "timestamp": "2026-01-13T10:30:00Z"
}
```

### Ver estadísticas
```bash
curl http://192.168.1.105:5555/api/sync/stats
```

**Esperado:**
```json
{
  "ok": true,
  "data": {
    "totalUsers": 5,
    "clients": 2,
    "professionals": 2,
    "verified": 1,
    "pending": 1,
    "blocked": 0
  }
}
```

---

## 🐛 Troubleshooting

### Error: "No se puede conectar al servidor"
```
❌ curl http://192.168.1.105:5555/health
   Error: Connection refused

✅ Solución:
1. Verificar que sync-server.js está corriendo
2. Verificar IP correcta (ipconfig)
3. Verificar firewall permite puerto 5555
4. Reiniciar servidor: Ctrl+C y node sync-server.js
```

### Error: "Usuario no encontrado en login"
```
❌ Email: test@pro.com
   Contraseña: test123
   Error: "Usuario no encontrado"

✅ Solución:
1. Registrar primero en MANOSPY2
2. Verificar email exacto (mayúsculas)
3. Ver si está en: http://192.168.1.105:5555/api/sync/users
```

### Error: "Tu cuenta está pendiente de verificación"
```
❌ Login rechazado
   Error: "Tu cuenta está pendiente de verificación"

✅ Solución:
1. Admin DEBE validar primero en Admin-App
2. Verificar que verified === true
3. Verificar: http://192.168.1.105:5555/api/sync/stats
4. Debe mostrar "verified": 1
```

### Error: "La sincronización falla"
```
❌ En Admin-App al validar:
   "Error al sincronizar con servidor"

✅ Solución:
1. Verificar servidor está corriendo
2. Verificar IP en AdminProfessionalValidation.js
3. Verificar puerto 5555 está abierto
4. Revisar console log del servidor
```

---

## 📝 Checklist Pre-Prueba

- [ ] Servidor de sincronización corriendo
- [ ] IP correcta en AdminProfessionalValidation.js
- [ ] IP correcta en AuthContext.js
- [ ] Admin-App compilando sin errores
- [ ] MANOSPY2 compilando sin errores
- [ ] Conexión de red entre dispositivos
- [ ] Acceso al puerto 5555

---

## 🔑 IPs Comunes por Dispositivo

### Si MANOSPY2 corre en emulador Android Studio
```
192.168.1.105:5555  ← IP de tu máquina (donde corre sync-server)
```

### Si MANOSPY2 corre en celular físico
```
192.168.1.105:5555  ← IP de tu máquina en la red WiFi
```

### Verificar tu IP
```bash
Windows:    ipconfig
Linux/Mac:  ifconfig

Buscar línea similar a:
IPv4 Address . . . . . . . . . . : 192.168.1.105
                                   ↑
                            USAR ESTA IP
```

---

## 📊 Logs Esperados

### Servidor (Terminal donde corre sync-server.js)
```
✓ Usuario registrado de MANOSPY2
✓ Admin valida profesional
✓ POST /api/sync/user - Usuario actualizado
✓ POST /api/sync/users - Base de datos sincronizada
```

### Admin-App (Console)
```
✅ Usuario actualizado en AsyncStorage local
📤 Enviando validación al servidor...
✅ Profesional validado en servidor
✅ Base de datos sincronizada en servidor
```

### MANOSPY2 (Console)
```
[Sync] ✅ BD sincronizada del servidor: 5 usuarios
✓ Usuario encontrado
✅ Login exitoso
```

---

## 🎯 Comandos Útiles

### Restart servidor
```bash
# Ctrl+C en la terminal del servidor
node sync-server.js
```

### Ver usuarios en BD
```bash
curl http://192.168.1.105:5555/api/sync/users | json_pp
# (En Windows, instalar: npm install -g json)
```

### Limpiar BD del servidor
```bash
curl -X DELETE http://192.168.1.105:5555/api/sync/users
```

### Ver un usuario específico
```bash
# Modificar el script test-validation-flow.js o:
curl "http://192.168.1.105:5555/api/sync/users" | grep -i "test@pro"
```

---

## ✨ Tips Pro

1. **Mantén console abierto** en Admin-App para ver logs de sincronización
2. **Usa el script test** para validaciones rápidas:
   ```bash
   node test-validation-flow.js
   ```
3. **Verificar IP antes** de comenzar pruebas
4. **Offline primero** - Probar sin conexión después
5. **Limpia BD** si hay datos viejos:
   ```bash
   curl -X DELETE http://192.168.1.105:5555/api/sync/users
   ```

---

**Configuración:** Lista para usar
**Próximo paso:** Ejecutar flujo de prueba

