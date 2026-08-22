# 🎬 FASE 2.1: Integración TMDB - Guía Paso a Paso

## ¿Qué hemos creado?

### Servicios:
1. **TMDBService** - Conecta con API de TMDB
2. **MovieService** - Gestiona películas en la BD

### Rutas:
1. `GET /api/movies/search?query=Inception` - Buscar películas
2. `GET /api/movies/popular` - Películas populares
3. `GET /api/movies/:id` - Detalles de película
4. `GET /api/movies` - Listar todas

---

## 📋 ANTES DE EMPEZAR

### 1. Obtener API Key de TMDB

1. Ir a: https://www.themoviedb.org/settings/api
2. Crear cuenta (si no tienes)
3. Solicitar API Key (opción gratuita)
4. Copiar la API Key

### 2. Configurar .env

```bash
cd backend
nano .env  # o abre el archivo en tu editor
```

Agregar:
```
TMDB_API_KEY=tu_api_key_aqui
TMDB_BASE_URL=https://api.themoviedb.org/3
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar servidor

```bash
npm run dev
```

---

## 🧪 PROBAR LA API

### **Test 1: Buscar películas**

```bash
curl "http://localhost:5000/api/movies/search?query=Inception&page=1"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tmdb_id": 27205,
      "title": "Inception",
      "description": "Cobb es un ladrón especializado...",
      "release_date": "2010-07-15",
      "rating": 8.8,
      "poster_url": "https://image.tmdb.org/t/p/w342...",
      "created_at": "2026-08-22...",
      "updated_at": "2026-08-22..."
    }
  ],
  "pagination": {
    "page": 1,
    "totalPages": 5,
    "totalResults": 92
  }
}
```

### **Test 2: Películas populares**

```bash
curl "http://localhost:5000/api/movies/popular?page=1"
```

### **Test 3: Detalles de película**

```bash
curl "http://localhost:5000/api/movies/1"
```

### **Test 4: Listar todas**

```bash
curl "http://localhost:5000/api/movies?limit=10&offset=0"
```

---

## 📊 Estructura de datos

### En la BD guardamos:
```sql
movies (
  id,           -- ID local
  tmdb_id,      -- ID de TMDB
  title,        -- Título
  description,  -- Sinopsis
  release_date, -- Fecha estreno
  rating,       -- Rating TMDB
  poster_url,   -- Imagen
  created_at,
  updated_at
)
```

---

## ✅ Flujo de datos

1. **Usuario busca película** → `GET /api/movies/search?query=X`
2. **Backend consulta TMDB** → Trae datos actualizados
3. **Guarda en BD** → Si no existe ya
4. **Retorna al frontend** → Con datos locales + TMDB

---

## 🚀 Próximos pasos

Una vez funcione esto:

### **FASE 2.2:** Agregar críticas externas (IMDb)
```json
{
  "movie": { ... },
  "external_reviews": [
    { "source": "imdb", "rating": 8.8, "reviews": [...] }
  ]
}
```

### **FASE 3:** Sistema de críticas propias
```json
{
  "movie": { ... },
  "go_film_reviews": [
    { "user": "juan", "rating": 9, "content": "Excelente..." }
  ]
}
```

---

## 🐛 Troubleshooting

### Error: "TMDB_API_KEY not configured"
- Verificar que .env existe
- Verificar que tienes `TMDB_API_KEY=xxxx` en .env
- Reiniciar servidor

### Error: "Movie not found in TMDB"
- Verifica que el ID es válido
- El API key podría estar expirado

### Error de conexión a BD
- Verifica que PostgreSQL está ejecutándose
- Verifica credenciales en .env

---

## 📚 Documentación

- TMDB: https://www.themoviedb.org/settings/api
- API Reference: https://developer.themoviedb.org/docs/getting-started

---

¿Tienes dudas? 🤔
