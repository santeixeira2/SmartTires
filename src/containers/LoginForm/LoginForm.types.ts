export interface LoginContainerProps {
    onLoginSuccess: () => void;
    onNavigateToRegister: () => void;
    onNavigateToForgotPassword: () => void;
  }

  export interface LoginData {
    email: string;
    password: string;
    rememberMe: boolean;
  }

  export interface LoginFormProps {
    onSubmit: (data: LoginData) => void;
    isLoading: boolean;
    error: string | null;
    onForgotPassword: () => void;
    onRegister: () => void;
  }