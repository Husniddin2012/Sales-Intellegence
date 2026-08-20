import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserDto, LoginRequestDto, RegisterRequestDto, ForgotPasswordRequestDto, VerifyOtpRequestDto, ResetPasswordRequestDto, AuthResponseDto } from '../types';
import { api } from '../services/api';

export interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  users: UserDto[];
  refreshUsers: () => Promise<void>;
  login: (req: LoginRequestDto) => Promise<AuthResponseDto>;
  register: (req: RegisterRequestDto) => Promise<AuthResponseDto>;
  forgotPassword: (req: ForgotPasswordRequestDto) => Promise<AuthResponseDto>;
  verifyOtp: (req: VerifyOtpRequestDto) => Promise<AuthResponseDto>;
  resetPassword: (req: ResetPasswordRequestDto) => Promise<AuthResponseDto>;
  logout: () => void;
}

const ONLY_ADMIN_USER: UserDto = {
  id: "usr-admin-01",
  fullName: "Boshqaruvchi (Admin)",
  email: "admin",
  companyName: "ITLive Global Inc.",
  role: "Boshqaruvchi / Biznes Egasi",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(() => {
    const saved = localStorage.getItem('sales_intel_user');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.email === 'admin' || parsed.email === 'admin@salesintel.uz')) {
          return { ...parsed, email: 'admin' };
        }
        return parsed;
      } catch { 
        return null; 
      }
    }
    return null; // Boshida hech kim kirmagan holatda bo'lsin (AuthPage ochiladi)
  });

  const [users, setUsers] = useState<UserDto[]>([ONLY_ADMIN_USER]);

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('sales_intel_token') || null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const refreshUsers = async () => {
    try {
      const serverUsers = await api.getUsers();
      if (serverUsers && serverUsers.length > 0) {
        setUsers(serverUsers);
        localStorage.setItem('sales_intel_all_users', JSON.stringify(serverUsers));
      }
    } catch {
      // Use local users
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const saveAuthSession = (authToken: string, authUser: UserDto) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('sales_intel_token', authToken);
    localStorage.setItem('sales_intel_user', JSON.stringify(authUser));

    setUsers(prev => {
      const exists = prev.some(u => u.id === authUser.id || u.email.toLowerCase() === authUser.email.toLowerCase());
      const updated = exists ? prev.map(u => (u.id === authUser.id || u.email === authUser.email ? authUser : u)) : [authUser, ...prev];
      localStorage.setItem('sales_intel_all_users', JSON.stringify(updated));
      return updated;
    });
  };

  const login = async (req: LoginRequestDto): Promise<AuthResponseDto> => {
    setIsLoading(true);
    try {
      const res = await api.login(req);
      if (res.success && res.token && res.user) {
        saveAuthSession(res.token, res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (req: RegisterRequestDto): Promise<AuthResponseDto> => {
    setIsLoading(true);
    try {
      const res = await api.register(req);
      if (res.success && res.token && res.user) {
        saveAuthSession(res.token, res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (req: ForgotPasswordRequestDto): Promise<AuthResponseDto> => {
    setIsLoading(true);
    try {
      return await api.forgotPassword(req);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (req: VerifyOtpRequestDto): Promise<AuthResponseDto> => {
    setIsLoading(true);
    try {
      return await api.verifyOtp(req);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (req: ResetPasswordRequestDto): Promise<AuthResponseDto> => {
    setIsLoading(true);
    try {
      const res = await api.resetPassword(req);
      if (res.success && res.token && res.user) {
        saveAuthSession(res.token, res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sales_intel_token');
    localStorage.removeItem('sales_intel_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        users,
        refreshUsers,
        login,
        register,
        forgotPassword,
        verifyOtp,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
