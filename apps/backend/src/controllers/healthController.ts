import { Request, Response } from 'express';
import { HealthService } from '../services/healthService';

export const getHealth = async (req: Request, res: Response): Promise<void> => {
  try {
    const healthData = HealthService.checkHealth();
    res.status(200).json(healthData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
