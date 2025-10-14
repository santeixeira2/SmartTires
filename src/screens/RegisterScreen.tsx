import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import RegisterContainer from '../containers/RegisterForm/RegisterContainer';

const RegisterScreen: React.FC<RegisterScreenProps> = ({
    onRegisterSuccess,
    onBackToLogin
}) => {
    return (
        <SafeAreaView style={{ flex: 1 , backgroundColor: '#f8f9fa'}}>
            <StatusBar barStyle='dark-content' backgroundColor='#f8f9fa'/>
            <RegisterContainer 
                onRegisterSuccess={onRegisterSuccess} 
                onBackToLogin={onBackToLogin} />
        </SafeAreaView>
    );
}

export default RegisterScreen;