import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../lib/api';
import { isTokenExpired } from '../lib/utils';
import { PermissionUtils } from '../lib/permissions';
import type { User } from '../types/api';
import type { PermissionLevel } from '../lib/permissions';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTrusted: boolean;
  hasPermission: (requiredLevel: PermissionLevel) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken && !isTokenExpired(storedToken) ? storedToken : null;
  });

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await userApi.getMe();
      return response.data;
    },
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (error || (token && isTokenExpired(token))) {
      logout();
    }
  }, [error, token]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.status === 'admin';
  const isTrusted = PermissionUtils.hasPermission(user?.status || 'disableduser', 'trusted');
  
  const hasPermission = (requiredLevel: PermissionLevel): boolean => {
    if (!user) return false;
    return PermissionUtils.hasPermission(user.status, requiredLevel);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated,
        isAdmin,
        isTrusted,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
