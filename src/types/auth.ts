export interface User {
  id: string;
  email: string;
  role: 'store_owner' | 'customer';
  name: string;
  preferences: Record<string, any>;
  phone?: string;
  address?: string;
  imageUrl?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}