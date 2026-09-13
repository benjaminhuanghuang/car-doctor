import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Core registration contract (email + password). Consumers extend it:
 * the web form adds `confirmPassword`, the backend adds `fullName`.
 */
export const registerSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
