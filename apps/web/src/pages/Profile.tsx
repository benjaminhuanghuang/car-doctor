import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Profile = () => {
  const { user, token, login } = useAuth();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState(user?.email ?? '');
  const [profilePic, setProfilePic] = useState(user?.profilePic ?? '');

  const fetchProfile = async () => {
    const res = await userApi.getProfile();
    if (res.error) throw new Error(res.error);
    return res.data!.user;
  };

  const {
    data: profile,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: !!token,
  });

  useEffect(() => {
    const src = profile ?? user;
    if (src) {
      setEmail(src.email ?? '');
      setProfilePic(src.profilePic ?? '');
    }
  }, [profile, user]);

  const mutation = useMutation({
    mutationFn: async (updates: { profilePic?: string }) => {
      const res = await userApi.updateProfile(updates);
      if (res.error) throw new Error(res.error);
      return res.data!.user;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData({ queryKey: ['profile'] }, updatedUser);
      // update auth context so other parts of the app reflect changes
      if (token) {
        login(token, {
          id: updatedUser.id,
          email: updatedUser.email,
          profilePic: updatedUser.profilePic,
        } as any);
      }
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ profilePic });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <form onSubmit={handleSave} className="space-y-4">
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

        <div className="mb-3">
          <label className="block font-semibold mb-1">Profile picture URL</label>
          <input
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            placeholder="https://..."
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {mutation.isLoading ? 'Saving...' : 'Save'}
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
