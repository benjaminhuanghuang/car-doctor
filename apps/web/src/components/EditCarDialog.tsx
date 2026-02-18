import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { carApi, type Car } from '@/lib/api';
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
import { useState, useEffect } from 'react';
import { carSchema } from '@/lib/schemas';
import type { CarFormData } from '@/lib/schemas';
import { CarFormFields } from './CarFormFields';

interface EditCarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car: Car | null;
}

export const EditCarDialog = ({ open, onOpenChange, car }: EditCarDialogProps) => {
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

  // Reset form with car data when car changes or dialog opens
  useEffect(() => {
    if (car && open) {
      reset({
        brand: car.brand,
        carModel: car.model,
        year: car.year,
        color: car.color || '',
      });
    }
  }, [car, open, reset]);

  const mutation = useMutation({
    mutationFn: async (data: CarFormData) => {
      if (!car) throw new Error('No car selected');
      const response = await carApi.updateCar(car._id, data);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      setError('');
      onOpenChange(false);
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to update car');
    },
  });

  const onSubmit = async (data: CarFormData) => {
    setError('');
    mutation.mutate(data);
  };

  const handleClose = () => {
    setError('');
    onOpenChange(false);
  };

  if (!car) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader onClose={handleClose}>
          <DialogTitle>Edit Car</DialogTitle>
          <DialogDescription>Update your vehicle information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <CarFormFields register={register} errors={errors} />

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
              {isSubmitting ? 'Updating...' : 'Update Car'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
