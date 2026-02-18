import { Response } from 'express';
import { Car } from '../models/Car';
import { AuthenticatedRequest } from '../middleware/auth';

// Get all cars belonging to the authenticated user
export const getCars = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const cars = await Car.find({ userId }).sort({ createdAt: -1 });

    res.json({
      count: cars.length,
      cars,
    });
  } catch (error: any) {
    console.error('Get cars error:', error);
    res.status(500).json({
      error: 'Failed to get cars',
      details: error.message,
    });
  }
};

// Create a new car for the authenticated user
export const createCar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { brand, carModel, year, color } = req.body;

    // Create car
    const car = await Car.create({
      userId,
      brand,
      model: carModel,
      year,
      color,
    });

    res.status(201).json({
      message: 'Car created successfully',
      car,
    });
  } catch (error: any) {
    // Handle duplicate license plate error
    if (error.code === 11000) {
      res.status(400).json({ error: 'License plate already exists' });
      return;
    }

    console.error('Create car error:', error);
    res.status(500).json({
      error: 'Failed to create car',
      details: error.message,
    });
  }
};

// Get a single car by ID
export const getCarById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const car = await Car.findOne({ _id: id, userId });

    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    res.json({ car });
  } catch (error: any) {
    console.error('Get car error:', error);
    res.status(500).json({
      error: 'Failed to get car',
      details: error.message,
    });
  }
};

// Update a car by ID
export const updateCar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Map carModel to model for the schema
    const updateData: any = { ...req.body };
    if (updateData.carModel) {
      updateData.model = updateData.carModel;
      delete updateData.carModel;
    }

    const car = await Car.findOneAndUpdate({ _id: id, userId }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    res.json({
      message: 'Car updated successfully',
      car,
    });
  } catch (error: any) {
    console.error('Update car error:', error);
    res.status(500).json({
      error: 'Failed to update car',
      details: error.message,
    });
  }
};

// Delete a car by ID
export const deleteCar = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const car = await Car.findOneAndDelete({ _id: id, userId });

    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error: any) {
    console.error('Delete car error:', error);
    res.status(500).json({
      error: 'Failed to delete car',
      details: error.message,
    });
  }
};
