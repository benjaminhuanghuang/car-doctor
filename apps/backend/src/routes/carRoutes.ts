import { Router } from 'express';
import { getCars, createCar, getCarById, updateCar, deleteCar } from '../controllers/carController';
import { authenticateToken } from '../middleware/auth';

const router: Router = Router();

// All routes in this file require authentication
router.use(authenticateToken);

router.get('/', getCars);
router.post('/', createCar);
router.get('/:id', getCarById);
router.put('/:id', updateCar);
router.delete('/:id', deleteCar);

export default router;
