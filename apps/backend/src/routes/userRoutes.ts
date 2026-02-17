import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import z from 'zod';

const router: Router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schemas
// The profile images are stored in Cloudinary. Only save the url in DB
const updateProfileSchema = z.object({
  email: z.email('Invalid email format').optional(),
  profilePic: z
    .url('Profile picture must be a valid URL')
    .max(100, 'Profile picture URL is too long')
    // .refine((url) => url.startsWith('https://'), {
    //   message: 'Profile picture must use HTTPS',
    // })
    .refine((url) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url), {
      message: 'Profile picture must be a valid image URL',
    })
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
