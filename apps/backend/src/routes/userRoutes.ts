import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile?: boolean) => void,
): void => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'), false);
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
  }),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router: Router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schemas
// For multipart/form-data we validate text fields here; files are handled by multer
const updateProfileSchema = z.object({
  email: z.email('Invalid email format').optional(),
  fullName: z.string().max(100).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Routes
router.get('/profile', getProfile);
router.put(
  '/profile',
  upload.single('profilePic'),
  // validateBody(updateProfileSchema),
  updateProfile,
);
router.put('/password', validateBody(changePasswordSchema), changePassword);

export default router;
