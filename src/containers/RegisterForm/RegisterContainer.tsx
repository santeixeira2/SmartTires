import React, { useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import RegisterForm from './index';
import { RegisterContainerProps } from './RegisterForm.types';
import { RegisterData } from '../../types/Auth';

const RegisterContainer: React.FC<RegisterContainerProps> = ({
    onRegisterSuccess,
    onBackToLogin
}) => {
    const { register, isLoading, error, clearError } = useAuth();

    const handleRegister = useCallback(async (data: RegisterData ) => {
        try { 
            await register(data as RegisterData);
            onRegisterSuccess();
        } catch (error) {
            console.error("Registration failed: ", error);
        }
        
    }, [register, onRegisterSuccess]);

    return (
        <RegisterForm
            onSubmit={(data) => { handleRegister(data); }}
            isLoading={isLoading}
            error={error}
            onBackToLogin={onBackToLogin}
        />
    );
}

export default RegisterContainer;