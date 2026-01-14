# 🎯 ManosPy - Setup Completo (App Móvil Principal + Admin App)

## 📱 Ahora tienes 2 Apps Móviles Expo

### **1. MANOSPY2** (App Principal - Cliente/Profesional)
```bash
cd MANOSPY2
npm start
```
**Puerto:** 8082  
**QR:** Escanea con Expo Go

---

### **2. admin-app** (Panel Admin Móvil)
```bash
cd admin-app
npm start
```
**Puerto:** 8081  
**QR:** Escanea con Expo Go

---

## 🔐 Credenciales Admin

**Email:** `admin@manospy.com`  
**Contraseña:** `admin123`

---

## 🚀 Cómo Usar

### **Paso 1: Inicia MANOSPY2 (App Principal)**
```bash
cd MANOSPY2
npm start
```
- Presiona **w** para web o escanea QR con Expo Go
- Opción 1: Selecciona **Cliente** → Login normal
- Opción 2: Selecciona **Profesional** → Registro

### **Paso 2: Registra un Profesional**
1. Selecciona "Profesional"
2. Completa: nombre, email, teléfono, especialidad
3. Se marca como `verified: false` automáticamente
4. Ve la pantalla de espera (ProfessionalValidationScreen)
5. Aparece botón **"💬 Abrir WhatsApp"** con solicitud

### **Paso 3: Inicia admin-app (Panel Admin)**
```bash
cd admin-app
npm start
```
- Presiona **w** para web o escanea QR
- Login con: `admin@manospy.com` / `admin123`

### **Paso 4: En el Admin Panel**
1. Ve a **"Validación"** tab
2. Verás profesionales pendientes
3. Presiona **"Validar ✓"** para aprobar
4. Presiona **"Rechazar ✗"** para rechazar

### **Paso 5: Profesional Verifica Estado**
1. En MANOSPY2, en la pantalla de validación
2. Presiona **"✓ Verificar estado de validación"**
3. Si fue validado: Se abre ProfessionalHome
4. Si aún está pendiente: Mensaje de espera

---

## 📊 Pantallas del Admin App

### **Dashboard 📊**
- Estadísticas totales de usuarios
- Profesionales validados/pendientes
- Cuentas bloqueadas
- Acciones rápidas

### **Usuarios 👥**
- Lista completa de clientes y profesionales
- **Buscar** por nombre, email o teléfono
- **Bloquear/Desbloquear** cuentas
- **Eliminar** usuarios
- Filtrar por rol

### **Validación 🔧**
- Solicitudes pendientes con datos
- **Botón "Validar"** → Aprueba profesional
- **Botón "Rechazar"** → Rechaza solicitud
- Lista de profesionales validados
- Contacto directo por WhatsApp

### **Moderación de Chats 💬**
- Ver conversaciones entre clientes y profesionales
- Intervenir en disputas
- Monitorear

### **Recuperación de Contraseñas 🔐**
- Generar contraseñas temporales
- Resetear credenciales de usuario

---

## 🔄 Base de Datos Compartida

Ambas apps comparten la **misma base de datos** en localStorage:

```
LocalStorage Keys (Compartido):
- manospy_users_db_v1      → BD de todos los usuarios
- manospy_user_v1          → Usuario actual logeado (app)
- manospy_admin_user       → Admin logeado (admin-app)
```

Cuando el admin valida a un profesional en admin-app:
- Se actualiza `verified: true` en la BD
- El profesional lo ve al verificar estado en MANOSPY2

---

## 📞 Sistema de WhatsApp

### En MANOSPY2 (Profesional pendiente)
```
Botón "💬 Abrir WhatsApp" genera mensaje:

Solicitud de Validación - ManosPy 🔧

Nombre: [Nombre profesional]
Email: [Email profesional]
Teléfono: [Teléfono profesional]
Especialidad: [Especialidad]
Fecha de Registro: 13/01/2026

Por favor valida esta cuenta escribiendo: /validar [email]
```

**Envía a:** +595 991 836168 (0991836168)

---

## 📋 Flujo Completo

```
┌─ MANOSPY2 (Puerto 8082)
│  ├─ Cliente Login
│  └─ Profesional
│     ├─ Registra
│     ├─ verified: false
│     ├─ ProfessionalValidationScreen
│     ├─ WhatsApp al Admin
│     └─ Espera validación
│
└─ admin-app (Puerto 8081)
   ├─ Admin Login (admin@manospy.com / admin123)
   ├─ Dashboard (estadísticas)
   ├─ Usuarios (gestionar)
   ├─ Validación (aprobar/rechazar)
   │  └─ Aprueba profesional
   │     └─ verified: true en BD
   │
   ├─ Chats (moderar)
   └─ Contraseñas (recuperar)

┌─ MANOSPY2 (Profesional verifica)
│  └─ Presiona "✓ Verificar estado"
│     └─ Se actualiza de BD
│        └─ Si verified === true
│           └─ Acceso a ProfessionalHome
```

---

## ✅ Checklist de Instalación

- [ ] Carpeta `MANOSPY2` con dependencies instaladas
- [ ] Carpeta `admin-app` con dependencies instaladas
- [ ] MANOSPY2 inicia en puerto 8082
- [ ] admin-app inicia en puerto 8081
- [ ] Puedes hacer login en admin con `admin@manospy.com` / `admin123`
- [ ] Puedes registrarte como profesional en MANOSPY2
- [ ] Ves la pantalla de validación (espera)
- [ ] En admin-app ves la solicitud pendiente
- [ ] Al validar, el profesional puede verificar y acceder

---

## 🆘 Solución de Problemas

### "No veo el admin-app"
```bash
# Asegúrate de estar en la carpeta correcta
cd admin-app
npm start
```

### "Erro en las dependencias"
```bash
# Limpia y reinstala
rm -r node_modules package-lock.json
npm install --legacy-peer-deps
```

### "¿Cómo cambiar el número de WhatsApp?"
- **MANOSPY2:** `src/screens/professional/ProfessionalScreens.js` línea ~260
- Busca: `const ADMIN_WHATSAPP = '+595991836168'`
- Cambia a tu número

### "¿Cómo cambiar credenciales de admin?"
- **admin-app:** `App.js` línea ~30
- Busca: `if (email === 'admin@manospy.com' && password === 'admin123')`
- Cambia email y password

---

## 🎉 ¡Lista!

Ahora tienes:

✅ **App Móvil Principal** (MANOSPY2)
- Clientes pueden hacer login
- Profesionales se registran y esperam validación
- Sistema de chats funcional
- Galería de trabajo

✅ **App Admin Móvil** (admin-app)
- Dashboard con estadísticas
- Gestión completa de usuarios
- Validación de profesionales
- Bloquear/Desbloquear cuentas
- Recuperación de contraseñas

✅ **Base de Datos Compartida**
- Los cambios en admin-app se sincronizan a MANOSPY2
- En tiempo real (en el mismo dispositivo)

---

**¿Necesitas ayuda? Revisa el archivo `CONFIGURACION_FINAL.md` para más detalles**
