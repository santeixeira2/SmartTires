import React, { useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ForgotPasswordForm from './index';
import { ForgotPasswordContainerProps } from './ForgotPassword.types';

const ForgotPasswordContainer: React.FC<ForgotPasswordContainerProps> = ({
  onBackToLogin,
}) => {
  const { forgotPassword, isLoading, error, forgotPasswordSuccess, resetForgotPasswordState } = useAuth();

  const handleForgotPassword = useCallback(async (email: string) => {
    try {
      await forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  }, [forgotPassword]);

  const handleBackToLogin = useCallback(() => {
    resetForgotPasswordState();
    onBackToLogin();
  }, [resetForgotPasswordState, onBackToLogin]);

  return (
    <ForgotPasswordForm
      onSubmit={handleForgotPassword}
      isLoading={isLoading}
      error={error}
      success={forgotPasswordSuccess ? 'Password reset email sent' : null}
      onBackToLogin={handleBackToLogin}
    />
  );
};

export default ForgotPasswordContainer; 