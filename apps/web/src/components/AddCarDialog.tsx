import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { carApi } from '@/lib/api';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from './ui/dialog';
import { useState } from 'react';

const carSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  carModel: z.string().min(1, 'Model is required'),
  year: z
    .number({
      message: 'Year must be a number',
    })
    .int('Year must be a whole number')
    .min(1900, 'Year must be at least 1900')
    .max(new Date().getFullYear() + 1, `Year must be at most ${new Date().getFullYear() + 1}`),
  color: z.string().optional(),
});

type CarFormData = z.infer<typeof carSchema>;

interface AddCarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCarDialog = ({ open, onOpenChange }: AddCarDialogProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: CarFormData) => {
      const response = await carApi.createCar(data);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      reset();
      setError('');
      onOpenChange(false);
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to create car');
    },
  });

  const onSubmit = async (data: CarFormData) => {
    setError('');
    mutation.mutate(data);
  };

  const handleClose = () => {
    reset();
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader onClose={handleClose}>
          <DialogTitle>Add New Car</DialogTitle>
          <DialogDescription>Add a new vehicle to your collection</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <div className="space-y-4">
              <div>
                <label htmlFor="brand" className="block text-sm font-medium mb-1">
                  Brand <span className="text-destructive">*</span>
                </label>
                <input
                  id="brand"
                  type="text"
                  {...register('brand')}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Toyota, Honda, Ford"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-destructive">{errors.brand.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="carModel" className="block text-sm font-medium mb-1">
                  Model <span className="text-destructive">*</span>
                </label>
                <input
                  id="carModel"
                  type="text"
                  {...register('carModel')}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Camry, Accord, F-150"
                />
                {errors.carModel && (
                  <p className="mt-1 text-sm text-destructive">{errors.carModel.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium mb-1">
                  Year <span className="text-destructive">*</span>
                </label>
                <input
                  id="year"
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={new Date().getFullYear().toString()}
                />
                {errors.year && (
                  <p className="mt-1 text-sm text-destructive">{errors.year.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium mb-1">
                  Color
                </label>
                <input
                  id="color"
                  type="text"
                  {...register('color')}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Red, Blue, Silver"
                />
                {errors.color && (
                  <p className="mt-1 text-sm text-destructive">{errors.color.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                {error}
              </div>
            )}
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Car'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
