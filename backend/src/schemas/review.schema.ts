import { z } from 'zod';

export const createReviewSchema = z.object({
  movieId: z.number().int().positive('Movie ID requerido'),
  title: z.string().min(3, 'Título debe tener al menos 3 caracteres').max(255),
  content: z.string().min(10, 'Contenido debe tener al menos 10 caracteres'),
  rating: z.number().int().min(1, 'Rating debe ser entre 1 y 10').max(10),
});

export const updateReviewSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  content: z.string().min(10).optional(),
  rating: z.number().int().min(1).max(10).optional(),
});

export const listReviewsSchema = z.object({
  limit: z.number().int().positive().optional().default(20),
  offset: z.number().int().nonnegative().optional().default(0),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ListReviewsInput = z.infer<typeof listReviewsSchema>;
