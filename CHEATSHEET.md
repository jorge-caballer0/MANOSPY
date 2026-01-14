# 🎯 REFERENCIA RÁPIDA DE MANOSPY

## ⚡ INICIAR EN 3 PASOS

```bash
cd c:\Users\ACER2025\Documents\MANOSPY2
npm install  # Si es primera vez
npm run web
```

→ Abre http://localhost:8081

---

## 👥 ROLES Y FLUJOS

### 🔵 CLIENTE
```
Selecciona Cliente → Login → Tabs principales:
  • Inicio (Categorías + Profesionales)
  • Buscar (Filtros avanzados)
  • Solicitar (3 pasos para solicitud)
  • Reservas (Tus reservaciones)
  • Chat (Mensajes)
  • Perfil (Mi info)
```

### 🟢 PROFESIONAL
```
Selecciona Profesional → Onboarding (4 pasos) → Tabs principales:
  • Inicio (Dashboard stats)
  • Solicitudes (Nuevas solicitudes)
  • Agenda (Calendario)
  • Chat (Conversaciones)
  • Perfil (Mi perfil profesional)
```

---

## 📁 ESTRUCTURA (Resumen)

```
src/
├── constants/        ← Colores, espaciado, categorías
├── context/          ← Autenticación (useAuth)
├── screens/
│   ├── auth/         ← Login, Onboarding
│   ├── client/       ← 7+ pantallas cliente
│   └── professional/ ← 6+ pantallas profesional
├── components/       ← Button, Card, Avatar, Badge, Header
├── navigation/       ← RootNavigator (Stack + Tabs)
├── services/         ← API placeholders
└── utils/            ← Funciones helper
```

---

## 🎨 COLORES DE TEMA

```
COLORS.primary       = #0B84FF (Azul)
COLORS.success       = #10B981 (Verde)
COLORS.warning       = #F59E0B (Naranja)
COLORS.danger        = #EF4444 (Rojo)
COLORS.text          = #1F2937 (Negro/Gris oscuro)
COLORS.background    = #FFFFFF (Blanco)
```

---

## 🧩 COMPONENTES REUTILIZABLES

### Button
```jsx
<Button title="Aceptar" onPress={handlePress} />
<Button title="Cancelar" variant="secondary" />
<Button title="Eliminar" variant="danger" />
```

### Card
```jsx
<Card>
  <Text>Contenido dentro</Text>
</Card>
```

### Avatar
```jsx
<Avatar initials="JD" size="md" bgColor={COLORS.primary} />
```

### Badge
```jsx
<Badge text="Confirmada" variant="success" />
```

### Header
```jsx
<Header title="Mi Pantalla" onBack={() => navigation.goBack()} />
```

---

## 📱 PANTALLAS PRINCIPALES

### Cliente (7)
1. **ClientLoginScreen** - Login
2. **ClientHomeScreen** - Inicio
3. **ClientSearchScreen** - Búsqueda
4. **RequestServiceScreen** - Solicitar servicio
5. **ClientReservationsScreen** - Mis reservas
6. **ClientChatScreen** - Mensajes
7. **ClientProfileScreen** - Perfil
8. **ProfessionalDetailScreen** - Ver profesional (bonus)

### Profesional (6)
1. **ProfessionalOnboardingScreen** - Setup
2. **ProfessionalHomeScreen** - Dashboard
3. **ProfessionalRequestsScreen** - Solicitudes
4. **ProfessionalAgendaScreen** - Agenda
5. **ProfessionalChatScreen** - Chat
6. **ProfessionalProfileScreen** - Perfil

### Compartidas
- **RoleSelectionScreen** - Seleccionar rol
- **ChatDetailScreen** - Conversación individual

---

## 🔑 HOOKS Y CONTEXTO

### useAuth
```javascript
const { user, role, selectRole, login, logout } = useAuth();

// Usar
if (!user) {
  // Mostrar login
} else if (role === 'client') {
  // Mostrar app cliente
}
```

---

## 📊 DATOS MOCK INCLUIDOS

### 18 Categorías
```javascript
CATEGORIES = [
  { id: 1, name: 'Plomería', icon: 'water', color: '#3B82F6' },
  { id: 2, name: 'Electricidad', icon: 'flash', color: '#FBBF24' },
  // ... 16 más
]
```

### Profesionales de Prueba
- Carlos Mendoza (Electricista, 4.8★)
- María García (Plomería, 4.9★)
- Pedro Ruiz (Carpintería, 4.7★)

### Estados
```
Pendiente    → Naranja
Confirmada   → Verde
En curso     → Azul
Completada   → Gris
Cancelada    → Rojo
```

---

## ⌨️ COMANDOS ÚTILES

```bash
# Web
npm run web

# Android
npm run android

# iOS
npm run ios

# Con Expo Go (universal)
npm start

# Limpiar caché
npm start -- --reset-cache

# Instalar web support
npx expo install react-dom react-native-web
```

---

## 🔍 CÓMO DEBUGGEAR

### En navegador
1. Presiona F12
2. Ve a Console tab
3. Ver logs de la app

### En Expo
1. Ejecuta `npm start`
2. Presiona `j` para debugger
3. Presiona `m` para más tools

---

## 📖 DOCUMENTACIÓN

| Archivo | Qué contiene |
|---------|-------------|
| COMIENZA_AQUI.md | **EMPIEZA AQUÍ** |
| README.md | Overview general |
| QUICK_START.md | Guía desarrollo rápida |
| ARQUITECTURA.md | Detalles técnicos |
| SETUP.md | Configuración |
| INDEX.md | Índice de archivos |

---

## 🆘 PROBLEMAS COMUNES

### "Cannot find module"
```bash
npm install
rm -rf node_modules && npm install
```

### "Port 8081 already in use"
```bash
npm run web -- --port 8082
```

### "React is not defined"
→ Agregar `import React from 'react';` al inicio

### "No screens to show"
→ Revisar RootNavigator.js

---

## 💡 TIPS

✅ Todos los estilos en StyleSheet.create() al final del archivo
✅ Usar COLORS, SPACING desde constants
✅ Desestructurar props en parámetros
✅ Componentes reutilizables en src/components/
✅ Pantallas en src/screens/
✅ Importar desde index.js

---

## 📝 CONVENCIONES

```javascript
// ✅ Correcto
import { COLORS, SPACING } from '../../constants';
import { useAuth } from '../../context';
import { Button, Card } from '../../components';

// ❌ Incorrecto
import COLORS from '../../constants/theme';
import Button from '../../components';
```

---

## 🎯 PRÓXIMOS PASOS

1. **Conectar backend** (Node.js, Firebase, etc)
2. **Autenticación real** (JWT tokens)
3. **Base de datos** (MongoDB, Firestore)
4. **Google Maps** (ubicación)
5. **Pagos** (Stripe, MercadoPago)
6. **Push notifications**
7. **Publicar en stores**

---

## ✨ CARACTERÍSTICAS

✅ 14+ pantallas implementadas
✅ Componentes reutilizables
✅ Sistema de diseño consistente
✅ Autenticación por rol
✅ Navegación fluida
✅ Datos mock realistas
✅ Compilación sin errores
✅ Documentación completa

---

## 🚀 ¡EMPEZAR YA!

```bash
cd MANOSPY2
npm run web
```

→ Abre http://localhost:8081

---

**Versión**: 1.0.0  
**Estado**: ✅ Completo  
**Última actualización**: 2024
