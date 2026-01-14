Mock server local (JSON Server)

1) Instalación (si no lo tienes ya):

```bash
npm install
```

2) Ejecutar el mock-server:

```bash
npm run mock-server
```

Esto levantará un servidor en `http://localhost:3001` (por defecto) y servirá los endpoints REST basados en `mock-server/db.json`:

- `GET /professionals`
- `GET /professionals/1`
- `GET /requests`
- `GET /reservations`
- `GET /conversations`
- `GET /users`

3) Integración con la app:

- Copia `.env.example` a `.env` y deja `API_URL=http://localhost:3001`.
- En desarrollo web con Expo, puedes usar `process.env.API_URL` si cargas variables en el entorno antes de `npm run web`, por ejemplo:

```bash
set "API_URL=http://localhost:3001"; npm run web
```

En Windows PowerShell:

```powershell
$env:API_URL = "http://localhost:3001"
npm run web
```

4) Notas:
- `--delay 500` añade un retraso de 500ms para simular latencia.
- Si necesitas endpoints adicionales, edita `mock-server/db.json`.
