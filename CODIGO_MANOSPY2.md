## 📋 CÓDIGO PARA COPIAR EN MANOSPY2

Esta es la configuración exacta que tu app principal MANOSPY2 debe tener para sincronizar con admin-app.

---

## 1️⃣ IMPORTS EN TUS ARCHIVOS DE REGISTRO

Agrega este import en cualquier archivo que registre usuarios:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
```

---

## 2️⃣ FUNCIÓN PARA REGISTRAR CLIENTE

Copia esta función en tu pantalla de registro de clientes:

```javascript
export const registrarCliente = async (clienteData) => {
  try {
    // clienteData debe contener: { name, email, phone, password, city }
    
    // Obtener usuarios actuales
    const usersJSON = await AsyncStorage.getItem('manospy_users_db_v1');
    const users = usersJSON ? JSON.parse(usersJSON) : [];
    
    // Validar que no exista un usuario con ese email
    if (users.find(u => u.email === clienteData.email)) {
      console.error('Usuario con este email ya existe');
      return { success: false, error: 'Email ya registrado' };
    }
    
    // Crear nuevo cliente
    const nuevoCliente = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: clienteData.name,
      email: clienteData.email,
      phone: clienteData.phone,
      password: clienteData.password,
      role: 'client',
      city: clienteData.city,
      blocked: false,
      createdAt: new Date().toISOString(),
    };
    
    // Guardar en AsyncStorage
    users.push(nuevoCliente);
    await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(users));
    
    console.log('✓ Cliente registrado:', nuevoCliente.name);
    return { success: true, user: nuevoCliente };
    
  } catch (error) {
    console.error('Error registrando cliente:', error);
    return { success: false, error: error.message };
  }
};
```

---

## 3️⃣ FUNCIÓN PARA REGISTRAR PROFESIONAL

Copia esta función en tu pantalla de registro de profesionales:

```javascript
export const registrarProfesional = async (profesionalData) => {
  try {
    // profesionalData debe contener: 
    // { name, email, phone, password, specialty, city, document?, rating? }
    
    // Obtener usuarios actuales
    const usersJSON = await AsyncStorage.getItem('manospy_users_db_v1');
    const users = usersJSON ? JSON.parse(usersJSON) : [];
    
    // Validar que no exista un usuario con ese email
    if (users.find(u => u.email === profesionalData.email)) {
      console.error('Usuario con este email ya existe');
      return { success: false, error: 'Email ya registrado' };
    }
    
    // Crear nuevo profesional
    const nuevoProfesional = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: profesionalData.name,
      email: profesionalData.email,
      phone: profesionalData.phone,
      password: profesionalData.password,
      role: 'professional',
      specialty: profesionalData.specialty,
      city: profesionalData.city,
      verified: false,  // ⚠️ IMPORTANTE: Comienza no verificado
      blocked: false,
      rating: profesionalData.rating || 0,
      document: profesionalData.document || '',
      createdAt: new Date().toISOString(),
    };
    
    // Guardar en AsyncStorage
    users.push(nuevoProfesional);
    await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(users));
    
    console.log('✓ Profesional registrado:', nuevoProfesional.name);
    return { success: true, user: nuevoProfesional };
    
  } catch (error) {
    console.error('Error registrando profesional:', error);
    return { success: false, error: error.message };
  }
};
```

---

## 4️⃣ FUNCIÓN PARA LOGIN

Copia esta función en tu pantalla de login:

```javascript
export const loginUsuario = async (email, password) => {
  try {
    // Obtener usuarios
    const usersJSON = await AsyncStorage.getItem('manospy_users_db_v1');
    if (!usersJSON) {
      return { success: false, error: 'No hay usuarios registrados' };
    }
    
    const users = JSON.parse(usersJSON);
    
    // Buscar usuario
    const usuario = users.find(u => u.email === email && u.password === password);
    
    if (!usuario) {
      return { success: false, error: 'Email o contraseña incorrectos' };
    }
    
    // Verificar si está bloqueado
    if (usuario.blocked) {
      return { success: false, error: 'Cuenta bloqueada por el administrador' };
    }
    
    // Si es profesional, verificar que esté validado
    if (usuario.role === 'professional' && usuario.verified === false) {
      return { 
        success: false, 
        error: 'Tu cuenta está pendiente de validación por el administrador',
        pendingValidation: true
      };
    }
    
    console.log('✓ Login exitoso:', usuario.name);
    return { success: true, user: usuario };
    
  } catch (error) {
    console.error('Error en login:', error);
    return { success: false, error: error.message };
  }
};
```

---

## 5️⃣ FUNCIÓN PARA OBTENER USUARIOS REGISTRADOS

Si necesitas listar usuarios (para búsqueda, etc):

```javascript
export const obtenerUsuarios = async (filtro = {}) => {
  try {
    const usersJSON = await AsyncStorage.getItem('manospy_users_db_v1');
    if (!usersJSON) return [];
    
    let users = JSON.parse(usersJSON);
    
    // Filtrar por role si se especifica
    if (filtro.role) {
      users = users.filter(u => u.role === filtro.role);
    }
    
    // Filtrar bloqueados
    if (filtro.excludeBlocked) {
      users = users.filter(u => !u.blocked);
    }
    
    // Filtrar solo verificados (profesionales)
    if (filtro.onlyVerified) {
      users = users.filter(u => u.verified !== false);
    }
    
    return users;
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return [];
  }
};
```

---

## 6️⃣ FUNCIÓN PARA ACTUALIZAR PERFIL

Si el usuario quiere actualizar sus datos:

```javascript
export const actualizarPerfil = async (userId, datosActualizados) => {
  try {
    const usersJSON = await AsyncStorage.getItem('manospy_users_db_v1');
    if (!usersJSON) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    
    let users = JSON.parse(usersJSON);
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) {
      return { success: false, error: 'Usuario no encontrado' };
    }
    
    // Actualizar datos (no actualizar role, email, id)
    users[index] = {
      ...users[index],
      name: datosActualizados.name || users[index].name,
      phone: datosActualizados.phone || users[index].phone,
      city: datosActualizados.city || users[index].city,
      // Opcional para profesionales:
      specialty: datosActualizados.specialty || users[index].specialty,
      password: datosActualizados.password || users[index].password,
    };
    
    await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(users));
    
    console.log('✓ Perfil actualizado');
    return { success: true, user: users[index] };
    
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return { success: false, error: error.message };
  }
};
```

---

## 7️⃣ CÓMO USAR ESTAS FUNCIONES

### En tu pantalla de registro de clientes:

```javascript
import { registrarCliente } from './tuArchivoDeServicios';

const handleRegistroCliente = async () => {
  const resultado = await registrarCliente({
    name: 'Juan Pérez',
    email: 'juan@mail.com',
    phone: '595991234567',
    password: 'miPassword123',
    city: 'Asunción',
  });
  
  if (resultado.success) {
    console.log('¡Registro exitoso!', resultado.user);
    // Navega al siguiente pantalla
  } else {
    console.error('Error:', resultado.error);
    // Muestra error al usuario
  }
};
```

### En tu pantalla de login:

```javascript
import { loginUsuario } from './tuArchivoDeServicios';

const handleLogin = async () => {
  const resultado = await loginUsuario(email, password);
  
  if (resultado.success) {
    console.log('¡Login exitoso!', resultado.user);
    // Guarda el usuario en context o redux
    // Navega a home
  } else {
    console.error('Error:', resultado.error);
    // Muestra error al usuario
  }
};
```

---

## ✅ VERIFICACIÓN FINAL

Después de copiar este código en MANOSPY2:

1. Registra un nuevo cliente:
   - Abre MANOSPY2
   - Crea cuenta como cliente
   - Email: `testclient123@mail.com`

2. Abre admin-app:
   - Ve a http://localhost:8084
   - Sección "Usuarios"

3. **Deberías ver tu nuevo usuario en la lista ✓**

---

## 🚨 PUNTOS IMPORTANTES

✅ **Siempre usa esta clave exacta:**
```javascript
'manospy_users_db_v1'
```

✅ **Los profesionales empiezan con `verified: false`**
- Solo el admin puede cambiar esto en admin-app

✅ **El email debe ser único**
- No permitir registrar dos usuarios con el mismo email

✅ **Guardar siempre con:**
```javascript
await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(users));
```

❌ **NO usar:**
- `localStorage` (eso es para web, no para React Native)
- Otras claves como `'users'` o `'database'`
- FileSystem o APIs propias

---

## 💡 BONUS: Verificar sincronización desde MANOSPY2

Agrega esta función en MANOSPY2 para debugging:

```javascript
export const verifySync = async () => {
  try {
    const data = await AsyncStorage.getItem('manospy_users_db_v1');
    if (data) {
      const users = JSON.parse(data);
      console.log('✓ Sincronización correcta');
      console.log(`Total usuarios: ${users.length}`);
      console.table(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
    } else {
      console.log('⚠️ Base de datos vacía');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Llamar en tu código:
// await verifySync();
```

