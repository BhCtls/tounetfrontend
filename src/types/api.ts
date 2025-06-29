export interface User {
  id: number;
  username: string;
  phone: string;
  pushdeer_token: string;
  status: 'admin' | 'user' | 'disabled';
  created_at: string;
  updated_at: string;
}

export interface App {
  id: number;
  app_id: string;
  name: string;
  description: string;
  required_permission_level: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NKey {
  id: number;
  nkey: string;
  username: string;
  app_ids: string[];
  is_used: boolean;
  expires_at: string;
  created_at: string;
  used_at?: string;
}

export interface InviteCode {
  id: number;
  code: string;
  is_used: boolean;
  used_by?: string;
  created_at: string;
  used_at?: string;
}

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  resource_type: string;
  resource_id: string;
  details: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  phone: string;
  pushdeer_token: string;
  invite_code: string;
}

export interface GenerateNKeyRequest {
  username: string[];
  app_ids: string[];
}

export interface ValidateNKeyRequest {
  nkey: string;
  app_id: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  status: 'admin' | 'user' | 'disabled';
  phone: string;
  pushdeer_token: string;
}

export interface CreateAppRequest {
  app_id: string;
  name: string;
  description: string;
  required_permission_level: 'admin' | 'user';
  is_active: boolean;
}

export interface UpdateUserRequest {
  phone?: string;
  pushdeer_token?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
