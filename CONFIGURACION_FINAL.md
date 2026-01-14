# ManosPy - Configuración Final

## 📱 App Móvil (Cliente/Profesional)

La app móvil está **completamente funcional** con:

- ✅ Login de Cliente
- ✅ Registro de Profesional con sistema de validación
- ✅ Búsqueda y filtrado de profesionales
- ✅ Solicitud de servicios con fotos
- ✅ Chat entre clientes y profesionales
- ✅ Galería de trabajo para profesionales
- ✅ Sistema de validación: **Profesionales NO VALIDADOS ver pantalla de espera**

### 🔄 Flujo de Validación Profesional

1. **Profesional se registra** → `verified: false`
2. **Ve pantalla de espera** (ProfessionalValidationScreen)
3. **Abre WhatsApp** → Envía solicitud al admin (+595 991 836168)
4. **Admin valida en panel web** → `verified: true`
5. **Profesional verifica estado** → Accede a la app

---

## 💻 Panel Admin Web (Separado)

**Ubicación:** `MANOSPY_ADMIN/admin-panel/`

### Cómo Iniciar

```bash
# 1. Navegar a la carpeta
cd MANOSPY_ADMIN/admin-panel

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor
npm run dev

# 4. Abrir en navegador
http://localhost:5173
```

### Credenciales Demo

- **Email:** admin@manospy.com
- **Contraseña:** admin123

### Funcionalidades del Panel Admin

#### 1. **Dashboard**
- Estadísticas de usuarios totales
- Profesionales validados y pendientes
- Acciones rápidas

#### 2. **Gestión de Usuarios**
- Ver lista completa de clientes y profesionales
- Buscar por nombre, email o teléfono
- **Activar/Desactivar cuentas** 🚫
- **Editar información** del usuario
- **Eliminar usuarios**
- Contactar por WhatsApp (botón directo)

#### 3. **Validación de Profesionales**
- Ver solicitudes pendientes con sus datos
- **Botón "Validar"** → Aprueba y permite login
- **Botón "Rechazar"** → Elimina la solicitud
- Ver lista de profesionales ya validados
- Los datos se sincronizan automáticamente

#### 4. **Moderación de Chats**
- Ver historial de conversaciones
- Identificar problemas (falta de respuesta del profesional)
- Intervenir por WhatsApp si es necesario

#### 5. **Recuperación de Contraseñas**
- Generar contraseñas temporales para clientes
- Generar contraseñas temporales para profesionales
- Enviar por correo (implementar email)

---

## 🗄️ Base de Datos Compartida

Ambas apps comparten la **misma base de datos en localStorage:**

```
LocalStorage Keys:
- manospy_user_v1          → Usuario logeado actual
- manospy_role_v1          → Rol seleccionado
- manospy_users_db_v1      → BD completa de usuarios (JSON)
```

### Estructura de Usuario

```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  password: string,
  role: 'client' | 'professional',
  specialty: string,        // Solo profesionales
  verified: boolean,        // Solo profesionales
  blocked: boolean,         // Control del admin
  city: string,
  createdAt: string
}
```

---

## 📞 Teléfono del Admin

**+595 991 836168** (0991836168)

Todos los mensajes de WhatsApp llegan aquí:
- ✉️ Solicitud de validación de nuevo profesional
- 💬 Intervención en chats
- 🔐 Recuperación de contraseñas

---

## 🚀 Flujo Completo

### Para Cliente

```
RoleSelection → ClientLogin → ClientHome → Buscar Profesional → 
Solicitar Servicio → Chat → Calificar
```

### Para Profesional (Sin Validar)

```
RoleSelection → ProfessionalOnboarding → 
ProfessionalValidationScreen → WhatsApp al Admin → 
Esperar Validación → Admin Aprueba → 
Profesional Verifica Estado → ProfessionalHome
```

### Para Profesional (Validado)

```
ProfessionalHome → Ver Solicitudes → Aceptar/Rechazar → 
Chat con Cliente → Marcar Completado → 
Galería de Trabajo (Fotos/Certificados)
```

### Para Admin

```
Admin Web Panel → Validar Profesionales → 
Gestionar Usuarios → Desactivar Cuentas → 
Moderar Chats → Recuperar Contraseñas
```

---

## 🔐 Seguridad

⚠️ **IMPORTANTE PARA PRODUCCIÓN:**

- [ ] Cambiar credenciales de admin en `admin-panel/src/App.jsx` (línea 30)
- [ ] Implementar autenticación real con backend
- [ ] Cambiar número de WhatsApp en `src/screens/professional/ProfessionalScreens.js` si es necesario
- [ ] Implementar hash de contraseñas (no guardar en texto plano)
- [ ] Agregar autenticación de dos factores para admin
- [ ] Backup de base de datos

---

## 🔄 Sincronización

Las apps se sincronizan automáticamente a través de localStorage:
- Cuando admin **valida** un profesional, la app móvil lo puede ver al hacer "Verificar estado"
- Cuando admin **desactiva** una cuenta, el usuario no puede logearse
- Cambios en tiempo real (en el mismo dispositivo)

---

## ✅ Checklist Final

- ✅ App móvil sin opción admin visible
- ✅ Sistema de validación de profesionales
- ✅ WhatsApp integrado (+595 991 836168)
- ✅ Panel admin web separado
- ✅ Gestión completa de usuarios
- ✅ Base de datos compartida
- ✅ Sistema de bloqueo de cuentas
- ✅ Recuperación de contraseñas

---

## 📝 Notas

- El panel admin es una **app web** (no móvil) para facilitar la gestión
- Accesible desde cualquier navegador en computadora
- Los datos se guardan en localStorage (simular BD)
- Para producción, migrar a backend real (Node.js, Firebase, etc)
- El email no está implementado aún (solo WhatsApp)

---

¡La app está lista para usar! 🎉
