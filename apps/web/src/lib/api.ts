const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  details?: { field: string; message: string }[];
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
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

// Car API
export interface Car {
  _id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  color?: string;
}

export interface CreateCarData {
  brand: string;
  carModel: string;
  year: number;
  color?: string;
}

export const carApi = {
  getCars: () => fetchApi<{ count: number; cars: Car[] }>('/cars'),

  createCar: (data: CreateCarData) =>
    fetchApi<{ message: string; car: Car }>('/cars', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCarById: (id: string) => fetchApi<{ car: Car }>(`/cars/${id}`),

  updateCar: (id: string, data: Partial<CreateCarData>) =>
    fetchApi<{ message: string; car: Car }>(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCar: (id: string) =>
    fetchApi<{ message: string }>(`/cars/${id}`, {
      method: 'DELETE',
    }),
};
