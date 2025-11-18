import React, { useState, useEffect } from 'react';
import { celsiusToFahrenheit } from '../../utils/tireData';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../../components/Common/Header';
import TireCard, { TireData } from '../../components/Vehicle/TireCard';
import VehicleCard, { VehicleData } from '../../components/Vehicle/VehicleCard';
import { useAppStore, useAppActions } from '../../store/AppStore';
import styles from './styles';

interface DetailedStatusScreenProps {
  focusedTire?: string;
  vehicleName?: string;
  vehiclesData?: VehicleData[];
  onNavigateToTireDetail?: (tireId: string, vehicleName: string) => void;
}

const DetailedStatusScreen: React.FC<DetailedStatusScreenProps> = ({ focusedTire, vehicleName, vehiclesData: propVehiclesData, onNavigateToTireDetail }) => {
  const { state } = useAppStore();
  const { setSelectedVehicle } = useAppActions();

  const getTireCountFromAxle = (axleType: string): number => {
    const axleMap: {[key: string]: number} = {
      '1 Axle': 2,
      '2 Axles': 4,
      '2 Axles w/Dually': 6,
      '2 Axles w/Dually Tires': 6,
      '3 Axles': 6,
      '4 Axles': 8,
      '5 Axles': 10,
      '6 Axles': 12,
    };
    return axleMap[axleType] || 4; // Default to 4 if not found
  };


  // Generate tires based on selected vehicle's axle type - READ FROM STORE
  const generateTiresForVehicle = (vehicle: VehicleData | any): TireData[] => {
    const tireCount = getTireCountFromAxle(vehicle.axleType);
    const tires: TireData[] = [];
    
    // Get tire data from store (vehicle may have tireData from store)
    const storeTireData = (vehicle as any).tireData || {};
    
    // Map tire positions based on axle type
    const tirePositions: string[] = [];
    if (tireCount === 2) {
      tirePositions.push('left', 'right');
    } else if (tireCount === 4) {
      tirePositions.push('front-left', 'front-right', 'rear-left', 'rear-right');
    } else if (tireCount === 6 && vehicle.axleType === '2 Axles w/Dually') {
      tirePositions.push('front-left', 'front-right', 'rear-left-inner', 'rear-left-outer', 'rear-right-inner', 'rear-right-outer');
    } else if (tireCount === 6) {
      tirePositions.push('front-left', 'front-right', 'middle-left', 'middle-right', 'rear-left', 'rear-right');
    }
    
    for (let i = 0; i < tireCount; i++) {
      const tirePosition = tirePositions[i] || `tire-${i + 1}`;
      const tireDataFromStore = storeTireData[tirePosition];
      
      // READ FROM STORE - if no data, show as disconnected
      tires.push({
        id: i + 1,
        pressure: tireDataFromStore?.psi ?? 0, // 0 means no data
        temperature: tireDataFromStore ? celsiusToFahrenheit(tireDataFromStore.temp) : 0, // Convert C to F
        connected: !!tireDataFromStore,
        deviceId: `device_${i + 1}`,
        position: tirePosition,
      });
    }
    
    return tires;
  };

  const [tires, setTires] = useState<TireData[]>([
    { id: 1, pressure: 42, temperature: 74, connected: true, deviceId: '1234567890', position: 'front-left' },
    { id: 2, pressure: 30, temperature: 75, connected: true, deviceId: '1234567890', position: 'front-right' },
    { id: 3, pressure: 48, temperature: 76, connected: true, deviceId: '1234567890', position: 'rear-left' },
    { id: 4, pressure: 30, temperature: 77, connected: true, deviceId: '1234567890', position: 'rear-right' },
  ]);
  const vehicles = state.vehiclesData.length > 0 ? state.vehiclesData : (propVehiclesData || []);
  const [selectedTire, setSelectedTire] = useState<string | null>(focusedTire || null);
  const [selectedVehicle, setSelectedVehicleLocal] = useState<string | null>(null);

  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicle) {
      const firstVehicle = vehicles[0];
      setSelectedVehicleLocal(firstVehicle.id);
      setSelectedVehicle(firstVehicle.id);
    
      const newTires = generateTiresForVehicle(firstVehicle);
      setTires(newTires);
      console.log(`Auto-selected first vehicle: ${firstVehicle.name} with ${newTires.length} tires`);
    }
  }, [vehicles]);

  useEffect(() => {
    if (focusedTire) {
      setSelectedTire(focusedTire);
    }
  }, [focusedTire]);

  // Update tires from store when tireData changes
  useEffect(() => {
    if (selectedVehicle) {
      const vehicle = vehicles.find(v => v.id === selectedVehicle);
      if (vehicle) {
        const updatedTires = generateTiresForVehicle(vehicle);
        setTires(updatedTires);
      }
    }
  }, [selectedVehicle, state.vehiclesData]);

  const getTireDisplayName = (tireId: string) => {
    const tireNames: { [key: string]: string } = {
      'front-left': 'Front Left',
      'front-right': 'Front Right', 
      'rear-left': 'Rear Left',
      'rear-right': 'Rear Right'
    };
    return tireNames[tireId] || tireId;
  };

  const handleVehicleSelect = (vehicleId: string) => {
    console.log('DetailedStatusScreen - Vehicle selected:', vehicleId);
    setSelectedVehicleLocal(vehicleId);
    
    setSelectedVehicle(vehicleId);
    
    const selectedVehicleData = vehicles.find(v => v.id === vehicleId);
    if (selectedVehicleData) {
      const newTires = generateTiresForVehicle(selectedVehicleData);
      setTires(newTires);
      console.log(`Generated ${newTires.length} tires for ${selectedVehicleData.axleType} vehicle`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Detailed Status" subtitle="Comprehensive tire monitoring" />
      
      {/* Vehicles Section */}
      <View style={styles.vehiclesSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vehiclesContainer}
        >
          {vehicles.map((vehicle) => {
            const isSelected = state.selectedVehicleId === vehicle.id;
            return (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle}
                onPress={() => handleVehicleSelect(vehicle.id)}
                style={isSelected ? {
                  borderWidth: 3,
                  borderColor: '#007AFF',
                  shadowColor: '#007AFF',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 8,
                } : undefined}
              />
            );
          })}
          
        </ScrollView>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          {selectedTire ? `Tire Details - Focused on ${getTireDisplayName(selectedTire)}` : 'Tire Details'}
        </Text>
        {tires.map((tire) => {
          const isSelected = selectedTire === tire.position;
          return (
            <TireCard 
              key={tire.id} 
              tire={tire} 
              style={isSelected ? { 
                borderWidth: 3, 
                borderColor: '#007bff',
                backgroundColor: '#f8f9ff'
              } : undefined}
              onPress={() => {
                const currentVehicle = vehicles.find(v => v.id === state.selectedVehicleId);
                const actualVehicleName = currentVehicle?.name || vehicleName || 'Unknown Vehicle';
                onNavigateToTireDetail?.(tire.id.toString(), actualVehicleName);
              }}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default DetailedStatusScreen;