import React, { useState } from "react";
import { RegisterUserProps } from "./RegisterForm.types";
import { Alert, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RegisterLayout from "./RegisterLayout";
import TextBox from "../../components/Common/TextBox";
import Ionicons from "react-native-vector-icons/Ionicons";

const RegisterUser: React.FC<RegisterUserProps> = ({
  onNext,
  isLoading,
  error,
  onBackToLogin
}) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
  };

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return requirements;
  }

  const passwordRequirements = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const handleNext = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isPasswordValid) {
      Alert.alert('Error', 'Password does not meet requirements');
      return;
    }

    if (!passwordsMatch) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    onNext(formData);
  };

  return (
    <RegisterLayout
      onBack={onBackToLogin}
      title="Register"
      subtitle="Join TST Smart Tire today"
      progressPercentage={25}
      progressText="User Information"
      footerButton={{
        label: "Next Step",
        onPress: handleNext,
        disabled: !isPasswordValid || !passwordsMatch,
        loading: isLoading,
      }}
      isLoading={isLoading}
    >
      {/* Name Input */}
      <TextBox
        placeholder="Full Name"
        value={formData.name}
        onChangeText={(value: string) => updateFormData('name', value)}
        icon="person-outline"
        editable={!isLoading}
      />

      {/* Email Input */}
      <TextBox
        placeholder="Email Address"
        value={formData.email}
        onChangeText={(value: string) => updateFormData('email', value)}
        icon="mail-outline"
        editable={!isLoading}
      />

      {/* Password Input */}
      <TextBox
        placeholder="Password"
        value={formData.password}
        onChangeText={(value: string) => updateFormData('password', value)}
        icon="lock-closed-outline"
        secure={true}
        editable={!isLoading}
      />

      {/* Confirm Password Input */}
      <TextBox
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value: string) => updateFormData('confirmPassword', value)}
        icon="lock-closed-outline"
        secure={true}
        editable={!isLoading}
      />

      {/* Password Requirements */}
      <View style={styles.passwordRequirements}>
        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
        <View style={styles.requirementItem}>
          <Ionicons 
            name={passwordRequirements.length ? "checkmark-circle" : "ellipse-outline"} 
            size={16} 
            color={passwordRequirements.length ? "#28a745" : "#6c757d"} 
          />
          <Text style={[
            styles.requirementText,
            passwordRequirements.length && styles.requirementTextValid
          ]}>
            At least 8 characters
          </Text>
        </View>
        <View style={styles.requirementItem}>
          <Ionicons 
            name={passwordRequirements.uppercase ? "checkmark-circle" : "ellipse-outline"} 
            size={16} 
            color={passwordRequirements.uppercase ? "#28a745" : "#6c757d"} 
          />
          <Text style={[
            styles.requirementText,
            passwordRequirements.uppercase && styles.requirementTextValid
          ]}>
            One uppercase letter
          </Text>
        </View>
        <View style={styles.requirementItem}>
          <Ionicons 
            name={passwordRequirements.lowercase ? "checkmark-circle" : "ellipse-outline"} 
            size={16} 
            color={passwordRequirements.lowercase ? "#28a745" : "#6c757d"} 
          />
          <Text style={[
            styles.requirementText,
            passwordRequirements.lowercase && styles.requirementTextValid
          ]}>
            One lowercase letter
          </Text>
        </View>
        <View style={styles.requirementItem}>
          <Ionicons 
            name={passwordRequirements.number ? "checkmark-circle" : "ellipse-outline"} 
            size={16} 
            color={passwordRequirements.number ? "#28a745" : "#6c757d"} 
          />
          <Text style={[
            styles.requirementText,
            passwordRequirements.number && styles.requirementTextValid
          ]}>
            One number
          </Text>
        </View>
        <View style={styles.requirementItem}>
          <Ionicons 
            name={passwordRequirements.special ? "checkmark-circle" : "ellipse-outline"} 
            size={16} 
            color={passwordRequirements.special ? "#28a745" : "#6c757d"} 
          />
          <Text style={[
            styles.requirementText,
            passwordRequirements.special && styles.requirementTextValid
          ]}>
            One special character
          </Text>
        </View>
        {formData.confirmPassword.length > 0 && (
          <View style={styles.requirementItem}>
            <Ionicons 
              name={passwordsMatch ? "checkmark-circle" : "close-circle"} 
              size={16} 
              color={passwordsMatch ? "#28a745" : "#dc3545"} 
            />
            <Text style={[
              styles.requirementText,
              passwordsMatch ? styles.requirementTextValid : styles.requirementTextInvalid
            ]}>
              Passwords match
            </Text>
          </View>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={16} color="#dc3545" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Login Link */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={onBackToLogin} disabled={isLoading}>
          <Text style={styles.loginLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </RegisterLayout>
  );
}

const styles = StyleSheet.create({
  passwordRequirements: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 8,
  },
  requirementTextValid: {
    color: '#28a745',
  },
  requirementTextInvalid: {
    color: '#dc3545',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#6c757d',
  },
  loginLink: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});


export default RegisterUser;