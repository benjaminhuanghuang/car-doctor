import { Response } from 'express';
import { Maintenance } from '../models/Maintenance';
import { Car } from '../models/Car';
import { AuthenticatedRequest } from '../middleware/auth';

const getUserId = (req: AuthenticatedRequest): string | undefined => {
  return req.user?.id || (req.user as { userId?: string } | undefined)?.userId;
};

// Get maintenance records for the authenticated user (optionally filtered by carId)
export const getMaintenance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { carId } = req.query;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const filter: Record<string, unknown> = { userId };
    if (carId) {
      filter.carId = carId;
    }

    const records = await Maintenance.find(filter).sort({ date: -1 });

    res.json({ count: records.length, records });
  } catch (error: any) {
    console.error('Get maintenance error:', error);
    res.status(500).json({
      error: 'Failed to get maintenance records',
      details: error.message,
    });
  }
};

// Create a maintenance record for a car
export const createMaintenance = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const {
      carId,
      type,
      description,
      cost,
      mileage,
      date,
      nextDueDate,
      nextDueMileage,
      attachments,
      notes,
    } = req.body;

    if (!carId || !type || !description || mileage === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const car = await Car.findOne({ _id: carId, userId });
    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    const record = await Maintenance.create({
      carId,
      userId,
      type,
      description,
      cost: cost ?? 0,
      mileage,
      date: date ?? new Date(),
      nextDueDate,
      nextDueMileage,
      attachments,
      notes,
    });

    res.status(201).json({
      message: 'Maintenance record created successfully',
      record,
    });
  } catch (error: any) {
    console.error('Create maintenance error:', error);
    res.status(500).json({
      error: 'Failed to create maintenance record',
      details: error.message,
    });
  }
};

// Get a single maintenance record by ID
export const getMaintenanceById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const record = await Maintenance.findOne({ _id: id, userId });
    if (!record) {
      res.status(404).json({ error: 'Maintenance record not found' });
      return;
    }

    res.json({ record });
  } catch (error: any) {
    console.error('Get maintenance record error:', error);
    res.status(500).json({
      error: 'Failed to get maintenance record',
      details: error.message,
    });
  }
};

// Update a maintenance record by ID
export const updateMaintenance = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const record = await Maintenance.findOneAndUpdate({ _id: id, userId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      res.status(404).json({ error: 'Maintenance record not found' });
      return;
    }

    res.json({
      message: 'Maintenance record updated successfully',
      record,
    });
  } catch (error: any) {
    console.error('Update maintenance error:', error);
    res.status(500).json({
      error: 'Failed to update maintenance record',
      details: error.message,
    });
  }
};

// Delete a maintenance record by ID
export const deleteMaintenance = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const record = await Maintenance.findOneAndDelete({ _id: id, userId });
    if (!record) {
      res.status(404).json({ error: 'Maintenance record not found' });
      return;
    }

    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (error: any) {
    console.error('Delete maintenance error:', error);
    res.status(500).json({
      error: 'Failed to delete maintenance record',
      details: error.message,
    });
  }
};
