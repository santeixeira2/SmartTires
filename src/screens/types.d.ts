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
    onResetPasswordSuccess: () => void;
    onBackToLogin: () => void;
}