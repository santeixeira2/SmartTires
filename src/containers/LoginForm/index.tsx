import React, { useState } from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './LoginForm.style';
import TextBox from '../../components/Common/TextBox';
import { LoginFormProps } from './LoginForm.types';

const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    isLoading, 
    error,
    onForgotPassword,
    onRegister
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter your email and password');
            return;
        }
        onSubmit({ email: email.trim(), password: password, rememberMe: rememberMe });
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>TST Smart Tire</Text>
                    <Text style={styles.subtitle}>Professional Tire Monitoring System</Text>
                </View>

                <View style={styles.formContainer}>
                    <TextBox
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        icon="mail-outline"
                        editable={!isLoading}
                    />
                    <TextBox 
                        placeholder='Enter your password'
                        value={password}
                        onChangeText={setPassword}
                        icon="lock-closed-outline"
                        secure={true}
                        editable={!isLoading}
                    />

                    {error && (
                        <View style={styles.errorContainer}>
                            <Icon name="alert-circle-outline" size={16} color="#dc3545" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.rememberMeContainer}
                        onPress={() => setRememberMe(!rememberMe)}
                        disabled={isLoading}
                    >
                        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                            {rememberMe && <Icon name="checkmark-outline" size={16} color="#fff" />}
                        </View>
                        <Text style={styles.rememberMeText}>Remember me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <Icon name="reload" size={20} color="#fff" style={styles.spinning} />
                            <Text style={styles.loginButtonText}>Signing In...</Text>
                        </View>
                        ) : (
                        <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.forgotPasswordContainer}
                        onPress={onForgotPassword}
                        disabled={isLoading}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={onRegister} disabled={isLoading}>
                        <Text style={styles.registerLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default LoginForm;