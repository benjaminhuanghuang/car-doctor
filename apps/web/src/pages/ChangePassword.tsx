import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userApi } from '@/lib/api';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormSchema = z.infer<typeof schema>;
type FieldError = {
  field?: 'currentPassword' | 'newPassword' | 'confirmPassword';
  message?: string;
};
// Union type for API errors
type ChangePasswordError =
  | { error: string } // global error
  | { details: FieldError[] }; // field-specific errors

const ChangePassword = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState, reset, setError } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async (payload: { currentPassword: string; newPassword: string }) => {
      const res = await userApi.changePassword(payload);
      if (res.error || !res.data) throw res;
      return res.data;
    },
    onSuccess: (data) => {
      setSuccessMessage(data?.message ?? 'Password changed');
      reset();
    },
    onError: (err: unknown) => {
      // narrow to object first
      if (err && typeof err === 'object') {
        const e = err as Partial<ChangePasswordError> & Record<string, unknown>;

        // Field errors
        if ('details' in e && Array.isArray(e.details)) {
          (e.details as Array<FieldError>).forEach((d) => {
            if (d.field) {
              setError(d.field, { type: 'server', message: d.message });
            }
          });
          return;
        }

        // Global error
        if ('error' in e && typeof e.error === 'string') {
          setError('currentPassword', { type: 'manual', message: e.error });
          return;
        }
      }

      // fallback
      setError('currentPassword', { type: 'manual', message: 'Failed to change password' });
    },
  });

  const onSubmit = (values: FormSchema) => {
    setSuccessMessage(null);
    mutation.mutate({ currentPassword: values.currentPassword, newPassword: values.newPassword });
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Current password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            {...register('currentPassword')}
            aria-invalid={!!formState.errors.currentPassword}
          />
          {formState.errors.currentPassword && (
            <p className="text-sm text-red-600 mt-1">{formState.errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            {...register('newPassword')}
            aria-invalid={!!formState.errors.newPassword}
          />
          {formState.errors.newPassword && (
            <p className="text-sm text-red-600 mt-1">{formState.errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm new password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            {...register('confirmPassword')}
            aria-invalid={!!formState.errors.confirmPassword}
          />
          {formState.errors.confirmPassword && (
            <p className="text-sm text-red-600 mt-1">{formState.errors.confirmPassword.message}</p>
          )}
        </div>
        <div>
          {successMessage && <span className="text-green-600">{successMessage}</span>}
          {mutation.isError && !formState.errors.currentPassword && (
            <span className="text-red-600">
              {(mutation.error as { error: string }).error ?? 'Error'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : 'Change password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
