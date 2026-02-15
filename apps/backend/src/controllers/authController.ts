import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';

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

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  fullName: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

// User registration
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
      return;
    }

    const { email, password, fullName } = parsed.data;
    const resolvedFullName = fullName?.trim() || email.split('@')[0]; // Use fullName if provided, otherwise derive from email

    if (!resolvedFullName) {
      res.status(400).json({ error: 'Validation failed' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Create user
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      fullName: resolvedFullName,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = await generateToken({
      id: user._id.toString(),
      email: user.email,
      username: user.fullName,
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: toPublicUser(user),
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'Failed to create user',
      details: error.message,
    });
  }
};

// User login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
      return;
    }

    const { email, password } = parsed.data;

    // Find user (including password field)
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = await generateToken({
      id: user._id.toString(),
      email: user.email,
      username: user.fullName,
    });

    res.json({
      message: 'Login successful',
      token,
      user: toPublicUser(user),
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      details: error.message,
    });
  }
};
