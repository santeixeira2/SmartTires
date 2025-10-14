import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './index';
import { LoginContainerProps, LoginData } from './LoginForm.types';


const LoginContainer: React.FC<LoginContainerProps> = ({
    onLoginSuccess,
    onNavigateToRegister,
    onNavigateToForgotPassword,
}) => { 
    const { login, isLoading, error, clearError } = useAuth();

    const handleLogin = useCallback(
        async (data: LoginData) => {
            try {
                await login(data as LoginData);
                onLoginSuccess();
            } catch (error) {
                Alert.alert('Error', error instanceof Error ? error.message : 'Login failed');
            } finally {
                clearError();
            }
        },
        [login, onLoginSuccess, clearError]
    );
    
    const handleForgotPassword = useCallback(() => {
        onNavigateToForgotPassword();
    }, [onNavigateToForgotPassword]);

    const handleRegister = useCallback(() => {
        onNavigateToRegister();
    }, [onNavigateToRegister]);
    
    return (
        <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
            onForgotPassword={handleForgotPassword}
            onRegister={handleRegister}
        />
    );
};

export default LoginContainer;


