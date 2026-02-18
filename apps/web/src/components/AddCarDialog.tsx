import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { carSchema } from '@/lib/schemas';
import type { CarFormData } from '@/lib/schemas';
import { CarFormFields } from './CarFormFields';

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
              {isSubmitting ? 'Adding...' : 'Add Car'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
