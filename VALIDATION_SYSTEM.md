# Sistema de Validación de Profesionales - ManosPy

## 📋 Descripción General

El sistema de validación de profesionales asegura que solo profesionales verificados puedan acceder a la plataforma ManosPy. El administrador debe aprobar manualmente cada solicitud de registro de profesional.

## 🔄 Flujo de Validación

### 1. **Registro de Profesional**
- El profesional se registra en la app
- El sistema automáticamente establece `verified: false`
- Se almacena en la base de datos local (AsyncStorage)

### 2. **Pantalla de Espera (ProfessionalValidationScreen)**
- Profesional sin validar ve esta pantalla en lugar de las funciones principales
- Muestra: nombre, email, teléfono, especialidad
- Opciones:
  - 💬 **Abrir WhatsApp** - Abre chat con administrador con mensaje pre-escrito
  - **Copiar datos** - Copia la solicitud al portapapeles
  - ✓ **Verificar estado** - Comprueba si fue validado
  - 🚪 **Cerrar sesión** - Cierra la sesión

### 3. **Mensaje WhatsApp**
El mensaje que se envía al administrador contiene:
```
Solicitud de Validación - ManosPy 🔧

Nombre: [Nombre del profesional]
Email: [Email del profesional]
Teléfono: [Teléfono del profesional]
Especialidad: [Especialidad del profesional]
Fecha de Registro: [Fecha]

Por favor valida esta cuenta escribiendo: /validar [email]
```

### 4. **Panel de Administrador**
- Acceso: En RoleSelectionScreen, hacer click en toggle al final (para mostrar opción Admin)
- Dashboard muestra:
  - **Estadísticas**: Cantidad de pendientes y validados
  - **Solicitudes Pendientes**: Lista de profesionales sin validar
  - **Profesionales Validados**: Lista de profesionales ya aprobados

#### Acciones en Panel:
- ✓ **Validar** - Aprueba al profesional (set `verified: true`)
- ✗ **Rechazar** - Elimina la solicitud de la base de datos
- 🚪 **Cerrar sesión** - Cierra la sesión de admin

### 5. **Confirmación de Validación**
- Cuando admin valida, se actualiza la base de datos
- El profesional puede:
  - Hacer click en "Verificar estado" para actualizar
  - Cerrar sesión y volver a iniciar
  - Automáticamente se redirigirá a las funciones normales

## 📱 Rutas de Navegación

### Sin Autenticar
```
RoleSelection → ClientLogin / ProfessionalOnboarding
```

### Cliente Autenticado
```
ClientTabs (Home, Search, Reservations, Chat, Profile)
  ├── ClientEditProfile
  ├── ProfessionalDetail
  └── ChatDetail
```

### Profesional No Validado
```
ProfessionalValidation (Pantalla de espera)
```

### Profesional Validado
```
ProfessionalTabs (Home, Requests, Agenda, Chat, Profile)
  ├── ProfessionalEditProfile
  ├── ProfessionalMyWork (Galería)
  └── ChatDetail
```

### Administrador
```
AdminDashboard (Gestión de validaciones)
```

## 💾 Estructura de Datos

### Usuario (user)
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  specialty: string,
  password: string,
  role: 'professional' | 'client' | 'admin',
  verified: boolean,  // ← Campo crítico para validación
  city: string,
  createdAt: string,
}
```

### Almacenamiento
- **manospy_user_v1**: Usuario actualmente logueado
- **manospy_role_v1**: Rol seleccionado
- **manospy_users_db_v1**: Base de datos completa de usuarios

## 🔐 Número de WhatsApp del Admin

Editar en: `src/screens/professional/ProfessionalScreens.js`
```javascript
const ADMIN_WHATSAPP = '+595981234567'; // Cambiar con número real
```

## 🧪 Pruebas

### Caso 1: Flujo Normal
1. Registrar como profesional
2. Ser redirigido a ProfessionalValidationScreen
3. Abrir WhatsApp y contactar admin
4. Admin aprueba en AdminDashboard
5. Profesional verifica estado y accede a la app

### Caso 2: Admin Rechaza
1. Admin hace click en "✗ Rechazar"
2. Profesional es eliminado de la base de datos
3. Debe registrarse de nuevo

### Caso 3: Verificación Pendiente
1. Profesional hace click en "✓ Verificar estado"
2. Si aún no está validado, aparece mensaje de espera
3. Si fue validado, se redirige a ProfessionalTabs automáticamente

## ✅ Funcionalidades Completadas

- ✅ Sistema de registro con `verified: false`
- ✅ Pantalla de espera (ProfessionalValidationScreen)
- ✅ Integración con WhatsApp (wa.me)
- ✅ Panel de administrador
- ✅ Funciones de validar/rechazar
- ✅ Persistencia en AsyncStorage
- ✅ Verificación de estado sin logout
- ✅ Navegación condicional basada en rol y verificación

## 📝 Notas

- El rol "admin" es oculto en RoleSelectionScreen (hacer click en botón al final)
- No hay autenticación de admin (cualquiera puede acceder - mejorar en producción)
- El número de WhatsApp debe actualizarse con el número real del propietario
- El email no está integrado aún (solo WhatsApp)

## 🔄 Flujo General de Navegación

```
┌─ Sin Autenticar
│  ├─ RoleSelection
│  ├─ ClientLogin
│  └─ ProfessionalOnboarding
│
├─ Admin (role === 'admin')
│  └─ AdminDashboard
│
├─ Cliente (role === 'client')
│  └─ ClientTabs + screens
│
└─ Profesional
   ├─ No Validado (verified === false)
   │  └─ ProfessionalValidation
   └─ Validado (verified === true)
      └─ ProfessionalTabs + screens
```
