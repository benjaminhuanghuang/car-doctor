import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

dotenv.config();

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized - Invalid token' });

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;
    return next();
  } catch (error) {
    console.log('Error in protectRoute middleware:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
