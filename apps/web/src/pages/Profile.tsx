import React, { useRef, useState, useEffect, useMemo } from 'react';
import { userApi } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import Loader from '@/components/Loader';

const Profile = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Local state for image preview and file handling
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>('');

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

  useEffect(() => {
    if (userProfile?.profilePic) {
      setImagePreview(userProfile.profilePic);
    }
    setEmail(userProfile?.email || '');
  }, [userProfile]);

  const isDirty = useMemo(() => {
    const current = imagePreview ?? null;
    const prev = userProfile?.profilePic ?? null;
    return current !== prev;
  }, [imagePreview, userProfile?.profilePic]);

  const mutation = useMutation({
    mutationFn: async (updates: { profilePic?: string }) => {
      const res = await userApi.updateProfile(updates);
      if (res.error) throw new Error(res.error);
      return res.data!.user;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['profile'], updatedUser);
    },
  });

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      // readAsDataURL() is not an async function
      reader.readAsDataURL(file);
    });

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    // If a new image file is selected
    if (imageFile) {
      const base64 = imagePreview.startsWith('blob:')
        ? await fileToDataUrl(imageFile)
        : imagePreview;
      mutation.mutate({ profilePic: base64 });
      return;
    } else {
      mutation.mutate({ profilePic: '' });
    }
  };

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    // Create a temporary URL for the selected file to show as preview
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImagePreview() {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  if (isFetching) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="md:col-span-2">
          <label>Profile Image</label>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="block"
              hidden
            />
            <div
              className="relative group"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
              }}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImagePreview();
                    }}
                    className="absolute top-0 right-0  rounded-full p-1 shadow"
                  >
                    <X size={16} className="text-red-600" />
                  </button>
                </>
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  No image
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="block font-semibold mb-1">Email</label>
          <input
            value={email || ''}
            readOnly
            aria-readonly
            type="email"
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
          <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!isDirty || mutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : 'Save'}
          </button>
          {isDirty && <span className="text-yellow-600">Unsaved changes</span>}
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
