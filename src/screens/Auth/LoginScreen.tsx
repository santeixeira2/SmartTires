import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import LoginContainer from '../../containers/LoginContainer';

const LoginScreen: React.FC<LoginScreenProps> = (
    { onLoginSuccess, onNavigateToRegister, onNavigateToForgotPassword }
  ) => {
    return (
      <SafeAreaView style={{ flex: 1 , backgroundColor: '#f8f9fa'}}>
        <StatusBar barStyle='dark-content' backgroundColor='#f8f9fa'/>
        <LoginContainer 
          onLoginSuccess={onLoginSuccess} 
          onNavigateToRegister={onNavigateToRegister} 
          onNavigateToForgotPassword={onNavigateToForgotPassword} 
        />
      </SafeAreaView>
  )
}

export default LoginScreen;