# Tensor Raiders — Gestión de Equipos

Aplicación web para el registro, consulta y listado de equipos.

Instalar Angular CLI globalmente si no lo tienes:
```bash
npm install -g @angular/cli@17
```

## Arranque del Backend

```bash
cd backend
mvn spring-boot:run
```

El servidor arranca en **http://localhost:8080**

Al arrancar se cargan automáticamente 4 equipos de ejemplo (via `DataLoader`).

### Consola H2 (base de datos)
Accede en: http://localhost:8080/h2-console  
- JDBC URL: `jdbc:h2:mem:equiposdb`  
- Usuario: `sa`  
- Contraseña: *(vacía)*

---

## Arranque del Frontend

```bash
cd frontend
npm install
npm run start -> Por el proxy
```

La aplicación arranca en **http://localhost:4200**

El proxy redirige `/api/**` → `http://localhost:8080/api/**` automáticamente.

---

## API REST — Endpoints

Base URL: `http://localhost:8080/api/equipos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/equipos` | Listar todos los equipos |
| `GET` | `/api/equipos?buscar=texto` | Buscar por nombre/descripción |
| `GET` | `/api/equipos?nivel=EXPERTO` | Filtrar por nivel |
| `GET` | `/api/equipos/{id}` | Consultar equipo por ID |
| `POST` | `/api/equipos` | Registrar nuevo equipo |
| `PUT` | `/api/equipos/{id}` | Actualizar equipo |
| `DELETE` | `/api/equipos/{id}` | Eliminar equipo |
| `GET` | `/api/equipos/estadisticas` | Estadísticas por nivel |

### Ejemplo de payload para POST/PUT

```json
{
  "nombre": "Mi Equipo",
  "nivel": "AVANZADO",
  "descripcion": "Descripción opcional del equipo.",
  "participantes": ["Ana García", "Carlos López", "Marta Ruiz"]
}
```

### Niveles disponibles

`PRINCIPIANTE` · `INTERMEDIO` · `AVANZADO` · `EXPERTO`

---

## Datos de ejemplo (SQL)

El fichero `datos_ejemplo.sql` contiene 4 equipos con participantes.  

---


