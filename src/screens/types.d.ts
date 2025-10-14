interface LoadingScreenProps {
    message?: string;
}

interface LoginScreenProps { 
    onLoginSuccess: () => void;
    onNavigateToRegister: () => void;
    onNavigateToForgotPassword: () => void;
}

interface RegisterScreenProps {
    onRegisterSuccess: () => void;
    onBackToLogin: () => void;
}

interface ForgotPasswordScreenProps {
    onBackToLogin: () => void;
}

interface HomeScreenProps {
  frontLeft: TireData;
  frontRight: TireData;
  rearLeft: TireData;
  rearRight: TireData;
}