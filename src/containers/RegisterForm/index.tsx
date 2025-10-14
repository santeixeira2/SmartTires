import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Alert, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './RegisterForm.styles';
import { 
    RegisterFormProps, 
    RegisterData 
} from './RegisterForm.types';

const RegisterForm: React.FC<RegisterFormProps> = ({
    onSubmit,
    isLoading, 
    error,
    onBackToLogin
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showDevNav, setShowDevNav ] = useState(__DEV__);
    const [userData, setUserData] = useState<RegisterData>();
    return (
        <>
            <View style={styles.container}>
                <Text>Register Form</Text>
            </View>
        </>
    );
}

export default RegisterForm;