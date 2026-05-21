# Tensor Raiders — Gestión de Equipos

Aplicación web para el registro, consulta y listado de equipos.

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Backend | Spring Boot 3 · Spring Data JPA · Spring Data REST · H2 |
| Persistencia | JPA/Hibernate · Base de datos H2 en memoria |
| Utilidades | Lombok · Bean Validation |
| Frontend | Angular 17 · Standalone Components · Signals · Reactive Forms |
| Comunicación | REST API JSON (puerto 8080) · Proxy Angular (puerto 4200) |

---

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| Java JDK | 17 |
| Maven | 3.9+ |
| Node.js | 18+ |
| npm | 9+ |
| Angular CLI | 17+ |

Instalar Angular CLI globalmente si no lo tienes:
```bash
npm install -g @angular/cli@17
```

---

## Estructura del proyecto

```
tensor-raiders/
├── backend/                  # Spring Boot
│   ├── src/main/java/tensor/raiders/backend/
│   │   ├── BackendApplication.java
│   │   ├── DataLoader.java           ← datos de ejemplo al arrancar
│   │   ├── model/
│   │   │   ├── Equipo.java           ← entidad JPA
│   │   │   └── EquipoDTO.java        ← DTOs request/response
│   │   ├── repository/
│   │   │   └── EquipoRepository.java
│   │   ├── service/
│   │   │   └── EquipoService.java
│   │   ├── controller/
│   │   │   └── EquipoController.java ← REST API /api/equipos
│   │   └── exception/
│   │       ├── GlobalExceptionHandler.java
│   │       ├── EquipoNotFoundException.java
│   │       └── NombreDuplicadoException.java
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/                 # Angular 17
│   └── src/app/
│       ├── models/           ← interfaces TypeScript
│       ├── services/         ← EquipoService, ToastService
│       ├── components/
│       │   ├── navbar/
│       │   ├── equipo-list/  ← listado + búsqueda + filtro
│       │   ├── equipo-form/  ← crear / editar
│       │   └── equipo-detail/← detalle de equipo
│       └── shared/
│           └── toast-container/
│
└── datos_ejemplo.sql         ← script SQL de referencia
```

---

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
ng serve
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

El fichero `datos_ejemplo.sql` contiene 6 equipos con participantes.  
En desarrollo, los datos se cargan automáticamente por `DataLoader.java`.  
Para usar el SQL en otro SGBD (MySQL/PostgreSQL), adapta las columnas según el dialecto.

---

## Construcción para producción

```bash
# Frontend
cd frontend
ng build --configuration production
# Los ficheros se generan en dist/tensor-raiders-frontend/

# Backend
cd backend
mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Para desplegar juntos, copia el contenido de `dist/` en `backend/src/main/resources/static/` y empaqueta el JAR.

---

## Funcionalidades implementadas

- ✅ Registro de equipos (nombre, nivel, descripción, participantes)
- ✅ Listado de todos los equipos con tarjetas visuales
- ✅ Búsqueda en tiempo real por nombre y descripción
- ✅ Filtrado por nivel
- ✅ Consulta detallada de equipo
- ✅ Edición de equipo existente
- ✅ Eliminación con confirmación
- ✅ Estadísticas por nivel en el menú lateral
- ✅ Validaciones en frontend y backend
- ✅ Manejo de errores con toasts
- ✅ Base de datos H2 en memoria con datos de ejemplo

---

*Tensor Raiders · 2024*
