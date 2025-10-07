import { StyleSheet } from 'react-native';

const loginStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 30,
      paddingVertical: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#212529',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: '#6c757d',
      textAlign: 'center',
    },
    formContainer: {
      marginBottom: 30,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#e9ecef',
      marginBottom: 16,
      paddingHorizontal: 16,
      height: 56,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#212529',
    },
    passwordContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    passwordToggle: {
      position: 'absolute',
      right: 16,
      top: 18,
      padding: 4,
      zIndex: 1,
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
    rememberMeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: '#6c757d',
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: '#007bff',
      borderColor: '#007bff',
    },
    rememberMeText: {
      fontSize: 16,
      color: '#495057',
    },
    loginButton: {
      backgroundColor: '#007bff',
      borderRadius: 12,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    loginButtonDisabled: {
      backgroundColor: '#6c757d',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spinning: {
      marginRight: 8,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    forgotPasswordContainer: {
      alignItems: 'center',
    },
    forgotPasswordText: {
      color: '#007bff',
      fontSize: 16,
      textDecorationLine: 'underline',
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    registerText: {
      fontSize: 16,
      color: '#6c757d',
    },
    registerLink: {
      fontSize: 16,
      color: '#007bff',
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
  });

export default loginStyles;