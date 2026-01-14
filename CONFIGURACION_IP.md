# ⚙️ CONFIGURACIÓN DE IP Y PUERTO

## 🔴 IMPORTANTE: Verificar tu IP local

El servidor probablemente está en una IP diferente. Necesitas usar **TU IP local**, no `192.168.1.105`.

---

## 📍 PASO 1: ENCONTRAR TU IP LOCAL

### En Windows (PowerShell):
```powershell
ipconfig
```
Busca: `IPv4 Address: 192.168.X.X` o `10.0.X.X`

Ejemplo de salida:
```
Adaptador de Ethernet:
   Dirección IPv4. . . . . . . . . . : 192.168.1.50
   Máscara de subred : 255.255.255.0
```

### En Mac/Linux:
```bash
ifconfig
```
Busca `inet` (no `inet6`)

---

## 🔧 PASO 2: REEMPLAZAR LA IP EN AuthContext.js

### En la función `login()`:
```javascript
// CAMBIAR ESTO:
const response = await fetch('http://192.168.1.105:5555/api/sync/users');

// POR ESTO (usando TU IP):
const response = await fetch('http://192.168.1.50:5555/api/sync/users');
// ↑ Reemplaza 192.168.1.50 con TU IP local
```

### En AuthContext.js, también busca y reemplaza en:
- `syncService.js` (si tiene referencia a la IP)
- Cualquier otro `fetch()` que tenga `192.168.1.105`

---

## 🌐 ALTERNATIVA: Usar localhost

Si estás en la **MISMA máquina** para todo:

```javascript
// Para emulador/dispositivo EN LA MISMA MÁQUINA:
const response = await fetch('http://10.0.2.2:5555/api/sync/users');
// ↑ Android emulator usa 10.0.2.2 para localhost

// Para dispositivo físico O web:
const response = await fetch('http://192.168.X.X:5555/api/sync/users');
// ↑ Usa tu IP local
```

---

## 📝 TABLA DE IPs:

| Escenario | IP a Usar | Puerto |
|-----------|-----------|--------|
| Web (admin-app) en localhost | `http://localhost` | 5555 |
| Android emulator | `http://10.0.2.2` | 5555 |
| iOS simulator | `http://localhost` | 5555 |
| Dispositivo físico en misma red | `http://192.168.X.X` | 5555 |
| Otra computadora | `http://IP_DEL_SERVIDOR` | 5555 |

---

## ✅ CÓMO VERIFICAR QUE FUNCIONA:

### 1. Verificar servidor está corriendo:
```bash
# En terminal de sync-server:
curl http://192.168.1.X:5555/health
# Respuesta esperada: {"status":"ok"}

# O accede en navegador:
http://192.168.1.X:5555/api/sync/users
# Deberías ver JSON con usuarios
```

### 2. Verificar desde MANOSPY2:
- Abrir Metro bundler
- Ir a Login
- Ver console logs:
  ```
  [Auth] 📥 Leyendo BD desde servidor...
  [Auth] ✅ BD sincronizada desde servidor: X usuarios
  ```

---

## 🚨 ERRORES COMUNES:

### Error: "Network request failed"
**Causa**: IP incorrecta o puerto cerrado  
**Solución**:
- Verificar IP correcta con `ipconfig`
- Verificar sync-server está corriendo (`node sync-server.js`)
- Verificar puerto 5555 abierto

### Error: "localhost refused to connect"
**Causa**: Usando localhost en dispositivo físico  
**Solución**:
- Cambiar a IP local: `http://192.168.1.X:5555`

### Error: "CORS error"
**Causa**: Servidor no permite requests desde MANOSPY2  
**Solución**:
- Verificar sync-server.js tiene `cors()` habilitado
- No debería pasar si usas IP local

---

## 📋 CHECKLIST:

- [ ] Encontré mi IP local con `ipconfig`
- [ ] Mi IP es: `192.168.1.___` o `10.0.0.___`
- [ ] sync-server está corriendo en `http://MI_IP:5555`
- [ ] Verifiqué accediendo en navegador a `http://MI_IP:5555/api/sync/users`
- [ ] Vi JSON con usuarios en navegador ✅
- [ ] Actualicé AuthContext.js con MI IP
- [ ] MANOSPY2 reiniciado
- [ ] Test: Login → ver logs "[Auth] 📥 Leyendo BD desde servidor..."

---

## 🔑 IP CRÍTICA:

**Busca esta línea en AuthContext.js:**
```javascript
const response = await fetch('http://192.168.1.105:5555/api/sync/users');
                              ↑
                        CAMBIAR ESTO
```

**Reemplaza con:**
```javascript
const response = await fetch('http://192.168.1.50:5555/api/sync/users');
                              ↑
                        TU IP LOCAL
```

---

## 🧪 TEST RÁPIDO:

En PowerShell:
```powershell
# Ver tu IP:
ipconfig | Select-String "IPv4"

# Probar conexión a servidor (reemplaza TU_IP):
Invoke-WebRequest http://TU_IP:5555/health -UseBasicParsing
```

Si ves `"status":"ok"` → ¡El servidor está accesible!

