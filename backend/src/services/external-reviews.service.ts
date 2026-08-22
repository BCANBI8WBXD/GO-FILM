import axios from 'axios';

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'http://www.omdbapi.com';

if (!OMDB_API_KEY) {
  console.warn('⚠️ OMDB_API_KEY not configured');
}

interface OMDBResponse {
  Title: string;
  imdbRating: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Error?: string;
}

export class ExternalReviewsService {
  /**
   * Obtener ratings de OMDb (incluye IMDb, Rotten Tomatoes, Metacritic)
   */
  static async getMovieRatings(movieTitle: string, releaseYear?: string): Promise<{
    imdb?: number;
    rottenTomatoes?: number;
    metacritic?: number;
  }> {
    try {
      if (!OMDB_API_KEY) {
        throw new Error('OMDB_API_KEY not configured');
      }

      const params: any = {
        apikey: OMDB_API_KEY,
        t: movieTitle,
        type: 'movie',
      };

      if (releaseYear) {
        params.y = releaseYear;
      }

      const response = await axios.get(OMDB_BASE_URL, { params });

      if (response.data.Error) {
        console.warn(`OMDb Error: ${response.data.Error}`);
        return {};
      }

      const ratings: any = {};

      // IMDb rating
      if (response.data.imdbRating && response.data.imdbRating !== 'N/A') {
        ratings.imdb = parseFloat(response.data.imdbRating);
      }

      // Parse other ratings
      if (response.data.Ratings && Array.isArray(response.data.Ratings)) {
        response.data.Ratings.forEach((rating: any) => {
          if (rating.Source === 'Rotten Tomatoes') {
            const value = parseInt(rating.Value);
            if (!isNaN(value)) {
              ratings.rottenTomatoes = value / 10; // Convertir a escala 0-10
            }
          } else if (rating.Source === 'Metacritic') {
            const value = parseInt(rating.Value);
            if (!isNaN(value)) {
              ratings.metacritic = value / 10; // Convertir a escala 0-10
            }
          }
        });
      }

      return ratings;
    } catch (error: any) {
      console.error('Error fetching external ratings:', error.message);
      return {};
    }
  }

  /**
   * Procesar y extraer rating de Rotten Tomatoes
   */
  static parseRottenTomatoesRating(value: string): number | null {
    if (!value || value === 'N/A') return null;
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed / 10;
  }

  /**
   * Procesar y extraer rating de Metacritic
   */
  static parseMetacriticRating(value: string): number | null {
    if (!value || value === 'N/A') return null;
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed / 10;
  }
}
