# 🛠️ GUÍA DE CONFIGURACIÓN Y DESPLIEGUE

## ✅ Requisitos Previos

- Node.js v16+ instalado
- npm o yarn
- Expo CLI (instalado vía npm)
- Editor de código (VS Code recomendado)

## 📦 Instalación Inicial

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd c:\Users\ACER2025\Documents\MANOSPY2
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Instalar dependencias de web (opcional)
```bash
npx expo install react-dom react-native-web
```

### 4. Verificar instalación
```bash
npm list
```

Debería mostrar todas las dependencias sin errores.

---

## 🚀 Ejecutar Localmente

### Opción 1: Web (Recomendado para desarrollo)
```bash
npm run web
```
Se abrirá en http://localhost:8081

### Opción 2: Android
```bash
npm run android
# Requiere Android Studio instalado
```

### Opción 3: iOS
```bash
npm run ios
# Solo en macOS
```

### Opción 4: Expo Go (Universal)
```bash
npm start
# Escanear QR con Expo Go app
```

---

## 🎨 Configuración de Temas

### Cambiar color primario
En `src/constants/theme.js`:
```javascript
export const COLORS = {
  primary: '#0B84FF',    // Cambiar este valor
  // ...
};
```

### Cambiar espaciado
En `src/constants/theme.js`:
```javascript
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,    // Aumentar/disminuir estos valores
  lg: 24,
  xl: 32
};
```

---

## 🔑 Variables de Entorno

Crear archivo `.env` (si es necesario):
```
API_URL=http://localhost:3000
AUTH_TOKEN_KEY=auth_token
```

Acceder desde código:
```javascript
import { API_URL } from '@env';
```

---

## 🧩 Agregar Nueva Pantalla

### 1. Crear archivo de pantalla
```javascript
// src/screens/client/MyNewScreen.js
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { COLORS } from '../../constants';

export const MyNewScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Text>Mi nueva pantalla</Text>
    </SafeAreaView>
  );
};
```

### 2. Exportar desde index
```javascript
// src/screens/client/index.js
export { MyNewScreen } from './ClientScreens';  // o crear archivo nuevo
```

### 3. Agregar a navegación
```javascript
// src/navigation/RootNavigator.js
<Tab.Screen name="MyNew" component={MyNewScreen} />
```

---

## 🔧 Agregar Nuevo Componente

### 1. Crear componente
```javascript
// src/components/MyComponent.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants';

export const MyComponent = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface
  }
});
```

### 2. Exportar desde index
```javascript
// src/components/index.js
export { MyComponent } from './MyComponent';
```

### 3. Usar en pantalla
```javascript
import { MyComponent } from '../../components';

export const SomeScreen = () => {
  return (
    <MyComponent title="Hola" />
  );
};
```

---

## 🐛 Debugging

### Habilitar console logs
```javascript
// En cualquier archivo
console.log('Debug info:', value);
```

### Ver logs en web
- Abrir DevTools (F12)
- Ir a Console tab
- Buscar los logs

### Ver logs en mobile
```bash
npm start
# Presionar 'j' para abrir debugger
```

### Usar React DevTools
```bash
npm install --save-dev @react-devtools/core
```

---

## 🔄 Flujo de Actualización

### Cambios en código
1. Hacer cambios en archivos
2. La app recarga automáticamente (en desarrollo)
3. Si no recarga, presionar `r` en terminal

### Cambios en dependencias
1. Editar `package.json`
2. Ejecutar `npm install`
3. Reiniciar servidor (Ctrl+C y `npm run web`)

---

## 🚢 Preparar para Producción

### 1. Build para web
```bash
expo export --platform web
```

Genera carpeta `dist/` lista para deployment.

### 2. Optimizar
- Revisar bundle size
- Remover console.logs
- Optimizar imágenes

### 3. Deploy a Netlify/Vercel
```bash
# Vercel
vercel dist/

# Netlify
netlify deploy --prod --dir dist/
```

### 4. Build para mobile
```bash
# Android (requiere Android Studio)
eas build --platform android

# iOS (requiere cuenta Apple)
eas build --platform ios
```

---

## 📊 Monitoreo

### Logs en producción
Usar servicio como:
- Sentry (errores)
- LogRocket (sessions)
- Google Analytics (eventos)

### Implementar
```javascript
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: "YOUR_DSN",
  enableInExpoDevelopment: true,
});
```

---

## 📱 Testing en Dispositivos

### Android
1. Instalar Android Studio
2. Crear emulador virtual
3. Conectar dispositivo física (USB debug activado)
4. Ejecutar `npm run android`

### iOS
1. Instalar Xcode (macOS)
2. Abrir simulador
3. Ejecutar `npm run ios`

### Web
- Usar Chrome DevTools
- Usar responsive design mode
- Probar en diferentes navegadores

---

## 🔒 Seguridad

### Checklist
- [ ] No guardar tokens en localStorage
- [ ] Usar HTTPS en producción
- [ ] Validar inputs en cliente y servidor
- [ ] Sanitizar datos en outputs
- [ ] No exponar variables sensibles en código
- [ ] Usar .env para secrets
- [ ] Implementar CORS correctamente

---

## 📈 Escalabilidad

### Cuando crecer
- Separar lógica en custom hooks
- Usar Redux/Zustand si state es complejo
- Implementar pagination en listas
- Lazy load rutas/componentes
- Usar CDN para assets
- Implementar caching

---

## 🆘 Troubleshooting

### Error: "Cannot find module"
```bash
npm install
# O eliminar node_modules y reinstalar
rm -rf node_modules
npm install
```

### Metro bundler no inicia
```bash
npm start -- --reset-cache
```

### Puerto 8081 en uso
```bash
npm start -- --port 8082
# O matar proceso que usa puerto
npx fkill :8081
```

### Componente no renderiza
- Revisar imports
- Verificar StyleSheet
- Buscar errores en console
- Revisar navegación

---

## 📚 Recursos Útiles

- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [Expo Docs](https://docs.expo.dev)
- [React Native StyleSheet](https://reactnative.dev/docs/stylesheet)
- [Expo Vector Icons](https://icons.expo.fyi/)

---

## ✅ Checklist de Despliegue

- [ ] Código testeado localmente
- [ ] Console.logs removidos
- [ ] Errores manejados
- [ ] Variables de entorno configuradas
- [ ] Build ejecutado sin errores
- [ ] Bundle size revisado
- [ ] Performance aceptable
- [ ] Documentación actualizada
- [ ] Versión incrementada en app.json
- [ ] Changelog preparado

---

## 📞 Soporte

Para problemas específicos:
1. Revisar la documentación
2. Buscar en Stack Overflow
3. Revisar issues en GitHub
4. Contactar equipo de desarrollo

---

**Última actualización: 2024**
