import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RegisterUser from './RegisterUser';
import RegisterSetup from './RegisterSetup';
import RegisterSummary from './RegisterSummary';
import RegisterSyncSensor from './RegisterSyncSensor';
import { useAppActions } from '../../store/AppStore';
import { RegistrationData } from '../../store/AppStore';

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
  const { setRegistrationData, setDemoUser, setVehiclesData } = useAppActions();
  
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
  const [syncedVehicles, setSyncedVehicles] = useState<{[key: string]: boolean}>({});
  const [vehicleSensorIds, setVehicleSensorIds] = useState<{[key: string]: {[key: string]: string}}>({});

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

  // Generate tire data based on axle type
  const generateTireDataForAxle = (axleType: string) => {
    switch (axleType) {
      case '1 Axle':
        return {
          'left': { psi: 30 + Math.random() * 5, temp: 20 + Math.random() * 10 },
          'right': { psi: 30 + Math.random() * 5, temp: 20 + Math.random() * 10 }
        };
        
      case '2 Axles':
        return {
          'front-left': { psi: 32 + Math.random() * 3, temp: 22 + Math.random() * 8 },
          'front-right': { psi: 31 + Math.random() * 3, temp: 23 + Math.random() * 8 },
          'rear-left': { psi: 28 + Math.random() * 3, temp: 25 + Math.random() * 8 },
          'rear-right': { psi: 29 + Math.random() * 3, temp: 24 + Math.random() * 8 }
        };
        
      case '3 Axles':
        return {
          'front-left': { psi: 32 + Math.random() * 3, temp: 22 + Math.random() * 8 },
          'front-right': { psi: 31 + Math.random() * 3, temp: 23 + Math.random() * 8 },
          'middle-left': { psi: 30 + Math.random() * 3, temp: 24 + Math.random() * 8 },
          'middle-right': { psi: 29 + Math.random() * 3, temp: 25 + Math.random() * 8 },
          'rear-left': { psi: 28 + Math.random() * 3, temp: 26 + Math.random() * 8 },
          'rear-right': { psi: 27 + Math.random() * 3, temp: 27 + Math.random() * 8 }
        };
        
      case '4 Axles':
        return {
          'front-left': { psi: 32 + Math.random() * 3, temp: 22 + Math.random() * 8 },
          'front-right': { psi: 31 + Math.random() * 3, temp: 23 + Math.random() * 8 },
          'front-middle-left': { psi: 30 + Math.random() * 3, temp: 24 + Math.random() * 8 },
          'front-middle-right': { psi: 29 + Math.random() * 3, temp: 25 + Math.random() * 8 },
          'rear-middle-left': { psi: 28 + Math.random() * 3, temp: 26 + Math.random() * 8 },
          'rear-middle-right': { psi: 27 + Math.random() * 3, temp: 27 + Math.random() * 8 },
          'rear-left': { psi: 26 + Math.random() * 3, temp: 28 + Math.random() * 8 },
          'rear-right': { psi: 25 + Math.random() * 3, temp: 29 + Math.random() * 8 }
        };
        
      case '5 Axles':
        return {
          'front-left': { psi: 32 + Math.random() * 3, temp: 22 + Math.random() * 8 },
          'front-right': { psi: 31 + Math.random() * 3, temp: 23 + Math.random() * 8 },
          'axle2-left': { psi: 30 + Math.random() * 3, temp: 24 + Math.random() * 8 },
          'axle2-right': { psi: 29 + Math.random() * 3, temp: 25 + Math.random() * 8 },
          'axle3-left': { psi: 28 + Math.random() * 3, temp: 26 + Math.random() * 8 },
          'axle3-right': { psi: 27 + Math.random() * 3, temp: 27 + Math.random() * 8 },
          'axle4-left': { psi: 26 + Math.random() * 3, temp: 28 + Math.random() * 8 },
          'axle4-right': { psi: 25 + Math.random() * 3, temp: 29 + Math.random() * 8 },
          'rear-left': { psi: 24 + Math.random() * 3, temp: 30 + Math.random() * 8 },
          'rear-right': { psi: 23 + Math.random() * 3, temp: 31 + Math.random() * 8 }
        };
        
      case '6 Axles':
        return {
          'front-left': { psi: 32 + Math.random() * 3, temp: 22 + Math.random() * 8 },
          'front-right': { psi: 31 + Math.random() * 3, temp: 23 + Math.random() * 8 },
          'axle2-left': { psi: 30 + Math.random() * 3, temp: 24 + Math.random() * 8 },
          'axle2-right': { psi: 29 + Math.random() * 3, temp: 25 + Math.random() * 8 },
          'axle3-left': { psi: 28 + Math.random() * 3, temp: 26 + Math.random() * 8 },
          'axle3-right': { psi: 27 + Math.random() * 3, temp: 27 + Math.random() * 8 },
          'axle4-left': { psi: 26 + Math.random() * 3, temp: 28 + Math.random() * 8 },
          'axle4-right': { psi: 25 + Math.random() * 3, temp: 29 + Math.random() * 8 },
          'axle5-left': { psi: 24 + Math.random() * 3, temp: 30 + Math.random() * 8 },
          'axle5-right': { psi: 23 + Math.random() * 3, temp: 31 + Math.random() * 8 },
          'rear-left': { psi: 22 + Math.random() * 3, temp: 32 + Math.random() * 8 },
          'rear-right': { psi: 21 + Math.random() * 3, temp: 33 + Math.random() * 8 }
        };
        
      default:
        // Fallback to 2 axles
        return {
          'front-left': { psi: 32, temp: 25 },
          'front-right': { psi: 31, temp: 26 },
          'rear-left': { psi: 28, temp: 30 },
          'rear-right': { psi: 29, temp: 28 }
        };
    }
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

    // Create comprehensive registration JSON
    const registrationData: RegistrationData = {
      user: {
        name: userData.name,
        email: userData.email,
        role: setupData.role,
        registrationDate: new Date().toISOString(),
      },
      vehicle: {
        name: setupData.vehicleName || 'Unknown Vehicle',
        type: setupData.towingType || 'Unknown Type',
        axleType: setupData.axleTowingType || 'Unknown Axle',
        role: 'power_unit', // Main vehicle is always a power unit
      },
      towables: setupData.towables || [],
      syncedVehicles: syncedVehicles,
      vehicleSensorIds: vehicleSensorIds,
      syncStatus: {
        totalVehicles: Object.keys(syncedVehicles).length,
        syncedCount: Object.values(syncedVehicles).filter(Boolean).length,
        allSynced: Object.values(syncedVehicles).every(Boolean),
      },
      metadata: {
        registrationStep: 'completed',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      }
    };

    console.log('🚀 REGISTRATION COMPLETE - Final JSON Data:');
    console.log(JSON.stringify(registrationData, null, 2));

    // Save to store
    setRegistrationData(registrationData);
    
    // Check if this is demo user
    const isDemoUser = userData.email === 'demo@tstsmarttires.com';
    setDemoUser(isDemoUser);
    
    // Generate vehicles data from registration
    const vehicles = [];
    
    // Add main vehicle
    vehicles.push({
      id: 'main-vehicle',
      name: registrationData.vehicle.name,
      towingType: registrationData.vehicle.role === 'power_unit' ? 'towing' : 'towable',
      role: registrationData.vehicle.role, // Add the role property
      axleType: registrationData.vehicle.axleType,
      connectionStatus: 'connected',
      imageUrl: 'map.png',
      tireCount: 4, // Default for main vehicle
      synced: registrationData.syncStatus.allSynced,
      tireData: generateTireDataForAxle(registrationData.vehicle.axleType),
      thresholds: {
        pressureLow: 28,
        pressureWarning: 32,
        temperatureHigh: 160,
      }
    });

    // Add towables
    if (registrationData.towables && registrationData.towables.length > 0) {
      registrationData.towables.forEach((towable: any) => {
        vehicles.push({
          id: towable.id,
          name: towable.name,
          towingType: 'towable',
          role: 'towable', // Add the role property for towables
          axleType: towable.axle,
          connectionStatus: 'connected',
          imageUrl: 'map.png',
          tireCount: towable.tireCount,
          synced: registrationData.syncedVehicles[towable.id] || false,
          tireData: generateTireDataForAxle(towable.axle),
          thresholds: {
            pressureLow: 28,
            pressureWarning: 32,
            temperatureHigh: 160,
          }
        });
      });
    }
    
    setVehiclesData(vehicles);
    console.log('✅ Registration data saved to store');

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
          syncedVehicles={syncedVehicles}
          onSyncedVehiclesUpdate={setSyncedVehicles}
          vehicleSensorIds={vehicleSensorIds}
          onVehicleSensorIdsUpdate={setVehicleSensorIds}
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
