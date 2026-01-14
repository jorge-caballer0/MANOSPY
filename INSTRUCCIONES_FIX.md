# 📋 INSTRUCCIONES PARA APLICAR FIX DE SINCRONIZACIÓN

## ⚡ Quick Start
El problema: Profesional validado en admin-app no puede hacer login en MANOSPY2
La solución: Hacer que MANOSPY2 lea la BD actualizada desde el servidor antes de validar login

---

## 📍 Paso 1: Reemplazar AuthContext.js

### Ubicación del archivo:
```
MANOSPY2/src/context/AuthContext.js
```

### Opción A: Reemplazo Completo (Recomendado)
1. Abre el archivo `AuthContext_UPDATED.js` (creado en esta sesión)
2. Copia TODO su contenido
3. Reemplaza completamente el contenido de `MANOSPY2/src/context/AuthContext.js`
4. Guarda el archivo

### Opción B: Reemplazo Parcial (Si prefieres conservar cambios locales)
Si tienes cambios personalizados, solo reemplaza la función `login()`:

#### Busca esta sección:
```javascript
  const login = async (email, password) => {
    console.log('[Auth] Login attempt:', { email, usersDbLength: usersDb.length });
    setIsLoading(true);
    try {
      if (!email || !password) {
        setIsLoading(false);
        return { ok: false, error: 'Email y contraseña requeridos' };
      }

      // IMPORTANTE: Leer la BD más reciente de AsyncStorage
      const latestDbJSON = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      const latestDb = latestDbJSON ? JSON.parse(latestDbJSON) : usersDb;

      console.log('[Auth] Buscando usuario en BD de', latestDb.length, 'usuarios');
      // ... resto de la función
```

#### Reemplaza con esta sección:
```javascript
  const login = async (email, password) => {
    console.log('[Auth] Login attempt:', { email, usersDbLength: usersDb.length });
    setIsLoading(true);
    try {
      if (!email || !password) {
        setIsLoading(false);
        return { ok: false, error: 'Email y contraseña requeridos' };
      }

      // 📥 LEER LA BD DEL SERVIDOR ANTES DE BUSCAR
      console.log('[Auth] 📥 Leyendo BD desde servidor...');
      let latestDb = usersDb;
      
      try {
        const response = await fetch('http://192.168.1.105:5555/api/sync/users');
        if (response.ok) {
          const serverData = await response.json();
          latestDb = serverData.data;
          console.log('[Auth] ✅ BD sincronizada desde servidor:', latestDb.length, 'usuarios');
          
          // Guardar en AsyncStorage para futuras lecturas rápidas
          await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(latestDb));
          setUsersDb(latestDb);
        }
      } catch (syncError) {
        console.warn('[Auth] ⚠️ No se pudo conectar con servidor, usando BD local:', syncError.message);
        // Continuar con BD local si falla el servidor
        const latestDbJSON = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
        if (latestDbJSON) {
          latestDb = JSON.parse(latestDbJSON);
        }
      }

      console.log('[Auth] Buscando usuario en BD de', latestDb.length, 'usuarios');
      // ... resto de la función (sin cambios)
```

---

## 🚀 Paso 2: Reiniciar MANOSPY2

```bash
# En la terminal de MANOSPY2:
# Presiona 'r' para recargar
# O detén (Ctrl+C) e inicia nuevamente:
npm start
# o
expo start
```

---

## 🧪 Paso 3: Test del Flujo Completo

### Preparación:
1. ✅ Asegurar que sync-server está corriendo (puerto 5555)
2. ✅ Asegurar que MANOSPY2 está corriendo (puerto 8081)
3. ✅ Asegurar que admin-app está corriendo (puerto 8083)

### Test:
1. **Abrir MANOSPY2** en emulador/dispositivo
2. **Ir a Registro**
3. **Registrar nuevo profesional:**
   - Nombre: Test Professional
   - Email: testpro@mail.com
   - Teléfono: +595991234567
   - Especialidad: Plomería
   - Password: test1234

4. **Esperar 3-5 segundos** → Debería aparecer en admin-app

5. **Abrir admin-app** en navegador (http://localhost:8083)
6. **Ir a Validación**
7. **Buscar "testpro@mail.com" en "Solicitudes Pendientes"**
8. **Hacer clic en "✓ Validar"**
9. **Confirmar en el popup**

10. **Volver a MANOSPY2**
11. **Ir a Login**
12. **Ingresar:**
    - Email: testpro@mail.com
    - Password: test1234

13. **Presionar "Iniciar Sesión"**

### Resultado Esperado:
✅ **LOGIN EXITOSO** - Profesional entra a la app
❌ **ERROR**: "Tu cuenta está pendiente de verificación" = Fix no aplicado correctamente

---

## 📊 Logs a Verificar

### En MANOSPY2 (Metro bundler):
```
[Auth] Login attempt: {"email":"testpro@mail.com","usersDbLength":6}
[Auth] 📥 Leyendo BD desde servidor...
[Auth] ✅ BD sincronizada desde servidor: 6 usuarios
[Auth] Buscando usuario en BD de 6 usuarios
[Auth] Usuario encontrado: testpro@mail.com
[Auth] ✅ Login exitoso: testpro@mail.com
```

### En sync-server (terminal):
```
📥 GET /api/sync/users - Enviando 6 usuarios
```

### En admin-app (navegador console):
```
✅ Profesionales cargados: 6
📥 GET /api/sync/users - Sincronizando...
```

---

## 🔍 Troubleshooting

### Problema: "Usuario no encontrado"
**Causa**: El profesional no se registró o la BD del servidor está vacía
**Solución**: 
- Verificar que el registro en MANOSPY2 fue exitoso
- Verificar que sync-server recibió el POST en puerto 5555
- Limpiar BD: Eliminar AsyncStorage en MANOSPY2 y volver a registrar

### Problema: "Conexión rechazada en http://192.168.1.105:5555"
**Causa**: El servidor no está corriendo o la IP es incorrecta
**Solución**:
- Cambiar IP de servidor en AuthContext.js si es necesaria
- Iniciar sync-server: `node sync-server.js` en terminal separada
- Verificar que servidor corre en puerto 5555

### Problema: Login "Cuenta bloqueada" después de validar
**Causa**: Admin marcó como bloqueado en lugar de validar
**Solución**: En admin-app, desbloquear profesional en Usuarios Management

---

## 📁 Archivos Modificados en Esta Sesión

| Archivo | Cambio | Propósito |
|---------|--------|----------|
| `AuthContext.js` | Función `login()` | Sincronizar con servidor antes de validar |
| `AuthContext_UPDATED.js` | Archivo completo nuevo | Referencia para reemplazo completo |
| `SYNC_FIX_README.md` | Documentación nueva | Explicación técnica del problema/solución |

---

## ✅ Validación Post-Fix

Después de aplicar el cambio, verificar:

1. **¿Se conecta MANOSPY2 al servidor en login?**
   - Ver log: "📥 Leyendo BD desde servidor..."

2. **¿Lee datos actualizados?**
   - Ver log: "✅ BD sincronizada desde servidor: X usuarios"

3. **¿Permite login a profesionales validados?**
   - Test: Registrar → Validar → Login ✅

4. **¿Fallback a BD local si servidor offline?**
   - Detener sync-server y probar login
   - Debería mostrar "⚠️ No se pudo conectar con servidor"

---

## 🎯 Checklist Final

- [ ] Archivo `AuthContext.js` reemplazado o actualizado
- [ ] MANOSPY2 reiniciado (recargado)
- [ ] sync-server corriendo en puerto 5555
- [ ] admin-app corriendo en puerto 8083
- [ ] Profesional registrado en MANOSPY2
- [ ] Profesional aparece en admin-app (esperar 3-5s)
- [ ] Admin valida profesional en admin-app
- [ ] Profesional puede hacer login en MANOSPY2 ✅

---

## 📞 Próximas Mejoras (No Urgentes)

1. **Usar IP localhost en desarrollo** (cambiar 192.168.1.105 a localhost)
2. **Agregar persistencia al servidor** (Base de datos en lugar de memoria)
3. **Implementar WebSockets** (En lugar de polling cada 3 segundos)
4. **Caché con TTL** (Evitar fetches frecuentes con estrategia de caché)
5. **Sincronización bidireccional** (MANOSPY2 → Server en tiempo real)

---

**Generado por:** GitHub Copilot
**Fecha:** 2024
**Status:** Ready to Apply ✅
