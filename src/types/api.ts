export interface User {
  id: number;
  username: string;
  phone: string;
  pushdeer_token?: string;
  status: 'admin' | 'trusted' | 'user' | 'disableduser';
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

export interface App {
  id?: number;
  app_id: string;
  name: string;
  description: string;
  required_permission_level: 'admin' | 'trusted' | 'user';
  is_active: boolean;
  secret_key?: string;
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
  id?: number;
  code: string;
  used?: boolean;
  used_by?: string | null;
  code_user_id?: number | null;
  time?: string;
  created_at?: string;
  used_at?: string | null;
}

// Response type for invite codes list
export interface InviteCodesResponse {
  invite_codes: InviteCode[];
  total: number;
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
  status: 'admin' | 'trusted' | 'user' | 'disableduser';
  phone: string;
  pushdeer_token: string;
}

export interface CreateAppRequest {
  app_id: string;
  name: string;
  description: string;
  required_permission_level: 'admin' | 'trusted' | 'user';
  is_active: boolean;
}

export interface UpdateAppRequest {
  name?: string;
  description?: string;
  required_permission_level?: 'admin' | 'trusted' | 'user';
  is_active?: boolean;
}

export interface UpdateUserRequest {
  phone?: string;
  pushdeer_token?: string;
}

export interface AdminUpdateUserRequest {
  username?: string;
  status?: 'admin' | 'trusted' | 'user' | 'disableduser';
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

// Users response structure from backend
export interface UsersResponse {
  users: User[];
  total: number;
}
