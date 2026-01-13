import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { Staff, AuthState } from '@/types';
import { loginStaff, logoutStaff, getCurrentStaff } from '@/api/auth.api';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    staff: null,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
      const staff = storage.get<Staff>(STORAGE_KEYS.STAFF_DATA);

      if (token && staff) {
        setState({
          isAuthenticated: true,
          staff,
          token,
        });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginStaff({ email, password });

      if (response.success && response.data) {
        setState({
          isAuthenticated: true,
          staff: response.data.staff,
          token: response.data.token,
        });
        return { success: true };
      }

      return { success: false, error: response.error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutStaff();
      setState({
        isAuthenticated: false,
        staff: null,
        token: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
