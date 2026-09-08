# Consulta de Riesgo Financiero

MVP de consulta de score crediticio por RUT con autenticación JWT y control de acceso por roles.

## Stack

- **Backend:** Node.js + TypeScript + Express
- **Frontend:** React + TypeScript + Vite

## Instalación y ejecución

### Backend

```bash
cd backend
cp .env.example .env   # En Windows: Copy-Item .env.example .env
npm install
npm run dev
```

API disponible en `http://localhost:4000`

### Frontend

```bash
cd frontend
cp .env.example .env   # En Windows: Copy-Item .env.example .env
npm install
npm run dev
```

App disponible en `http://localhost:5173`

### Tests

```bash
cd backend
npm test
```

## Cuentas de prueba

| Email | Contraseña | Rol |
|---|---|---|
| usr_001@test.cl | admin123 | admin |
| usr_002@test.cl | user123 | user |
| usr_003@test.cl | user456 | user |

## Uso de IA

Ver `ai_interactions.md`
