import { Router, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken } from '../middleware/auth';

const router: Router = Router();

router.get('/cloudinary-signature', authenticateToken, (_req: Request, res: Response) => {
  // The current time of signature generation
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET!,
  );

  res.json({ timestamp, signature });
});

export default router;
