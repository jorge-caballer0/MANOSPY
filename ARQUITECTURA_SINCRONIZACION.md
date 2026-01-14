## ✅ ARQUITECTURA DE SINCRONIZACIÓN - LISTA PARA USAR

### Sistema operativo:

```
                          ┌─────────────────────────────┐
                          │  Servidor Sincronización    │
                          │  (Node.js + Express)        │
                          │  :5555                      │
                          └────────────┬────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
         ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
         │   MANOSPY2       │ │   admin-app      │ │   Datos Prueba   │
         │   (RN Native)    │ │   (RN Web)       │ │   (Demo)         │
         │   :8081          │ │   :8082          │ │                  │
         └──────────────────┘ └──────────────────┘ └──────────────────┘
              │                      │
              │ POST /api/sync/user  │ GET /api/sync/users
              │ (nuevo usuario)      │ (cada 3 segundos)
              └──────────┬───────────┘
                         │
                    Sincronizado
```

### Flujo de datos:

1. **Usuario se registra en MANOSPY2**
   - Guarda en AsyncStorage local (React Native)
   - Ejecuta `syncNewUser()` → POST http://localhost:5555/api/sync/user

2. **Servidor recibe usuario**
   - Guarda en BD en memoria
   - Responde OK

3. **admin-app lee cada 3 segundos**
   - Ejecuta `syncDataFromServer()` → GET http://localhost:5555/api/sync/users
   - Actualiza AsyncStorage local
   - Dashboard se refresca automáticamente

### URLs para usar:

| App | URL | Propósito |
|-----|-----|-----------|
| **Servidor de sincronización** | http://localhost:5555 | Central de datos |
| **MANOSPY2** | http://localhost:8081 | Registrar usuarios |
| **admin-app** | http://localhost:8082 | Ver y gestionar usuarios |

### Endpoints del servidor:

```
GET  /api/sync/users              - Obtener todos los usuarios
POST /api/sync/user               - Crear/actualizar un usuario
POST /api/sync/users              - Sincronizar array completo
GET  /api/sync/stats              - Estadísticas
GET  /health                      - Verificar servidor
```

### Cómo funciona:

**MANOSPY2 (Registro):**
```
Usuario registra → AuthContext.register()
                → Guarda en AsyncStorage local
                → Llama syncNewUser(usuario)
                → POST a servidor:5555
                → ✅ Listo
```

**admin-app (Lectura):**
```
Inicia AdminDashboard
  → startDataSync()
  → Cada 3 segundos: syncDataFromServer()
  → GET servidor:5555/api/sync/users
  → Actualiza AsyncStorage local
  → Refresca Dashboard automáticamente
  → ✅ Ver usuario nuevo en 3-5 segundos
```

### Pasos para probar:

1. ✅ Servidor de sincronización corre en :5555
2. ✅ MANOSPY2 corre en :8081
3. ✅ admin-app corre en :8082

**Ahora:**
1. Abre http://localhost:8082 (admin-app)
2. Deberías ver 4 usuarios de prueba
3. Abre http://localhost:8081 en otra pestaña (MANOSPY2)
4. Registra un nuevo cliente o profesional
5. Vuelve a admin-app y verás el nuevo usuario en 3-5 segundos

### Importante:

- El servidor sincronización mantiene los datos en memoria
- Si reinicias el servidor, se pierden los cambios recientes
- Pero siempre hay 4 usuarios de prueba
- La BD real se guarda también en AsyncStorage de cada app (respaldo local)

### Archivos modificados:

✅ `src/context/AuthContext.js` - Ahora sincroniza con servidor
✅ `src/utils/syncService.js` - Cliente HTTP para MANOSPY2
✅ `admin-app/src/utils/dataService.js` - Lee del servidor
✅ `admin-app/src/utils/serverSync.js` - Cliente HTTP para admin-app
✅ `admin-app/src/screens/AdminDashboard.js` - Actualizado para sincronización
✅ `sync-server.js` - Nuevo servidor central

---

## 🎯 ESTADO: LISTO PARA USAR

El sistema de sincronización está completamente operativo.

**Prueba ahora abriendo:**
- admin-app: http://localhost:8082
- MANOSPY2: http://localhost:8081
