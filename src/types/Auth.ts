// Authentication Types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    companyId?: string;
    vehicleId?: string;
    lastLogin: Date;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    token: string | null;
  }
  
  export interface AuthResponse {
    success: boolean;
    user: User;
    token: string;
    message?: string;
  }
  
  export interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    role: 'power_unit' | 'multiple_units';
    companyId?: string;
    vehicleId?: string;
    vehicleType?: string;
    vehicleTireCount?: number;
    trailers?: Array<{ id: string; tireCount: number }>;
  }
  
  // Password Reset Types
  export interface PasswordResetRequest {
    email: string;
  }
  
  export interface PasswordResetConfirm {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  // Validation Types
  export interface ValidationError {
    field: string;
    message: string;
  }
  
  export interface LoginValidation {
    email: string;
    password: string;
  }
  
  // Session Management
  export interface SessionData {
    token: string;
    expiresAt: Date;
    refreshToken?: string;
  }
  
  // Biometric Authentication
  export interface BiometricConfig {
    enabled: boolean;
    type: 'fingerprint' | 'face' | 'none';
    fallbackToPassword: boolean;
  } 