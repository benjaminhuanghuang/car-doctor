import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const carSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  carModel: z.string().min(1, 'Model is required'),
  year: z
    .number({
      message: 'Year must be a number',
    })
    .int('Year must be a whole number')
    .min(1900, 'Year must be at least 1900')
    .max(currentYear + 1, `Year must be at most ${currentYear + 1}`),
  color: z.string().optional(),
});

export type CarFormData = z.infer<typeof carSchema>;
