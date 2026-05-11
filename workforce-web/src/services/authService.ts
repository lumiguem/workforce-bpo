import { http } from '@/api/http';

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await http.post<AuthResponse>('/api/auth/login', payload);
  return response.data;
}

