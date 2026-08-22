# 🎬 FASE 2.2 + FASE 3: Críticas Externas + Críticas Propias

## ¿Qué hemos creado?

### Servicios:
1. **ExternalReviewsService** - Conecta con OMDb API
2. **ReviewRepository** - Gestiona críticas propias en BD

### Rutas de Críticas Externas:
- Traer ratings de IMDb, Rotten Tomatoes, Metacritic
- Guardar en tabla `external_reviews`

### Rutas de Críticas Propias (CRUD):
1. `POST /api/reviews` - Crear reseña (requiere login)
2. `GET /api/reviews/movie/:movieId` - Reseñas de película
3. `GET /api/reviews/user/:userId` - Reseñas de usuario
4. `GET /api/reviews/:id` - Obtener reseña
5. `PUT /api/reviews/:id` - Actualizar (solo autor)
6. `DELETE /api/reviews/:id` - Eliminar (solo autor)
7. `POST /api/reviews/:id/like` - Dar like
8. `DELETE /api/reviews/:id/like` - Remover like

---

## 📋 ANTES DE EMPEZAR

### 1. Obtener API Key de OMDb

1. Ir a: http://www.omdbapi.com/apikey.aspx
2. Crear cuenta (opción gratuita)
3. Copiar la API Key
4. Agregar a `.env`: `OMDB_API_KEY=xxxxx`

### 2. Ejecutar migración de BD

```bash
# Agregar tabla de críticas externas
psql -U postgres -d go_film -f database/migrations/001_add_external_reviews.sql
```

### 3. Configurar .env

```bash
# .env debe tener:
TMDB_API_KEY=xxxxx
OMDB_API_KEY=xxxxx
# ... resto de variables
```

### 4. Instalar/Actualizar dependencias

```bash
npm install
```

### 5. Iniciar servidor

```bash
npm run dev
```

---

## 🧪 PROBAR LA API

### **Test 1: Crear una reseña (requiere login)**

Primero registrarse y obtener token:
```bash
# Registrarse
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "myuser",
    "password": "password123"
  }'

# Login y copiar el token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Ahora crear reseña:
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "movieId": 1,
    "title": "Masterpiece!",
    "content": "Esta película es absolutamente increíble. La cinematografía, el guión, todo es perfecto. Definitivamente una de mis favoritas de todos los tiempos.",
    "rating": 9
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Reseña creada exitosamente",
  "data": {
    "id": 1,
    "user_id": 1,
    "movie_id": 1,
    "title": "Masterpiece!",
    "content": "Esta película es absolutamente increíble...",
    "rating": 9,
    "likes_count": 0,
    "created_at": "2026-08-22T...",
    "updated_at": "2026-08-22T..."
  }
}
```

### **Test 2: Obtener reseñas de una película**

```bash
curl "http://localhost:5000/api/reviews/movie/1?limit=10&offset=0"
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "movie_id": 1,
      "title": "Masterpiece!",
      "content": "Esta película es absolutamente increíble...",
      "rating": 9,
      "likes_count": 0,
      "created_at": "2026-08-22T...",
      "updated_at": "2026-08-22T..."
    }
  ],
  "stats": {
    "totalReviews": 1,
    "averageRating": 9
  },
  "pagination": {
    "limit": 10,
    "offset": 0,
    "count": 1
  }
}
```

### **Test 3: Dar like a una reseña**

```bash
curl -X POST http://localhost:5000/api/reviews/1/like \
  -H "Authorization: Bearer <tu_token>"
```

### **Test 4: Actualizar reseña**

```bash
curl -X PUT http://localhost:5000/api/reviews/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "title": "Masterpiece Updated!",
    "rating": 10
  }'
```

### **Test 5: Eliminar reseña**

```bash
curl -X DELETE http://localhost:5000/api/reviews/1 \
  -H "Authorization: Bearer <tu_token>"
```

---

## 📊 Estructura de datos

### Críticas Externas:
```sql
external_reviews (
  id,         -- ID
  movie_id,   -- Referencia a película
  source,     -- 'imdb', 'rotten_tomatoes', 'metacritic'
  rating,     -- 0-10
  url,        -- Link a fuente
  created_at
)
```

### Críticas Propias:
```sql
reviews (
  id,           -- ID
  user_id,      -- Quién escribió
  movie_id,     -- Qué película
  title,        -- Título reseña
  content,      -- Texto completo
  rating,       -- 1-10
  likes_count,  -- Cuántos likes
  created_at
)

review_likes (
  id,
  user_id,      -- Quién dio like
  review_id     -- Qué reseña
)
```

---

## 🔒 Seguridad

- ✅ Solo el autor puede editar/eliminar su reseña
- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT tokens con expiración
- ✅ Validación de input con Zod
- ✅ CORS configurado

---

## 🚀 Próximos pasos

Una vez funcione esto:

### **FASE 2.3:** Unificar todo en endpoint único
```bash
GET /api/movies/:id/full
```
Respuesta con:
- Info de película (TMDB)
- Críticas externas (IMDb, etc)
- Críticas propias (GO FILM)
- Rating promedio comunitario

### **FASE 4:** Recomendaciones personalizadas
- Basadas en movies que calificó
- Basadas en usuarios similares
- Películas trending en comunidad

---

¿Dudas? Preguntas en GitHub Issues 🤔
