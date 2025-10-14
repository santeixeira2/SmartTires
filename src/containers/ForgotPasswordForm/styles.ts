import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    content: {
      flex: 1,
      paddingHorizontal: 30,
      paddingVertical: 20,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
      position: 'relative',
    },
    backButton: {
      position: 'absolute',
      left: 0,
      top: 10,
      padding: 10,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#e3f2fd',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#212529',
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#6c757d',
      textAlign: 'center',
      lineHeight: 22,
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
    submitButton: {
      backgroundColor: '#007bff',
      borderRadius: 12,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    submitButtonDisabled: {
      backgroundColor: '#6c757d',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spinning: {
      marginRight: 8,
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    helpContainer: {
      alignItems: 'center',
    },
    helpText: {
      fontSize: 14,
      color: '#6c757d',
      textAlign: 'center',
    },
    helpLink: {
      color: '#007bff',
      fontWeight: '600',
    },
    // Success state styles
    successIconContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#212529',
      marginBottom: 12,
      textAlign: 'center',
    },
    successMessage: {
      fontSize: 16,
      color: '#6c757d',
      textAlign: 'center',
      marginBottom: 8,
    },
    emailText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#007bff',
      textAlign: 'center',
      marginBottom: 20,
    },
    instructions: {
      fontSize: 14,
      color: '#6c757d',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 30,
    },
    resendButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#007bff',
      borderRadius: 12,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    resendButtonText: {
      color: '#007bff',
      fontSize: 16,
      fontWeight: '600',
    },
    backButtonText: {
      color: '#007bff',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

export default styles;