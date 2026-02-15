import { Router } from 'express';
import {
  getMaintenance,
  createMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
} from '../controllers/maintenanceController';
import { authenticateToken } from '../middleware/auth';

const router: Router = Router();

// All routes in this file require authentication
router.use(authenticateToken);

router.get('/', getMaintenance);
router.post('/', createMaintenance);
router.get('/:id', getMaintenanceById);
router.put('/:id', updateMaintenance);
router.delete('/:id', deleteMaintenance);

export default router;
