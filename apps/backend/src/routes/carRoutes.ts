import { Router } from 'express';
import { createCar, getCarById, updateCar, deleteCar, getCars } from '../controllers/carController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import z from 'zod';

const router: Router = Router();

const createCarSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  carModel: z.string().min(1, 'Model is required'),
  year: z.number().min(1886, 'Year is required'), // The first car was invented in 1886
  color: z.string().optional(),
});

const updateCarSchema = z.object({
  id: z.string().refine((val) => /^[a-fA-F0-9]{24}$/.test(val), 'Invalid car ID'),
  brand: z.string().min(1, 'Brand is required'),
  carModel: z.string().min(1, 'Model is required'),
  year: z.number().min(1886, 'Year is required'), // The first car was invented in 1886
  color: z.string().optional(),
});

// All routes in this file require authentication
router.use(authenticateToken);

router.get('/', getCars);
router.post('/', validateBody(createCarSchema), createCar);
router.get('/:id', getCarById);
router.put('/:id', validateBody(updateCarSchema), updateCar);
router.delete('/:id', deleteCar);

export default router;
