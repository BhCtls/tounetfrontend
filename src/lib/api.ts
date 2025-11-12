import axios from 'axios';
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  User,
  App,
  NKey,
  InviteCode,
  GenerateNKeyRequest,
  AdminGenerateNKeyRequest,
  ValidateNKeyRequest,
  CreateUserRequest,
  CreateAppRequest,
  UpdateUserRequest,
  PaginatedResponse,
  AuditLog
} from '../types/api';

//const API_BASE_URL = 'http://192.168.1.6:44544/api/v1';
const API_BASE_URL = 'https://api.riv62hjux.nyat.app:43419/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post('/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response = await apiClient.post('/register', data);
    return response.data;
  },
};

// User API
export const userApi = {
  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/user/me');
    return response.data;
  },

  updateMe: async (data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    const response = await apiClient.put('/user/me', data);
    return response.data;
  },

  getMyApps: async (): Promise<ApiResponse<App[]>> => {
    const response = await apiClient.get('/user/apps');
    return response.data;
  },
};

// Public API (no auth required)
export const publicApi = {
  getPublicApps: async (): Promise<ApiResponse<App[]>> => {
    const response = await axios.get(`${API_BASE_URL}/apps/public`);
    return response.data;
  },

  // Jackets APIs
  // Note: this returns the image as Blob so the caller can create an object URL
    // Unified jackets endpoint:
    //   GET /jacket/:game/:sort              -> returns plain text list (absolute paths), one per line
    //   GET /jacket/:game/:sort/:name        -> returns image (first matching file by partial name)
    getJacketList: async (game: string, sort: string): Promise<string[]> => {
      const response = await axios.get(`${API_BASE_URL}/jacket/${encodeURIComponent(game)}/${encodeURIComponent(sort)}`, {
        responseType: 'text'
      });
      // Split plain text lines, trim blanks
      const text: string = response.data || '';
      return text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0);
    },
    // Returns image blob for partial name match
    getJacketFile: async (game: string, sort: string, name: string): Promise<Blob> => {
      const response = await axios.get(`${API_BASE_URL}/jacket/${encodeURIComponent(game)}/${encodeURIComponent(sort)}/${encodeURIComponent(name)}`,
        { responseType: 'blob' });
      return response.data;
    },

  getFontFile: async (): Promise<Blob> => {
    const response = await axios.get(`${API_BASE_URL}/font`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getBackgroundFile: async (): Promise<Blob> => {
    const response = await axios.get(`${API_BASE_URL}/background`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// NKey API
export const nkeyApi = {
  generate: async (data: GenerateNKeyRequest): Promise<ApiResponse<NKey>> => {
    const response = await apiClient.post('/nkey/generate', data);
    return response.data;
  },

  validate: async (data: ValidateNKeyRequest): Promise<ApiResponse<{ valid: boolean }>> => {
    const response = await apiClient.post('/nkey/validate', data);
    return response.data;
  },
};

// Admin API
export const adminApi = {
  // User management
  getUsers: async (page = 1, size = 10): Promise<ApiResponse<PaginatedResponse<User>>> => {
    const response = await apiClient.get(`/admin/users?page=${page}&size=${size}`);
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<ApiResponse<User>> => {
    const response = await apiClient.post('/admin/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<CreateUserRequest>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  // App management
  getApps: async (): Promise<ApiResponse<App[]>> => {
    const response = await apiClient.get('/admin/apps');
    return response.data;
  },

  createApp: async (data: CreateAppRequest): Promise<ApiResponse<App>> => {
    const response = await apiClient.post('/admin/apps', data);
    return response.data;
  },

  updateApp: async (id: number, data: Partial<CreateAppRequest>): Promise<ApiResponse<App>> => {
    const response = await apiClient.put(`/admin/apps/${id}`, data);
    return response.data;
  },

  deleteApp: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/admin/apps/${id}`);
    return response.data;
  },

  // Invite codes
  getInviteCodes: async (): Promise<ApiResponse<InviteCode[]>> => {
    const response = await apiClient.get('/admin/invite-codes');
    return response.data;
  },

  generateInviteCode: async (): Promise<ApiResponse<InviteCode>> => {
    const response = await apiClient.post('/admin/invite-codes');
    return response.data;
  },

  deleteInviteCode: async (code: string): Promise<ApiResponse<{ deleted_code: string }>> => {
    const response = await apiClient.post(`/admin/invite-codes/${code}/delete`);
    return response.data;
  },

  // NKey management
  generateNKey: async (data: AdminGenerateNKeyRequest): Promise<ApiResponse<NKey>> => {
    const response = await apiClient.post('/admin/nkey/generate', data);
    return response.data;
  },

  // Audit logs
  getAuditLogs: async (page = 1, size = 10): Promise<ApiResponse<PaginatedResponse<AuditLog>>> => {
    const response = await apiClient.get(`/admin/audit-logs?page=${page}&size=${size}`);
    return response.data;
  },
};

export default apiClient;
