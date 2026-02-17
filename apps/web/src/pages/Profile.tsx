import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { email } from 'zod';

const Profile = () => {
  const { user, token, login } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Local state for image preview and file handling
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProfile = async () => {
    const res = await userApi.getProfile();
    if (res.error) throw new Error(res.error);
    return res.data!.user;
  };

  const {
    data: userProfile,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: true,
  });
  const email = userProfile?.email;
  const imagePreviewUrl = userProfile?.profilePic;

  const mutation = useMutation({
    mutationFn: async (updates: { profilePic?: string }) => {
      const res = await userApi.updateProfile(updates);
      if (res.error) throw new Error(res.error);
      return res.data!.user;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['profile'], updatedUser);
      if (token) {
        login(token, {
          id: updatedUser.id,
          email: updatedUser.email,
          profilePic: updatedUser.profilePic,
        } as any);
      }
    },
  });

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (imageFile) {
      try {
        const dataUrl = await fileToDataUrl(imageFile);
        mutation.mutate({ profilePic: dataUrl });
        return;
      } catch (err) {
        console.error('Failed to read file', err);
      }
    }
    mutation.mutate({ profilePic: imagePreview ?? undefined });
  };

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (imagePreview && imageFile) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="md:col-span-2">
          <label>Profile Image</label>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImage}
              className="block"
              hidden
            />
            {imagePreviewUrl ? (
              // preview image and the x button to remove it
              <div className="relative group">
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Email</label>
          <input
            value={email}
            readOnly
            aria-readonly
            placeholder="you@example.com"
            type="email"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
          <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : 'Save'}
          </button>
          {mutation.isSuccess && <span className="text-green-600">Profile updated</span>}
          {mutation.isError && (
            <span className="text-red-600">{(mutation.error as Error)?.message ?? 'Error'}</span>
          )}
          {isFetching && <span className="text-gray-600">Loading...</span>}
          {fetchError && <span className="text-red-600">{(fetchError as Error).message}</span>}
        </div>
      </form>
    </div>
  );
};

export default Profile;
