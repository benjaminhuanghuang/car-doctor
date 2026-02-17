const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  details?: { field: string; message: string }[];
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token?.replace(/"/g, '')}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || `HTTP error! status: ${response.status}`,
        message: data.message,
        details: data.details,
      };
    }

    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

// Auth API
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    profilePic?: string;
  };
}

export const authApi = {
  register: (data: RegisterData) =>
    fetchApi<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginData) =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export default fetchApi;

// User API
export const userApi = {
  getProfile: () =>
    fetchApi<{ user: { id: string; email: string; profilePic?: string } }>('/user/profile'),

  updateProfile: (data: { email?: string; profilePic?: string }) =>
    fetchApi<{
      message: string;
      user: { id: string; email: string; profilePic?: string };
    }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    fetchApi<{ message: string }>('/user/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const uploadApi = {
  getCloudinarySignature: () =>
    fetchApi<{ timestamp: number; signature: string }>('/cloudinary-signature', {
      method: 'GET',
    }),

  deleteFile: (cloudinaryUrl: string) =>
    fetchApi<{ message: string }>('/delete-file', {
      method: 'DELETE',
      body: JSON.stringify({ cloudinaryUrl }),
    }),
};
