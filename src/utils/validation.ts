import { LoginCredentials, RegisterData, ValidationError } from '../types/Auth';

// Email Validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password Validation
export const isStrongPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';
  if (password.length < 8) return 'medium';
  if (isStrongPassword(password)) return 'strong';
  return 'medium';
};

export const validateLoginForm = (credentials: LoginCredentials): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!credentials.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(credentials.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!credentials.password.trim()) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (credentials.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  return errors;
};

export const validateRegisterForm = (data: RegisterData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!data.name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
  } else if (!isStrongPassword(data.password)) {
    errors.push({ 
      field: 'password', 
      message: 'Password must contain uppercase, lowercase, and number' 
    });
  }

  if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  if (!data.role) {
    errors.push({ field: 'role', message: 'Please select a role' });
  }

  return errors;
};

export const validatePasswordResetRequest = (email: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  return errors;
};

export const validatePasswordResetConfirm = (
  token: string, 
  newPassword: string, 
  confirmPassword: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!token) {
    errors.push({ field: 'token', message: 'Reset token is required' });
  }

  if (!newPassword) {
    errors.push({ field: 'newPassword', message: 'New password is required' });
  } else if (newPassword.length < 8) {
    errors.push({ field: 'newPassword', message: 'Password must be at least 8 characters' });
  } else if (!isStrongPassword(newPassword)) {
    errors.push({ 
      field: 'newPassword', 
      message: 'Password must contain uppercase, lowercase, and number' 
    });
  }

  if (newPassword !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return errors;
};

export const validateRequired = (value: string, fieldName: string): ValidationError[] => {
  if (!value || !value.trim()) {
    return [{ field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` }];
  }
  return [];
};

export const validateMinLength = (value: string, fieldName: string, minLength: number): ValidationError[] => {
  if (value && value.length < minLength) {
    return [{ field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${minLength} characters` }];
  }
  return [];
};

export const validateMaxLength = (value: string, fieldName: string, maxLength: number): ValidationError[] => {
  if (value && value.length > maxLength) {
    return [{ field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be no more than ${maxLength} characters` }];
  }
  return [];
};

export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find(err => err.field === fieldName);
  return error ? error.message : null;
};

export const hasFormErrors = (errors: ValidationError[]): boolean => {
  return errors.length > 0;
}; 