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
import { Ionicons } from 'react-native-vector-icons';
import loginStyles from './loginStyles';
import TextBox from '../../Common/TextBox';
import { LoginFormProps } from '../../types';

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
        onSubmit(email.trim(), password, rememberMe);
    }

    return (
        <KeyboardAvoidingView
            style={loginStyles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={loginStyles.scrollContent}>
                <View style={loginStyles.header}>
                    <Text style={loginStyles.title}>TST Smart Tire</Text>
                    <Text style={loginStyles.subtitle}>Professional Tire Monitoring System</Text>
                </View>

                <View style={loginStyles.formContainer}>
                    <TextBox
                        label="Email"
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
                        <View style={loginStyles.errorContainer}>
                            <Ionicons name="alert-circle-outline" size={16} color="#dc3545" />
                            <Text style={loginStyles.errorText}>{error}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={loginStyles.rememberMeContainer}
                        onPress={() => setRememberMe(!rememberMe)}
                        disabled={isLoading}
                    >
                        <View style={[loginStyles.checkbox, rememberMe && loginStyles.checkboxChecked]}>
                            {rememberMe && <Ionicons name="checkmark-outline" size={16} color="#fff" />}
                        </View>
                        <Text style={loginStyles.rememberMeText}>Remember me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[loginStyles.loginButton, isLoading && loginStyles.loginButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                        <View style={loginStyles.loadingContainer}>
                            <Ionicons name="reload" size={20} color="#fff" style={loginStyles.spinning} />
                            <Text style={loginStyles.loginButtonText}>Signing In...</Text>
                        </View>
                        ) : (
                        <Text style={loginStyles.loginButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={loginStyles.forgotPasswordContainer}
                        onPress={onForgotPassword}
                        disabled={isLoading}
                    >
                        <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <View style={loginStyles.registerContainer}>
                    <Text style={loginStyles.registerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={onRegister} disabled={isLoading}>
                        <Text style={loginStyles.registerLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default LoginForm;