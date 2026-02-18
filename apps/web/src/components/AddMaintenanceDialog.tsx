import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceApi } from '@/lib/api';
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

const maintenanceSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
  cost: z.number().min(0, 'Cost must be positive').optional(),
  mileage: z.number().min(0, 'Mileage must be positive'),
  date: z.string().optional(),
  nextDueDate: z.string().optional(),
  nextDueMileage: z.number().min(0, 'Next due mileage must be positive').optional(),
  notes: z.string().optional(),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

interface AddMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carId: string;
}

const maintenanceTypes = [
  { value: 'oil_change', label: 'Oil Change' },
  { value: 'tire_rotation', label: 'Tire Rotation' },
  { value: 'brake_service', label: 'Brake Service' },
  { value: 'battery_replacement', label: 'Battery Replacement' },
  { value: 'air_filter', label: 'Air Filter' },
  { value: 'fuel_filter', label: 'Fuel Filter' },
  { value: 'transmission_fluid', label: 'Transmission Fluid' },
  { value: 'coolant_flush', label: 'Coolant Flush' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'other', label: 'Other' },
];

export const AddMaintenanceDialog = ({ open, onOpenChange, carId }: AddMaintenanceDialogProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: MaintenanceFormData) => {
      const response = await maintenanceApi.createMaintenanceRecord({
        ...data,
        carId,
        cost: data.cost || 0,
      });
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', carId] });
      reset();
      setError('');
      onOpenChange(false);
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to add maintenance record');
    },
  });

  const onSubmit = async (data: MaintenanceFormData) => {
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader onClose={handleClose}>
          <DialogTitle>Add Maintenance Record</DialogTitle>
          <DialogDescription>Record a new maintenance service for this vehicle</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <div className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  Maintenance Type <span className="text-destructive">*</span>
                </label>
                <select
                  id="type"
                  {...register('type')}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select type...</option>
                  {maintenanceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-destructive">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Changed oil and filter, 5W-30 synthetic"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mileage" className="block text-sm font-medium mb-1">
                    Mileage <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="mileage"
                    type="number"
                    {...register('mileage', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., 50000"
                  />
                  {errors.mileage && (
                    <p className="mt-1 text-sm text-destructive">{errors.mileage.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cost" className="block text-sm font-medium mb-1">
                    Cost ($)
                  </label>
                  <input
                    id="cost"
                    type="number"
                    step="0.01"
                    {...register('cost', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., 59.99"
                  />
                  {errors.cost && (
                    <p className="mt-1 text-sm text-destructive">{errors.cost.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Service Date
                </label>
                <input
                  id="date"
                  type="date"
                  {...register('date')}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-destructive">{errors.date.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nextDueMileage" className="block text-sm font-medium mb-1">
                    Next Due Mileage
                  </label>
                  <input
                    id="nextDueMileage"
                    type="number"
                    {...register('nextDueMileage', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g., 55000"
                  />
                  {errors.nextDueMileage && (
                    <p className="mt-1 text-sm text-destructive">{errors.nextDueMileage.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nextDueDate" className="block text-sm font-medium mb-1">
                    Next Due Date
                  </label>
                  <input
                    id="nextDueDate"
                    type="date"
                    {...register('nextDueDate')}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.nextDueDate && (
                    <p className="mt-1 text-sm text-destructive">{errors.nextDueDate.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  {...register('notes')}
                  rows={2}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Additional notes..."
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-destructive">{errors.notes.message}</p>
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
              {isSubmitting ? 'Adding...' : 'Add Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
