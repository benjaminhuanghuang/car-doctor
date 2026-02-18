import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { CarFormData } from '../lib/schemas';

interface CarFormFieldsProps {
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
}

export const CarFormFields = ({ register, errors }: CarFormFieldsProps) => {
  return (
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
        {errors.brand && <p className="mt-1 text-sm text-destructive">{errors.brand.message}</p>}
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
        {errors.year && <p className="mt-1 text-sm text-destructive">{errors.year.message}</p>}
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
        {errors.color && <p className="mt-1 text-sm text-destructive">{errors.color.message}</p>}
      </div>
    </div>
  );
};
