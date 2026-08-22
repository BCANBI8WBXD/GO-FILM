import { Router } from 'express';
import { protect, AuthRequest } from '../middleware/auth.js';
import { ReviewRepository } from '../repositories/reviews.repository.js';
import { createReviewSchema, updateReviewSchema, listReviewsSchema } from '../schemas/review.schema.js';

const router = Router();

/**
 * POST /api/reviews
 * Crear una nueva reseña (requiere autenticación)
 */
router.post('/', protect, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const data = createReviewSchema.parse(req.body);

    const review = await ReviewRepository.create(
      req.user.id,
      data.movieId,
      data.title,
      data.content,
      data.rating
    );

    res.status(201).json({
      success: true,
      message: 'Reseña creada exitosamente',
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/reviews/movie/:movieId
 * Obtener reseñas de una película
 */
router.get('/movie/:movieId', async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.movieId);
    const { limit, offset } = listReviewsSchema.parse(req.query);

    const reviews = await ReviewRepository.getByMovieId(movieId, limit, offset);
    const count = await ReviewRepository.countByMovieId(movieId);
    const avgRating = await ReviewRepository.getAverageRating(movieId);

    res.json({
      success: true,
      data: reviews,
      stats: {
        totalReviews: count,
        averageRating: avgRating,
      },
      pagination: {
        limit,
        offset,
        count: reviews.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/reviews/user/:userId
 * Obtener reseñas de un usuario
 */
router.get('/user/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const { limit, offset } = listReviewsSchema.parse(req.query);

    const reviews = await ReviewRepository.getByUserId(userId, limit, offset);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        limit,
        offset,
        count: reviews.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/reviews/:id
 * Obtener una reseña específica
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const review = await ReviewRepository.getById(id);

    if (!review) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/reviews/:id
 * Actualizar una reseña (solo el autor)
 */
router.put('/:id', protect, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const id = parseInt(req.params.id);
    const review = await ReviewRepository.getById(id);

    if (!review) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    // Verificar que es el autor
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permisos para editar esta reseña' });
    }

    const data = updateReviewSchema.parse(req.body);
    const updated = await ReviewRepository.update(
      id,
      data.title,
      data.content,
      data.rating
    );

    res.json({
      success: true,
      message: 'Reseña actualizada exitosamente',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/reviews/:id
 * Eliminar una reseña (solo el autor)
 */
router.delete('/:id', protect, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const id = parseInt(req.params.id);
    const review = await ReviewRepository.getById(id);

    if (!review) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    // Verificar que es el autor
    if (review.user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar esta reseña' });
    }

    await ReviewRepository.delete(id);

    res.json({
      success: true,
      message: 'Reseña eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/reviews/:id/like
 * Dar like a una reseña
 */
router.post('/:id/like', protect, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const id = parseInt(req.params.id);
    const review = await ReviewRepository.getById(id);

    if (!review) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    const success = await ReviewRepository.addLike(id, req.user.id);

    if (!success) {
      return res.status(400).json({ error: 'Ya has dado like a esta reseña' });
    }

    const updated = await ReviewRepository.getById(id);

    res.json({
      success: true,
      message: 'Like agregado',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/reviews/:id/like
 * Remover like de una reseña
 */
router.delete('/:id/like', protect, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const id = parseInt(req.params.id);
    const success = await ReviewRepository.removeLike(id, req.user.id);

    if (!success) {
      return res.status(400).json({ error: 'No habías dado like a esta reseña' });
    }

    const updated = await ReviewRepository.getById(id);

    res.json({
      success: true,
      message: 'Like removido',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
