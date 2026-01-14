# 🚀 INICIO RÁPIDO - Sistema de Validación de Profesionales

## ⚡ 3 Minutos para Empezar

### 1️⃣ Verifica la IP (30 segundos)

**En Windows:**
```bash
ipconfig
```
**Busca:**
```
IPv4 Address . . . . . . . . . . : 192.168.1.X
```
**Anota tu IP (ej: 192.168.1.105)**

---

### 2️⃣ Actualiza las IPs en el Código (1 minuto)

Si tu IP es diferente de `192.168.1.105`, actualiza:

**Archivo 1:** `admin-app/src/screens/AdminProfessionalValidation.js`
```
Línea ~150: 'http://192.168.1.105:5555/api/sync/user'
                        ↑
              REEMPLAZA CON TU IP
```

**Archivo 2:** `src/context/AuthContext.js`
```
Línea ~145: 'http://192.168.1.105:5555/api/sync/users'
                        ↑
              REEMPLAZA CON TU IP
```

---

### 3️⃣ Ejecuta el Servidor (30 segundos)

```bash
cd c:\Users\ACER2025\Documents\MANOSPY2
node sync-server.js
```

**Debes ver:**
```
╔════════════════════════════════════════╗
║  🚀 Servidor de Sincronización Activo  ║
╚════════════════════════════════════════╝

📍 Puerto: http://0.0.0.0:5555
```

---

## 🧪 Ahora Puedes Probar

### Opción A: Test Automático (Recomendado)

**En otra terminal:**
```bash
cd c:\Users\ACER2025\Documents\MANOSPY2
node test-validation-flow.js
```

**Debes ver:**
```
✅ Servidor conectado
✅ 5 usuarios en la base de datos
✅ Profesional validado
✅ Base de datos sincronizada
✅ Profesional puede iniciar sesión
```

### Opción B: Test Manual (5 minutos)

1. **Ejecuta Admin-App:**
   ```bash
   cd admin-app
   npm start
   ```

2. **Ejecuta MANOSPY2:**
   ```bash
   # En otra terminal
   npm start
   ```

3. **Registra un profesional en MANOSPY2:**
   - Click "Seleccionar Rol"
   - Click "Profesional"
   - Email: `test@pro.com`
   - Nombre: `Test Pro`
   - Teléfono: `595991234567`
   - Especialidad: `Prueba`
   - Ciudad: `Asunción`
   - Contraseña: `test123`
   - Click "Registrarse"

4. **Admin valida en Admin-App:**
   - Click "Validación de Profesionales"
   - Busca "Test Pro"
   - Click "✓ VALIDAR"
   - Confirma

5. **Profesional inicia sesión en MANOSPY2:**
   - Click "Ir a Login"
   - Email: `test@pro.com`
   - Contraseña: `test123`
   - Click "Login"
   - ✅ Debe permitir acceso

---

## ✅ Si Todo Funciona

**Verás:**
- ✅ Servidor corriendo
- ✅ Test automático pasado O flujo manual exitoso
- ✅ Profesional puede hacer login después de validación

**Próximo paso:** Leer documentación completa en [README_VALIDACION_PROFESIONALES.md](README_VALIDACION_PROFESIONALES.md)

---

## ❌ Si Hay Problema

### Error: "No se puede conectar"
```bash
# Verifica que el servidor está corriendo
curl http://192.168.1.105:5555/health

# Si no funciona:
1. Ctrl+C en terminal del servidor
2. node sync-server.js
```

### Error: "Profesional no puede hacer login"
```
Error: "Tu cuenta está pendiente de verificación"

Solución:
1. Admin DEBE validar primero en Admin-App
2. Luego el profesional puede hacer login
```

### Error: "IP no funciona"
```bash
# Verificar tu IP real
ipconfig

# Buscar: IPv4 Address
# Actualizar en ambos archivos (AdminProfessionalValidation.js y AuthContext.js)
```

---

## 📚 Documentación Completa

Para más detalles, revisar:

- **[README_VALIDACION_PROFESIONALES.md](README_VALIDACION_PROFESIONALES.md)** - Visión general
- **[CONFIG_RAPIDA_VALIDACION.md](CONFIG_RAPIDA_VALIDACION.md)** - Configuración detallada
- **[TEST_VALIDACION_PROFESIONALES.md](TEST_VALIDACION_PROFESIONALES.md)** - Pruebas completas

---

## 🎯 Resumen

| Paso | Acción | Tiempo |
|------|--------|--------|
| 1 | Verificar IP | 30 seg |
| 2 | Actualizar código | 1 min |
| 3 | Ejecutar servidor | 30 seg |
| 4 | Test automático | 1 min |
| 5 | ✅ Listo | 3 min |

---

## 🔑 Credenciales de Prueba

**Admin:**
- Email: admin@test.com
- Password: admin123

**Profesional (antes de validar):**
- Email: carlos@test.com
- Password: test123
- Status: Pendiente

**Profesional (después de validar):**
- Email: maria@test.com
- Password: test123
- Status: Validado ✓

---

## 🚀 ¡LISTO!

**Estado:** ✅ Sistema Operativo

**Próximo:** Explorar documentación o comenzar a usar

---

*Sistema de Validación de Profesionales - MANOSPY2*

