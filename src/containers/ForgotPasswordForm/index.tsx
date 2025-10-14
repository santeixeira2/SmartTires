import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { ForgotPasswordFormProps } from './ForgotPassword.types';

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  isLoading,
  error,
  success,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    onSubmit(email.trim());
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#28a745" />
          </View>
          
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successMessage}>
            We've sent password reset instructions to:
          </Text>
          <Text style={styles.emailText}>{email}</Text>
          
          <Text style={styles.instructions}>
            Please check your email and follow the link to reset your password. 
            The link will expire in 24 hours.
          </Text>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => onSubmit(email)}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="reload" size={20} color="#007bff" style={styles.spinning} />
                <Text style={styles.resendButtonText}>Sending...</Text>
              </View>
            ) : (
              <Text style={styles.resendButtonText}>Resend Email</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
            <Ionicons name="arrow-back" size={20} color="#007bff" />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
            <Ionicons name="arrow-back" size={24} color="#007bff" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Ionicons name="lock-open-outline" size={50} color="#007bff" />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6c757d" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={16} color="#dc3545" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Ionicons name="reload" size={20} color="#fff" style={styles.spinning} />
                <Text style={styles.submitButtonText}>Sending...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Don't remember your email address?{' '}
            <Text style={styles.helpLink}>Contact support</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordForm; 