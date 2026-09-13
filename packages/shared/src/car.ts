import { z } from 'zod';

const currentYear = new Date().getFullYear();

/**
 * Canonical car input contract shared by the web forms and the backend API.
 * Note: the API/DTO field is `carModel`; the Mongoose model maps it to `model`.
 */
export const carSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  carModel: z.string().min(1, 'Model is required'),
  year: z
    .number({ message: 'Year must be a number' })
    .int('Year must be a whole number')
    .min(1886, 'Year must be at least 1886') // the first car was invented in 1886
    .max(currentYear + 1, `Year must be at most ${currentYear + 1}`),
  color: z.string().optional(),
});

export type CarInput = z.infer<typeof carSchema>;
