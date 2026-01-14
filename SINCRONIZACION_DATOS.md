## 📱 SINCRONIZACIÓN DE BASES DE DATOS - INSTRUCCIONES CRÍTICAS

### ⚠️ PROBLEMA ACTUAL
La app principal **MANOSPY2** y el admin-app no están compartiendo la misma base de datos. Los usuarios registrados en MANOSPY2 no aparecen en el admin-app.

---

### 🔧 SOLUCIÓN: USO DE AsyncStorage COMPARTIDO

Todas las apps deben usar **AsyncStorage** con la clave:
```
manospy_users_db_v1
```

---

### 📋 CHECKLIST - VERIFICAR EN MANOSPY2

Abre la app principal MANOSPY2 y verifica lo siguiente:

#### 1️⃣ Imports
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
```

#### 2️⃣ Guardar usuario al registrarse
Cuando un cliente o profesional se registre, el código debe hacer:

**Para clientes:**
```javascript
const registerClient = async (userData) => {
  try {
    // userData debe tener: name, email, phone, password, city
    const users = await AsyncStorage.getItem('manospy_users_db_v1');
    const usersList = users ? JSON.parse(users) : [];
    
    const newClient = {
      id: usersList.length > 0 ? Math.max(...usersList.map(u => u.id)) + 1 : 1,
      ...userData,
      role: 'client',
      blocked: false,
      createdAt: new Date().toISOString(),
    };
    
    usersList.push(newClient);
    await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(usersList));
    return newClient;
  } catch (error) {
    console.error('Error registrando cliente:', error);
  }
};
```

**Para profesionales:**
```javascript
const registerProfessional = async (userData) => {
  try {
    // userData debe tener: name, email, phone, password, specialty, city
    const users = await AsyncStorage.getItem('manospy_users_db_v1');
    const usersList = users ? JSON.parse(users) : [];
    
    const newProfessional = {
      id: usersList.length > 0 ? Math.max(...usersList.map(u => u.id)) + 1 : 1,
      ...userData,
      role: 'professional',
      verified: false,  // Pendiente de validación
      blocked: false,
      createdAt: new Date().toISOString(),
    };
    
    usersList.push(newProfessional);
    await AsyncStorage.setItem('manospy_users_db_v1', JSON.stringify(usersList));
    return newProfessional;
  } catch (error) {
    console.error('Error registrando profesional:', error);
  }
};
```

#### 3️⃣ Leer usuarios para el login
```javascript
const loginUser = async (email, password) => {
  try {
    const users = await AsyncStorage.getItem('manospy_users_db_v1');
    if (!users) return null;
    
    const usersList = JSON.parse(users);
    const user = usersList.find(u => u.email === email && u.password === password);
    return user || null;
  } catch (error) {
    console.error('Error en login:', error);
  }
};
```

---

### ✅ VERIFICACIÓN
Después de hacer estos cambios en MANOSPY2:

1. Registra un nuevo cliente con email `testclient@mail.com`
2. Registra un nuevo profesional con email `testpro@mail.com`
3. Abre la app admin-app (en http://localhost:8084)
4. Ve a la sección "Usuarios"
5. Deberías ver **ambos usuarios nuevos** en la lista

Si ves los usuarios nuevos → **✓ SINCRONIZACIÓN EXITOSA**

---

### 🔄 SINCRONIZACIÓN EN TIEMPO REAL
- El admin-app actualiza estadísticas **cada 3 segundos**
- Limpia automáticamente duplicados
- Valida integridad de datos
- Los cambios en MANOSPY2 aparecen inmediatamente en admin-app

---

### 🚨 ESTRUCTURA DE USUARIO REQUERIDA
```javascript
{
  id: number,                    // ID único auto-incrementado
  name: string,                  // Nombre completo
  email: string,                 // Email único
  phone: string,                 // Teléfono
  password: string,              // Contraseña (hash en producción)
  role: "client" | "professional",
  city: string,                  // Ciudad
  blocked: boolean,              // Bloqueado por admin
  verified: boolean,             // Solo para profesionales (aprobación)
  specialty: string,             // Solo para profesionales (plomería, etc)
  createdAt: string              // ISO date string
}
```

---

### 💡 NOTAS IMPORTANTES
- **Clave única:** `manospy_users_db_v1` (no cambiar)
- **Todos usan AsyncStorage:** MANOSPY2 + admin-app
- **El panel web viejo (MANOSPY_ADMIN)** usa localStorage separado
- **Sincronización automática** cada vez que se refresca el dashboard

---

### 📞 SI SIGUE SIN FUNCIONAR
1. Verifica que MANOSPY2 esté usando `AsyncStorage` (no `localStorage`)
2. Verifica que use la clave exacta: `manospy_users_db_v1`
3. Reinicia ambas apps (mata el terminal y vuelve a ejecutar)
4. Limpia los datos antiguos en AsyncStorage si es necesario
