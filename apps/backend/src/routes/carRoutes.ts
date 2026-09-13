import { Router } from 'express';
import { createCar, getCarById, updateCar, deleteCar, getCars } from '../controllers/carController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { carSchema } from '@car-doctor/shared';

const router: Router = Router();

// All routes in this file require authentication
router.use(authenticateToken);

router.get('/', getCars);
router.post('/', validateBody(carSchema), createCar);
router.get('/:id', getCarById);
router.put('/:id', validateBody(carSchema), updateCar);
router.delete('/:id', deleteCar);

export default router;
