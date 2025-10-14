import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ForgotPasswordContainer from '../containers/ForgotPasswordForm/ForgotPasswordContainer';

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
    onBackToLogin
}) => {
    return (
        <SafeAreaView style={{ flex: 1 , backgroundColor: '#f8f9fa'}}>
            <StatusBar barStyle='dark-content' backgroundColor='#f8f9fa'/>
            <ForgotPasswordContainer onBackToLogin={onBackToLogin} />
        </SafeAreaView>
    );
}

export default ForgotPasswordScreen;