export interface ForgotPasswordContainerProps {
    onBackToLogin: () => void;
}

export interface ForgotPasswordFormProps {
    onSubmit: (email: string) => void;
    isLoading: boolean;
    error: string | null;
    success: string | null;
    onBackToLogin: () => void;
}

