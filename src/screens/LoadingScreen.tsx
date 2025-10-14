import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoadingScreen: React.FC<LoadingScreenProps> = ({
        message = 'Loading TST Smart Tire...'
    }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Ionicons name="car-sport" size={80} color="#007bff" />
                </View>
                <Text style={styles.title}>TST Smart Tire</Text>
                <ActivityIndicator size="large" color="#007bff" style={styles.spinner} />
                <Text style={styles.message}>{message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 30,
  },
  spinner: {
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default LoadingScreen; 