import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RegisterUser from './RegisterUser';
import RegisterSetup from './RegisterSetup';
import RegisterSummary from './RegisterSummary';
import RegisterSyncSensor from './RegisterSyncSensor';

interface RegisterFormMultiStepProps {
  onSubmit: (data: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    role: 'power_unit' | 'multiple_units';
    companyId?: string;
    vehicleId?: string;
    vehicleType?: string;
    vehicleTireCount?: number;
    trailers?: Array<{ id: string; tireCount: number }>;
  }) => void;
  isLoading: boolean;
  error: string | null;
  onBackToLogin: () => void;
}

const RegisterFormMultiStep: React.FC<RegisterFormMultiStepProps> = ({
  onSubmit,
  isLoading,
  error,
  onBackToLogin,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDevNav, setShowDevNav] = useState(__DEV__); // Only show in development
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  } | null>(null);
  const [setupData, setSetupData] = useState<{
    role: 'power_unit' | 'multiple_units';
    vehicleName?: string;
    towingType?: string;
    axleTowingType?: string;
    towables?: Array<{
      id: string;
      name: string;
      type: string;
      axle: string;
      tireCount: number;
    }>;
  } | null>(null);

  // Development navigation
  const jumpToStep = (step: number) => {
    setCurrentStep(step);
    
    // Create mock data if needed for later steps
    if (step >= 2 && !userData) {
      setUserData({
        name: "Dev User",
        email: "dev@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
    }
    
    if (step >= 3 && !setupData) {
      setSetupData({
        role: "power_unit",
        vehicleName: "Dev Vehicle",
        towingType: "Towing Vehicles",
        axleTowingType: "2 Axles",
        towables: [],
      });
    }
  };

  const handleUserNext = (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setUserData(data);
    setCurrentStep(2);
  };

  const handleSetupComplete = (data: {
    role: 'power_unit' | 'multiple_units';
    vehicleName?: string;
    towingType?: string;
    axleTowingType?: string;
    towables?: Array<{
      id: string;
      name: string;
      type: string;
      axle: string;
      tireCount: number;
    }>;
  }) => {
    setSetupData(data);
    setCurrentStep(3);
  };

  const handleSummaryNext = () => {
    setCurrentStep(4);
  };

  const handleSyncComplete = () => {
    if (!userData || !setupData) {
      console.error('User data or setup data is missing');
      return;
    }

    const completeData = {
      ...userData,
      ...setupData,
    };

    onSubmit(completeData);
  };

  const handleBackToUser = () => {
    setCurrentStep(1);
  };

  const handleBackToLogin = () => {
    setCurrentStep(1);
    setUserData(null);
    setSetupData(null);
    onBackToLogin();
  };

  const handleBackToSetup = () => {
    setCurrentStep(2);
  };

  const handleBackToSummary = () => {
    setCurrentStep(3);
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <RegisterUser
          onNext={handleUserNext}
          isLoading={isLoading}
          error={error}
          onBackToLogin={handleBackToLogin}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <RegisterSetup
          onComplete={handleSetupComplete}
          onBack={handleBackToUser}
          isLoading={isLoading}
          error={error}
          initialData={setupData}
        />
      );
    }

    if (currentStep === 3) {
      return (
        <RegisterSummary
          onNext={handleSummaryNext}
          onBack={handleBackToSetup}
          isLoading={isLoading}
          error={error}
          setupData={setupData!}
        />
      );
    }

    if (currentStep === 4) {
      return (
        <RegisterSyncSensor
          onComplete={handleSyncComplete}
          onBack={handleBackToSummary}
          isLoading={isLoading}
          error={error}
          setupData={setupData!}
        />
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {renderStep()}
      
      {/* Development Navigation - Only in DEV mode */}
      {showDevNav && (
        <View style={styles.devNav}>
          <TouchableOpacity
            style={styles.devToggle}
            onPress={() => setShowDevNav(!showDevNav)}
          >
            <Text style={styles.devToggleText}>
              {showDevNav ? 'Hide Dev Nav' : 'Show Dev Nav'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.devButtons}>
            <TouchableOpacity
              style={[styles.devButton, currentStep === 1 && styles.devButtonActive]}
              onPress={() => jumpToStep(1)}
            >
              <Text style={styles.devButtonText}>Step 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.devButton, currentStep === 2 && styles.devButtonActive]}
              onPress={() => jumpToStep(2)}
            >
              <Text style={styles.devButtonText}>Step 2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.devButton, currentStep === 3 && styles.devButtonActive]}
              onPress={() => jumpToStep(3)}
            >
              <Text style={styles.devButtonText}>Step 3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.devButton, currentStep === 4 && styles.devButtonActive]}
              onPress={() => jumpToStep(4)}
            >
              <Text style={styles.devButtonText}>Step 4</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  devNav: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 8,
    zIndex: 1000,
  },
  devToggle: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 8,
  },
  devToggleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  devButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  devButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  devButtonActive: {
    backgroundColor: '#28a745',
  },
  devButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default RegisterFormMultiStep;
