import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { AuthState, LoginCredentials, User, AuthResponse, RegisterData } from '../types/Auth';
import { validateLoginForm, validateRegisterForm, validatePasswordResetRequest } from '../utils/validation';

// Mock authentication service - replace with real API calls
const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation
    if (credentials.email === 'demo@tstsmarttire.com' && credentials.password === 'Demo123!') {
      return {
        success: true,
        user: {
          id: '1',
          email: credentials.email,
          name: 'Demo Driver',
          role: 'driver',
          vehicleId: 'TRUCK-001',
          lastLogin: new Date(),
        },
        token: 'mock-jwt-token-12345',
        message: 'Login successful',
      };
    }
    
    throw new Error('Invalid email or password');
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock validation - check if email already exists
    if (data.email === 'demo@tstsmarttire.com') {
      throw new Error('Email already registered');
    }
    
    return {
      success: true,
      user: {
        id: '2',
        email: data.email,
        name: data.name,
        role: data.role,
        companyId: data.companyId,
        vehicleId: data.vehicleId,
        lastLogin: new Date(),
      },
      token: 'mock-jwt-token-new-user',
      message: 'Registration successful',
    };
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation
    if (email === 'nonexistent@example.com') {
      throw new Error('Email not found');
    }
    
    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  },
  
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Clear stored tokens, etc.
  },
  
  checkAuthStatus: async (): Promise<AuthResponse | null> => {
    // Check if user is already logged in (stored token, etc.)
    const storedToken = await getStoredToken();
    if (storedToken) {
      return {
        success: true,
        user: {
          id: '1',
          email: 'demo@tstsmarttire.com',
          name: 'Demo Driver',
          role: 'driver',
          vehicleId: 'TRUCK-001',
          lastLogin: new Date(),
        },
        token: storedToken,
      };
    }
    return null;
  },
};

// Storage utilities (replace with AsyncStorage or secure storage)
const getStoredToken = async (): Promise<string | null> => {
  // Mock implementation - replace with actual storage
  return null;
};

const storeToken = async (token: string): Promise<void> => {
  // Mock implementation - replace with actual storage
  console.log('Storing token:', token);
};

const removeStoredToken = async (): Promise<void> => {
  // Mock implementation - replace with actual storage
  console.log('Removing stored token');
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    token: null,
  });
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const authResponse = await mockAuthService.checkAuthStatus();
      
      if (authResponse) {
        setAuthState({
          user: authResponse.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          token: authResponse.token,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          token: null,
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to check authentication status',
        token: null,
      });
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      console.log('Login attempt with credentials:', credentials);
      
      // Validate form
      const validationErrors = validateLoginForm(credentials);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors[0].message;
        console.log('Validation errors:', validationErrors);
        setAuthState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        return;
      }

      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const authResponse = await mockAuthService.login(credentials);
      console.log('Auth response:', authResponse);
      
      // Store token if remember me is checked
      if (credentials.rememberMe) {
        await storeToken(authResponse.token);
      }
      
      setAuthState({
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: authResponse.token,
      });
      
      console.log('Login successful, setting isAuthenticated to true');
      console.log('Current auth state after login:', {
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: authResponse.token,
      });
      Alert.alert('Success', 'Login successful!');
      
    } catch (error) {
      console.log('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await mockAuthService.logout();
      await removeStoredToken();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,
      });
      
      Alert.alert('Success', 'Logged out successfully');
      
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Logout failed',
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      // Validate form
      const validationErrors = validateRegisterForm(data);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors[0].message;
        setAuthState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        return;
      }

      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const authResponse = await mockAuthService.register(data);
      
      setAuthState({
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: authResponse.token,
      });
      
      Alert.alert('Success', 'Registration successful! Welcome to TST Smart Tire.');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      // Validate email
      const validationErrors = validatePasswordResetRequest(email);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors[0].message;
        setAuthState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        return;
      }

      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await mockAuthService.forgotPassword(email);
      
      setForgotPasswordSuccess(true);
      setAuthState(prev => ({ ...prev, isLoading: false, error: null }));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const resetForgotPasswordState = useCallback(() => {
    setForgotPasswordSuccess(false);
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  }, []);

  return {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    token: authState.token,
    forgotPasswordSuccess,
    
    // Actions
    login,
    register,
    forgotPassword,
    logout,
    clearError,
    updateUser,
    checkAuthStatus,
    resetForgotPasswordState,
  };
}; 