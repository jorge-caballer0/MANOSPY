# ManosPy - Plataforma de Servicios

Una aplicación React Native profesional para conectar clientes con profesionales de servicios.

## 🎯 Características

### Cliente
- 📍 Buscar servicios por categoría, ubicación y rating
- 📝 Solicitar servicios urgentes o programados
- 💬 Mensajería en tiempo real con profesionales
- 📋 Gestión de reservas y historial
- ⭐ Sistema de reseñas y valoraciones
- 👤 Perfil personalizado

### Profesional
- 📥 Recibir y gestionar solicitudes de servicio
- 📅 Gestión completa de agenda
- 💰 Seguimiento de ingresos y estadísticas
- 💬 Mensajería bidireccional con clientes
- 🏆 Perfil profesional con especialidades y certificados
- ✓ Verificación y distintivos premium

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd manospy2

# Instalar dependencias
npm install

# Instalar dependencias de web (opcional)
npx expo install react-dom react-native-web
```

## 🏃 Ejecución

```bash
# Iniciar en desarrollo (selecciona plataforma)
npm start

# Web
npm run web

# Android
npm run android

# iOS
npm run ios
```

## 📁 Estructura del Proyecto

```
src/
├── constants/          # Tema, categorías, constantes
├── context/            # Contexto de autenticación
├── screens/
│   ├── auth/          # Pantallas de autenticación
│   ├── client/        # Pantallas del cliente
│   └── professional/  # Pantallas del profesional
├── components/        # Componentes reutilizables
├── navigation/        # Navegación de la app
├── services/          # Servicios API
└── utils/             # Utilidades
```

## 🎨 Diseño

- **Colores Cliente**: Azul (#0B84FF)
- **Colores Profesional**: Verde (#2ECC71)
- **Pantallas**: 14 pantallas totales
- **Componentes**: Button, Card, Avatar, Badge, Header

## 📱 Flujos Principales

### Cliente
1. Seleccionar rol → Login → Inicio
2. Explorar servicios → Filtrar → Ver detalles profesional
3. Solicitar servicio → Cargar fotos → Confirmar → Chat
4. Ver reservas → Mensajes → Reseñas

### Profesional
1. Seleccionar rol → Onboarding (4 pasos) → Dashboard
2. Recibir solicitudes → Aceptar → Chat → Ejecutar
3. Agenda → Confirmar → Marcar completo
4. Ver estadísticas → Gestionar perfil

## 🔐 Autenticación

- Sistema basado en Context API
- Roles: Client / Professional
- Persistencia de sesión
- Logout disponible

## 🎭 Pantallas Principales

### Cliente (6 pantallas + detalle)
1. **Home** - Categorías y profesionales destacados
2. **Buscar** - Filtros avanzados y resultados
3. **Solicitar** - Flujo de solicitud 3 pasos
4. **Reservas** - Gestión de reservaciones
5. **Chat** - Mensajería con profesionales
6. **Perfil** - Información y preferencias
7. **Detalles Profesional** - Perfil completo

### Profesional (5 pantallas)
1. **Home** - Dashboard con estadísticas
2. **Solicitudes** - Nuevas solicitudes incientes
3. **Agenda** - Calendario de servicios
4. **Chat** - Conversaciones activas
5. **Perfil** - Perfil profesional

### Compartidas
- **Detalles Chat** - Conversación individual
- **Autenticación** - Login, registro, onboarding

## 📦 Dependencias Principales

```json
{
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo": "~54.0.31",
  "@react-navigation/native": "^7.1.27",
  "@react-navigation/native-stack": "^7.6.14",
  "@react-navigation/bottom-tabs": "^7.9.1",
  "@expo/vector-icons": "^15.0.3"
}
```

## 🚧 Próximos Pasos

- [ ] Integración con backend real
- [ ] Autenticación con Firebase
- [ ] Integración de Google Maps
- [ ] Pagos en línea
- [ ] Push notifications
- [ ] Sistema de calificación avanzado
- [ ] Validación de documentos

## 📝 Notas de Desarrollo

- La app usa Context API para gestión de estado
- Componentes funcionales con Hooks
- Estilos con StyleSheet de React Native
- Iconos de Expo Vector Icons (Ionicons)
- Navegación con React Navigation v6

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, crea un fork y abre un pull request.

## 📄 Licencia

MIT

---

Desarrollo: Plataforma ManosPy
Última actualización: 2024
