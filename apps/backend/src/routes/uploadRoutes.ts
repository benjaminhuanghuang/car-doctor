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

router.delete('/delete-file', authenticateToken, async (_req: Request, res: Response) => {
  const { cloudinaryUrl } = _req.body;
  const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  const publicId = match ? match[1] : null;
  try {
    if (!publicId) {
      return res.status(400).json({ error: 'publicId is required' });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return res.json({ message: 'File deleted successfully', result });
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete file from Cloudinary' });
  }
});

export default router;
