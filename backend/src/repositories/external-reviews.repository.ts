import pool from '../db/connection.js';

export interface ExternalReview {
  id: number;
  movie_id: number;
  source: 'imdb' | 'rotten_tomatoes' | 'metacritic';
  rating: number | null;
  url?: string;
  created_at: Date;
  updated_at: Date;
}

export class ExternalReviewRepository {
  /**
   * Obtener reviews externos de una película
   */
  static async getByMovieId(movieId: number): Promise<ExternalReview[]> {
    const result = await pool.query(
      `SELECT * FROM external_reviews WHERE movie_id = $1 ORDER BY source`,
      [movieId]
    );
    return result.rows;
  }

  /**
   * Crear o actualizar review externo
   */
  static async upsert(
    movieId: number,
    source: string,
    rating: number | null,
    url?: string
  ): Promise<ExternalReview> {
    const result = await pool.query(
      `INSERT INTO external_reviews (movie_id, source, rating, url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (movie_id, source) 
       DO UPDATE SET rating = $3, url = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [movieId, source, rating, url || null]
    );
    return result.rows[0];
  }

  /**
   * Obtener rating promedio de críticas externas
   */
  static async getAverageRating(movieId: number): Promise<number | null> {
    const result = await pool.query(
      `SELECT AVG(rating) as avg_rating FROM external_reviews 
       WHERE movie_id = $1 AND rating IS NOT NULL`,
      [movieId]
    );
    
    const avgRating = result.rows[0]?.avg_rating;
    return avgRating ? parseFloat(avgRating) : null;
  }
}
