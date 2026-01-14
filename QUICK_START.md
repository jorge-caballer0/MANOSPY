# Guía Rápida de ManosPy

## 🎬 Primeros pasos

### Iniciar la aplicación
```bash
npm start
```

Selecciona la plataforma:
- `w` para abrir en navegador web
- `a` para Android
- `i` para iOS

### En el navegador
1. Se abrirá en http://localhost:8081

## 👥 Usuarios de prueba

### Cliente
- Email: cliente@test.com
- Contraseña: cualquier contraseña

### Profesional  
- Email: pro@test.com
- Contraseña: cualquier contraseña

## 🗂 Estructura de Archivos

### Pantallas Cliente (`src/screens/client/`)
- **ClientScreens.js**: Contiene todas las pantallas del cliente
  - ClientLoginScreen: Login del cliente
  - ClientHomeScreen: Inicio con categorías
  - ClientSearchScreen: Búsqueda y filtros
  - ClientReservationsScreen: Mis reservas
  - ClientChatScreen: Mensajes
  - ClientProfileScreen: Perfil de usuario
  - RequestServiceScreen: Solicitar servicio
  - ProfessionalDetailScreen: Ver perfil profesional
  - ChatDetailScreen: Conversación individual

### Pantallas Profesional (`src/screens/professional/`)
- **ProfessionalScreens.js**: Contiene todas las pantallas del profesional
  - ProfessionalOnboardingScreen: Setup inicial (4 pasos)
  - ProfessionalHomeScreen: Dashboard/Inicio
  - ProfessionalRequestsScreen: Solicitudes nuevas
  - ProfessionalAgendaScreen: Calendario de servicios
  - ProfessionalChatScreen: Mensajes
  - ProfessionalProfileScreen: Perfil profesional

### Componentes (`src/components/`)
- **Button.js**: Botones con variantes (primary, secondary, ghost, danger, success)
- **Card.js**: Contenedor elevado con estilos
- **Avatar.js**: Avatar circular con iniciales
- **Badge.js**: Etiquetas de estado
- **Header.js**: Encabezado con botón atrás

### Constantes (`src/constants/`)
- **theme.js**: Colores, espaciado, radios, tamaños, sombras
- **categories.js**: 18 categorías de servicios con iconos

### Contexto (`src/context/`)
- **AuthContext.js**: Gestión de autenticación y rol

### Navegación (`src/navigation/`)
- **RootNavigator.js**: Flujo de navegación principal
  - Usa Stack Navigator para flujo auth
  - Usa Bottom Tabs para navegación principal

## 🎨 Sistema de Diseño

### Colores
```javascript
COLORS.client = '#0B84FF'      // Azul para cliente
COLORS.professional = '#2ECC71' // Verde para profesional
COLORS.primary = '#0B84FF'     // Primario general
COLORS.success = '#10B981'     // Verde éxito
COLORS.warning = '#F59E0B'     // Naranja alerta
COLORS.danger = '#EF4444'      // Rojo peligro
```

### Espaciado
```javascript
SPACING = {
  xs: 4,   // 4px
  sm: 8,   // 8px
  md: 16,  // 16px
  lg: 24,  // 24px
  xl: 32   // 32px
}
```

### Componentes de Botón
```jsx
// Primario (azul)
<Button title="Aceptar" onPress={handlePress} />

// Secundario (borde)
<Button variant="secondary" title="Cancelar" onPress={handlePress} />

// Peligro (rojo)
<Button variant="danger" title="Eliminar" onPress={handlePress} />

// Éxito (verde)
<Button variant="success" title="Confirmar" onPress={handlePress} />
```

## 🔄 Flujos de Navegación

### Cliente
```
RoleSelection 
  → ClientLogin 
  → ClientHome (Tabs)
      ├─ Inicio
      ├─ Buscar → ProfessionalDetail
      ├─ Solicitar (Modal/Screen)
      ├─ Reservas
      ├─ Chat → ChatDetail
      └─ Perfil
```

### Profesional
```
RoleSelection
  → ProfessionalOnboarding (4 pasos)
  → ProfessionalHome (Tabs)
      ├─ Inicio
      ├─ Solicitudes
      ├─ Agenda
      ├─ Chat → ChatDetail
      └─ Perfil
```

## 📱 Resoluciones de pantalla soportadas

- Android: 360px - 1440px
- iOS: 375px - 812px
- Web: 320px - 2560px

## 🧪 Modo de prueba

Todas las pantallas tienen datos mock. Para agregar datos reales:

1. Conectar API backend en `src/services/index.js`
2. Reemplazar datos mock con llamadas a API
3. Manejar errores de red
4. Agregar loading states

## 🐛 Debug

### Habilitar debug de navegación
```javascript
// En RootNavigator.js, agregar:
<NavigationContainer
  onReady={() => navigationRef.isReady = true}
  linking={linking}
>
```

### Ver errores en consola
```bash
# En el servidor Expo
- Presiona `j` para abrir debugger
- Presiona `m` para ver más herramientas
```

## 📝 Convenciones

- **Imports**: Destructured desde index files
- **Nombres de componentes**: PascalCase
- **Nombres de funciones**: camelCase
- **Estilos**: StyleSheet.create() al final del archivo
- **Props**: Tipado en comentarios JSDoc

## 🚀 Optimizaciones futuras

1. Memoizar componentes con React.memo()
2. Usar FlatList para listas largas
3. Implementar virtualización
4. Agregar error boundaries
5. Cachear imágenes
6. Lazy loading de rutas

## 📞 Soporte

Para reportar issues o sugerencias, contacta al equipo de desarrollo.

---

Última actualización: 2024
