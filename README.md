## Plataforma Academica Microservicios

**Universidad Continental**
**Curso:** Desarrollo de Aplicaciones Web
**Docente:** Christian Alonso Vega Cervantes
**Integrante:** Geraldine Stefany Chalco Baldeon
**Nrc:** 38685
**Año:** 2026

## Descripción
PA3, backend con arquitectura de microservicios para gestionar estudiantes y cursos de la Universidad Tecnológica XYZ. Cada servicio tiene su propia base de datos y se despliega de forma independiente.

## Tecnologías utilizadas
Opción1: Visual Studio code, Node.js, Express, MySQL, Jest, Supertest, Git y GitHub.

## Servicios
|       Servicio      |Puerto| Base de datos  |     Ruta     |
|---------------------|------|----------------|--------------|
| estudiantes-service | 3001 | estudiantes_db | /estudiantes |
|    cursos-service   | 3002 |   cursos_db    | /cursos      |

## Endpoints (iguales en ambos servicios permite:)
- `POST /recurso` registra
- `GET /recurso` lista
- `GET /recurso/:id` consulta
- `PUT /recurso/:id` actualiza
- `DELETE /recurso/:id` elimina

## Como ejecutarlo
1. Crear las bases `estudiantes_db` y `cursos_db` en MySQL, con las tablas `estudiantes` y `cursos`.
2. En cada servicio, crear un `.env` a partir de `.env.example` con su contraseña de MySQL.
3. En cada carpeta de servicio:
```
npm install
npm start
```
## Pruebas
```
npm test
```
