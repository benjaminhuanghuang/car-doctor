import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import z from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const router: Router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schemas
// The profile images are stored in Cloudinary. Only save the url in DB
const updateProfileSchema = z.object({
  email: z.email('Invalid email format').optional(),
  profilePic: z
    .string()
    .refine(
      (val) => {
        return /^data:image\/(png|jpeg|jpg|webp|gif);base64,/.test(val);
      },
      {
        message: 'Profile picture must be a valid base64 image',
      },
    )
    .refine(
      (val) => {
        const base64Data = val.split(',')[1];
        if (!base64Data) return false;

        const buffer = Buffer.from(base64Data, 'base64');
        return buffer.length <= MAX_FILE_SIZE;
      },
      {
        message: 'Profile picture must be smaller than 5MB',
      },
    )
    .or(z.literal('')) // Allow empty string to clear profile picture
    .optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Routes
router.get('/profile', getProfile);
router.put('/profile', validateBody(updateProfileSchema), updateProfile);
router.put('/password', validateBody(changePasswordSchema), changePassword);

export default router;
