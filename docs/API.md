# 📚 API Documentation - GO FILM

## Base URL
```
http://localhost:5000/api
```

## Autenticación

Todos los endpoints protegidos requieren un JWT token en el header:

```
Authorization: Bearer <token>
```

## Endpoints

### Health Check

```
GET /health
```

Respuesta:
```json
{
  "status": "ok",
  "message": "GO FILM API is running",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 🔐 Autenticación (por implementar)

### Register
```
POST /auth/register
```

Body:
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "fullName": "Full Name"
}
```

### Login
```
POST /auth/login
```

Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 🎬 Películas (por implementar)

### Listar películas
```
GET /movies?page=1&limit=20
```

### Buscar película
```
GET /movies/search?q=Inception
```

### Obtener película por ID
```
GET /movies/:id
```

---

## ⭐ Reseñas (por implementar)

### Crear reseña
```
POST /reviews
Authorization: Bearer <token>
```

Body:
```json
{
  "movieId": 1,
  "title": "Excelente película",
  "content": "Una obra maestra...",
  "rating": 9
}
```

### Obtener reseñas de una película
```
GET /movies/:movieId/reviews
```

### Obtener reseñas de un usuario
```
GET /users/:userId/reviews
```

### Actualizar reseña
```
PUT /reviews/:id
Authorization: Bearer <token>
```

### Eliminar reseña
```
DELETE /reviews/:id
Authorization: Bearer <token>
```

---

## 👥 Usuarios (por implementar)

### Obtener perfil
```
GET /users/:id
```

### Actualizar perfil
```
PUT /users/:id
Authorization: Bearer <token>
```

### Seguir usuario
```
POST /users/:id/follow
Authorization: Bearer <token>
```

---

## 💬 Comentarios (por implementar)

### Crear comentario
```
POST /reviews/:reviewId/comments
Authorization: Bearer <token>
```

### Obtener comentarios
```
GET /reviews/:reviewId/comments
```

---

## Códigos de Estado HTTP

- `200` - OK
- `201` - Creado
- `400` - Bad Request
- `401` - No autorizado
- `404` - No encontrado
- `500` - Error del servidor

---

*Documentación en construcción* 🚧
