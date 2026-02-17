import type { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../middleware/auth';
import { User } from '../models/User';
import { uploadToCloudinary } from '../utils/cloudinary';

const getUserId = (req: AuthenticatedRequest): string | undefined => {
  return req.user?.id || (req.user as { userId?: string } | undefined)?.userId;
};

const toPublicUser = (user: {
  _id: unknown;
  email: string;
  fullName: string;
  profilePic?: string;
}) => {
  return {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    profilePic: user.profilePic ?? '',
  };
};

// Get current user profile
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user: toPublicUser(user) });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      details: error.message,
    });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { email } = req.body;

    // If a file was uploaded by multer, upload it to Cloudinary and use that URL
    let profilePicFromFile: string | undefined = undefined;
    const file = (req as any).file as Express.Multer.File | undefined;
    if (file) {
      const uploadResult = await uploadToCloudinary(file.path, 'carDoctor');
      profilePicFromFile =
        (uploadResult && (uploadResult.secure_url || uploadResult.url)) || undefined;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const updateData: { email?: string; profilePic?: string } = {};
    if (email) updateData.email = email;
    if (profilePicFromFile) updateData.profilePic = profilePicFromFile;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      message: 'Profile updated successfully',
      user: toPublicUser(updatedUser),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current and new password are required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
    user.password = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
