import pool from '../db/connection.js';
import type { Review } from '../types/index.js';

export class ReviewRepository {
  /**
   * Crear reseña
   */
  static async create(
    userId: number,
    movieId: number,
    title: string,
    content: string,
    rating: number
  ): Promise<Review> {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, movie_id, title, content, rating)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, movieId, title, content, rating]
    );
    return result.rows[0];
  }

  /**
   * Obtener reseñas de una película
   */
  static async getByMovieId(movieId: number, limit = 20, offset = 0): Promise<Review[]> {
    const result = await pool.query(
      `SELECT * FROM reviews 
       WHERE movie_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [movieId, limit, offset]
    );
    return result.rows;
  }

  /**
   * Obtener reseñas de un usuario
   */
  static async getByUserId(userId: number, limit = 20, offset = 0): Promise<Review[]> {
    const result = await pool.query(
      `SELECT * FROM reviews 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  /**
   * Obtener reseña por ID
   */
  static async getById(id: number): Promise<Review | null> {
    const result = await pool.query(
      `SELECT * FROM reviews WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Actualizar reseña
   */
  static async update(
    id: number,
    title?: string,
    content?: string,
    rating?: number
  ): Promise<Review | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }

    if (content !== undefined) {
      updates.push(`content = $${paramCount}`);
      values.push(content);
      paramCount++;
    }

    if (rating !== undefined) {
      updates.push(`rating = $${paramCount}`);
      values.push(rating);
      paramCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    if (updates.length === 1) return this.getById(id);

    const result = await pool.query(
      `UPDATE reviews SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Eliminar reseña
   */
  static async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM reviews WHERE id = $1`,
      [id]
    );
    return result.rowCount > 0;
  }

  /**
   * Obtener rating promedio de una película (críticas propias)
   */
  static async getAverageRating(movieId: number): Promise<number | null> {
    const result = await pool.query(
      `SELECT AVG(rating) as avg_rating FROM reviews 
       WHERE movie_id = $1`,
      [movieId]
    );
    
    const avgRating = result.rows[0]?.avg_rating;
    return avgRating ? parseFloat(avgRating) : null;
  }

  /**
   * Contar reseñas de una película
   */
  static async countByMovieId(movieId: number): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM reviews WHERE movie_id = $1`,
      [movieId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Agregar like a reseña
   */
  static async addLike(reviewId: number, userId: number): Promise<boolean> {
    try {
      await pool.query(
        `INSERT INTO review_likes (review_id, user_id) VALUES ($1, $2)`,
        [reviewId, userId]
      );

      // Incrementar likes_count
      await pool.query(
        `UPDATE reviews SET likes_count = likes_count + 1 WHERE id = $1`,
        [reviewId]
      );

      return true;
    } catch (error: any) {
      // Si ya existe el like, no hacer nada
      if (error.code === '23505') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Remover like de reseña
   */
  static async removeLike(reviewId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM review_likes WHERE review_id = $1 AND user_id = $2`,
      [reviewId, userId]
    );

    if (result.rowCount > 0) {
      // Decrementar likes_count
      await pool.query(
        `UPDATE reviews SET likes_count = likes_count - 1 WHERE id = $1 AND likes_count > 0`,
        [reviewId]
      );
      return true;
    }

    return false;
  }
}
