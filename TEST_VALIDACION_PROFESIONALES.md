# 🧪 Test de Validación de Profesionales

## Flujo Completo: Admin Valida → Profesional Inicia Sesión

### ✅ Requisitos Previos
1. **Servidor de sincronización ejecutándose**
   ```bash
   node sync-server.js
   # Debe estar en http://192.168.1.105:5555
   ```

2. **Admin-App y MANOSPY2 corriendo**
   - admin-app: conectada a la red local
   - MANOSPY2: conectada a la red local

### 📋 Paso 1: Registrar un Profesional en MANOSPY2
1. Abrir MANOSPY2
2. Seleccionar rol: **Profesional**
3. Llenar formulario:
   - Email: `prueba@profesional.com`
   - Nombre: `Juan Profesional`
   - Teléfono: `595991234567`
   - Especialidad: `Electricidad`
   - Ciudad: `Asunción`
   - Contraseña: `test123`
4. **Registrarse** (sin iniciar sesión automáticamente)

### 🔐 Paso 2: Admin Valida el Profesional en Admin-App
1. Abrir **Admin-App**
2. Ir a **Validación de Profesionales**
3. Buscar **"Juan Profesional"** en la sección "Pendientes de Validación"
4. Presionar botón **"✓ Validar"**
5. Confirmar validación

#### ✅ Esperado:
- ✅ Profesional se mueve a sección "Profesionales Verificados"
- ✅ Console muestra: `✅ Profesional validado en servidor`
- ✅ Sincronización a `/api/sync/user` exitosa
- ✅ Sincronización a `/api/sync/users` exitosa

### 🔑 Paso 3: Profesional Inicia Sesión en MANOSPY2
1. Abrir MANOSPY2
2. Ir a pantalla de **Login**
3. Ingresar:
   - Email: `prueba@profesional.com`
   - Contraseña: `test123`
4. Presionar **Login**

#### ✅ Esperado:
- ✅ Console muestra: `[Sync] ✅ BD sincronizada del servidor`
- ✅ Console muestra: `✓ Usuario encontrado`
- ✅ Console muestra: `✅ Login exitoso`
- ✅ **El profesional inicia sesión exitosamente**
- ✅ Se navega a pantalla de profesional

### ❌ Si no funciona:
```
Posible Error 1: "Tu cuenta está pendiente de verificación"
→ El `verified` no se sincronizó. Revisar sync-server.js

Posible Error 2: "Usuario no encontrado"
→ Revisar que la BD esté sincronizada en el servidor

Posible Error 3: Falla de conexión al servidor
→ Revisar IP 192.168.1.105:5555 en ambas apps
→ Ejecutar: curl http://192.168.1.105:5555/health
```

---

## 🔍 Debugging

### Ver estado del servidor
```bash
curl http://192.168.1.105:5555/api/sync/stats
```

### Respuesta esperada:
```json
{
  "ok": true,
  "data": {
    "totalUsers": 5,
    "professionals": 2,
    "verified": 1,
    "pending": 1,
    "clients": 2,
    "blocked": 0
  }
}
```

### Ver todos los usuarios
```bash
curl http://192.168.1.105:5555/api/sync/users
```

---

## 📝 Cambios Implementados

### 1. AdminProfessionalValidation.js
- ✅ Mejorado `handleValidate()` con sincronización robusta
- ✅ Ahora sincroniza a `/api/sync/user` (usuario individual)
- ✅ También sincroniza a `/api/sync/users` (array completo)
- ✅ Mejor manejo de errores con feedback al usuario

### 2. AuthContext.js
- ✅ Mejorado `login()` con sincronización desde servidor
- ✅ Valida que profesionales tengan `verified === true`
- ✅ Sincroniza BD antes de validar credenciales
- ✅ Mejor logging con emojis para debugging

### 3. sync-server.js
- ✅ Ya soporta `POST /api/sync/user` (actualiza profesional)
- ✅ Ya soporta `POST /api/sync/users` (sincroniza array)
- ✅ Mantiene estado `verified` correctamente

---

## 🎯 Casos de Uso Cubiertos

| Caso | Resultado |
|------|-----------|
| Profesional no verificado intenta login | ❌ Acceso denegado |
| Admin valida profesional | ✅ verified = true |
| Profesional verificado intenta login | ✅ Acceso permitido |
| Sincronización con servidor offline | ✅ Continúa con BD local |
| Admin ve profesionales pendientes | ✅ Lista actualizada |

---

## 🚀 Próximos Pasos (Opcional)
- [ ] Agregar notificación por WhatsApp al profesional validado
- [ ] Agregar resend de email de validación
- [ ] Historial de validaciones en admin
- [ ] Reportes de profesionales por especialidad

