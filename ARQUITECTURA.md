# 🏗️ ARQUITECTURA DE MANOSPY

## Visión General de la Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   APP.JS                             │
│            (AuthProvider + RootNavigator)            │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼────┐          ┌─────▼──────┐
    │ Context │          │ Navigation │
    │  (Auth) │          │  (Router)  │
    └────┬────┘          └──────┬──────┘
         │                      │
         │        ┌─────────────┴──────────────┐
         │        │                            │
    ┌────▼────┐  ┌▼──────────┐           ┌────▼─────┐
    │   Auth  │  │  Screens  │           │ Components│
    │ Context │  │  (14+)    │           │  (5)     │
    └─────────┘  └───────────┘           └──────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    ┌───▼────┐  ┌──────▼──┐  ┌─────▼──────┐
    │ Client │  │   Auth  │  │Professional│
    │Screens │  │ Screens │  │  Screens   │
    │  (7)   │  │  (3)    │  │    (6)     │
    └────────┘  └─────────┘  └────────────┘
```

---

## 📁 Estructura de Carpetas

```
MANOSPY2/
├── src/
│   ├── constants/
│   │   ├── theme.js           # Colores, espaciado, radiuses
│   │   ├── categories.js       # 18 categorías de servicios
│   │   └── index.js            # Exportes
│   │
│   ├── context/
│   │   ├── AuthContext.js      # Estado de autenticación
│   │   └── index.js            # Exportes
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── RoleSelectionScreen.js
│   │   │   └── index.js
│   │   │
│   │   ├── client/
│   │   │   ├── ClientScreens.js    # 7+ pantallas en 1 archivo
│   │   │   └── index.js
│   │   │
│   │   └── professional/
│   │       ├── ProfessionalScreens.js  # 6+ pantallas en 1 archivo
│   │       └── index.js
│   │
│   ├── components/
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Avatar.js
│   │   ├── Badge.js
│   │   ├── Header.js
│   │   └── index.js
│   │
│   ├── navigation/
│   │   ├── RootNavigator.js    # Stack + Bottom Tabs
│   │   └── index.js
│   │
│   ├── services/
│   │   └── index.js            # API placeholders
│   │
│   └── utils/
│       └── index.js            # Utilidades
│
├── App.js                       # Entrada principal
├── app.json                     # Configuración Expo
├── package.json
├── README.md
├── QUICK_START.md
├── RESUMEN_FINAL.md
└── ARQUITECTURA.md (este archivo)
```

---

## 🔀 Flujo de Datos

### Flujo de Autenticación

```javascript
// 1. Usuario selecciona rol
RoleSelectionScreen 
  → useAuth.selectRole('client' | 'professional')

// 2. Contexto actualiza estado
AuthContext { role: 'client' }

// 3. Usuario hace login
ClientLoginScreen 
  → useAuth.login(email, password)

// 4. Contexto actualiza user
AuthContext { user: {...}, role: 'client' }

// 5. RootNavigator renderiza UI apropiada
if (user && role === 'client') {
  → ClientTabs Navigator
} else if (user && role === 'professional') {
  → ProfessionalTabs Navigator
}
```

### Flujo de Navegación

```
Stack Navigator (Root)
│
├─ Auth Screens (antes de login)
│  ├─ RoleSelection
│  ├─ ClientLogin
│  └─ ProfessionalOnboarding
│
└─ App Screens (después de login)
   │
   ├─ Client (si role === 'client')
   │  │
   │  ├─ Bottom Tabs
   │  │  ├─ Home (ClientHome)
   │  │  ├─ Search (ClientSearch)
   │  │  ├─ Request (RequestService)
   │  │  ├─ Reservations (ClientReservations)
   │  │  ├─ Chat (ClientChat)
   │  │  └─ Profile (ClientProfile)
   │  │
   │  └─ Stack Screens
   │     ├─ ProfessionalDetail
   │     └─ ChatDetail
   │
   └─ Professional (si role === 'professional')
      │
      ├─ Bottom Tabs
      │  ├─ Home (ProfessionalHome)
      │  ├─ Requests (ProfessionalRequests)
      │  ├─ Agenda (ProfessionalAgenda)
      │  ├─ Chat (ProfessionalChat)
      │  └─ Profile (ProfessionalProfile)
      │
      └─ Stack Screens
         └─ ChatDetail
```

---

## 🎯 Componentes Core

### AuthContext

```javascript
// Estado
{
  user: null | { id, email, name, role },
  role: null | 'client' | 'professional',
  isLoading: boolean
}

// Funciones
selectRole(role)           // Selecciona el rol
register(data)             // Registro de usuario
login(email, password)     // Login
logout()                   // Logout
```

### Button Component

```javascript
// Variantes
<Button variant="primary" />      // Azul, relleno
<Button variant="secondary" />    // Borde, sin relleno
<Button variant="ghost" />        // Transparente
<Button variant="danger" />       // Rojo
<Button variant="success" />      // Verde

// Propiedades
title           // Texto del botón
onPress         // Callback de click
disabled        // Deshabilitar
loading         // Mostrar spinner
```

### Card Component

```javascript
// Contenedor elevado
<Card>
  <Text>Contenido</Text>
</Card>

// Propiedades
style           // Estilos adicionales
children        // Contenido
```

---

## 📊 Estructura de Datos

### Usuario Cliente

```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  city: string,
  avatar?: string,
  rating?: number,
  reviewsGiven?: number,
  createdAt: Date
}
```

### Usuario Profesional

```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  bio: string,
  specialties: string[],
  experience: number,
  zones: string[],
  rating: number,
  reviews: number,
  isPremium: boolean,
  isVerified: boolean,
  certificates: Array<{name, year}>,
  earnings?: number,
  createdAt: Date
}
```

### Solicitud de Servicio

```javascript
{
  id: number,
  clientId: number,
  category: string,
  description: string,
  photos?: string[],
  location: string,
  isUrgent: boolean,
  estimatedCost: number,
  status: 'Pendiente' | 'Confirmada' | 'En curso' | 'Completada',
  createdAt: Date
}
```

### Mensaje

```javascript
{
  id: number,
  sender: 'client' | 'professional',
  text: string,
  timestamp: Date,
  conversationId: number
}
```

---

## 🎨 Sistema de Temas

### Colores (COLORS)

```javascript
COLORS = {
  // Primarios por rol
  client: '#0B84FF',           // Azul
  professional: '#2ECC71',     // Verde
  primary: '#0B84FF',          // Alias del cliente
  accent: '#0B84FF',           // Acento
  
  // Texto
  text: '#1F2937',             // Negro/Gris oscuro
  textMuted: '#6B7280',        // Gris medio
  textLight: '#9CA3AF',        // Gris claro
  
  // Fondo
  background: '#FFFFFF',       // Blanco
  surface: '#F9FAFB',          // Gris muy claro
  border: '#E5E7EB',           // Borde gris
  
  // Estados
  success: '#10B981',          // Verde (éxito)
  warning: '#F59E0B',          // Naranja (alerta)
  danger: '#EF4444',           // Rojo (peligro)
  info: '#3B82F6'              // Azul (información)
}
```

### Espaciado (SPACING)

```javascript
SPACING = {
  xs: 4,    // 4px - espacios mínimos (bordes)
  sm: 8,    // 8px - espacios pequeños
  md: 16,   // 16px - espacios normales (padding/margin)
  lg: 24,   // 24px - espacios grandes
  xl: 32    // 32px - espacios muy grandes
}
```

### Radio (RADIUS)

```javascript
RADIUS = {
  sm: 8,    // Pequeño (botones)
  md: 12,   // Medio (componentes)
  lg: 16,   // Grande (cards)
  xl: 20    // Muy grande (especiales)
}
```

### Tamaños (SIZES)

```javascript
SIZES = {
  sm: 32,   // Pequeño (32x32)
  md: 48,   // Medio (48x48)
  lg: 64,   // Grande (64x64)
  xl: 80    // Muy grande (80x80)
}
```

---

## 🔧 Patrones de Código

### Import Pattern

```javascript
// ✅ Correcto
import { COLORS, SPACING } from '../../constants';
import { useAuth } from '../../context';
import { Button, Card } from '../../components';

// ❌ Incorrecto
import COLORS from '../../constants/theme';
import { theme } from '../../constants';
```

### Screen Pattern

```javascript
export const MyScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const [state, setState] = useState(null);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Contenido */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 }
  // más estilos...
});
```

### Component Pattern

```javascript
export const MyComponent = ({ title, onPress, children }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {/* Contenido */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // estilos
});
```

---

## 🚀 Convenciones

### Nombrado
- **Componentes**: PascalCase (MyComponent)
- **Funciones**: camelCase (myFunction)
- **Constantes**: UPPER_SNAKE_CASE (MY_CONSTANT)
- **Archivos**: PascalCase para screens, camelCase para utils

### Importes
- Agrupar por origen: React → Libraries → Local
- Usar imports específicos (no import *)
- Importar desde index.js de carpetas

### Estilos
- Usar StyleSheet.create() al final del archivo
- Propiedades en orden: layout → spacing → colors → text
- No usar estilos inline excepto para arrays dinámicos

### Props
- Desestructurar props en parámetros
- Usar nombres descriptivos
- Documentar con JSDoc

---

## 📡 Integración Backend (Placeholder)

```javascript
// src/services/index.js
export const apiService = {
  // GET
  async get(url) {
    // return fetch(url).then(r => r.json())
  },
  
  // POST
  async post(url, data) {
    // return fetch(url, { method: 'POST', body: JSON.stringify(data) })
  },
  
  // PUT
  async put(url, data) {
    // return fetch(url, { method: 'PUT', body: JSON.stringify(data) })
  },
  
  // DELETE
  async delete(url) {
    // return fetch(url, { method: 'DELETE' })
  }
};
```

---

## 🧪 Testing

### Puntos de Testing
- Context de autenticación
- Navegación entre roles
- Validación de formularios
- Renderizado condicional
- Manejo de errores

### Usuarios de Prueba
```javascript
// Cliente
{ email: 'cliente@test.com', password: 'any' }

// Profesional
{ email: 'pro@test.com', password: 'any' }
```

---

## 📈 Performance

### Optimizaciones Aplicadas
- StyleSheet.create() para compilación de estilos
- Componentes funcionales (mejor que class)
- Evitar renders innecesarios

### Optimizaciones Futuras
- React.memo() para componentes puros
- useMemo() para cálculos costosos
- useCallback() para funciones de evento
- FlatList para listas largas
- Lazy loading de rutas

---

## 🔐 Seguridad

### Implementado
- Context API para estado de auth
- Logout limpia sesión
- Rutas protegidas por rol

### Por Implementar
- JWT tokens
- Refresh token rotation
- HTTPS en producción
- Validación de entrada
- Sanitización de datos

---

## 📝 Documentación

Incluida en el proyecto:
1. **README.md** - Overview del proyecto
2. **QUICK_START.md** - Guía rápida
3. **RESUMEN_FINAL.md** - Resumen completo
4. **ARQUITECTURA.md** - Este documento
5. **Comentarios en código** - Documentación inline

---

## 🎯 Próximas Mejoras

### Corto Plazo
- [ ] Agregar validación de email
- [ ] Mejorar manejo de errores
- [ ] Agregar loading states
- [ ] Implementar refresco (pull-to-refresh)

### Mediano Plazo
- [ ] Integración con backend real
- [ ] Firebase authentication
- [ ] Firestore para datos
- [ ] Google Maps integration

### Largo Plazo
- [ ] Push notifications
- [ ] Real-time chat (WebSocket)
- [ ] Pagos integrados
- [ ] Analytics tracking
- [ ] Offline support

---

## 📞 Contacto

Para preguntas sobre la arquitectura, revisar los comentarios en el código o la documentación incluida.

---

**Arquitectura versión 1.0 - 2024**
