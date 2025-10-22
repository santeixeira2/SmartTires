import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Header from '../../components/Common/Header';
import TireCard, { TireData } from '../../components/Vehicle/TireCard';
import VehicleCard, { VehicleData } from '../../components/Vehicle/VehicleCard';
import { useAppStore, useAppActions } from '../../store/AppStore';
import styles from './styles';

interface DetailedStatusScreenProps {
  focusedTire?: string;
  vehicleName?: string;
  vehiclesData?: VehicleData[];
}

const DetailedStatusScreen: React.FC<DetailedStatusScreenProps> = ({ focusedTire, vehicleName, vehiclesData: propVehiclesData }) => {
  const { state } = useAppStore();
  const { setSelectedVehicle } = useAppActions();
  // Calculate tire count based on axle type
  const getTireCountFromAxle = (axleType: string): number => {
    const axleMap: {[key: string]: number} = {
      '1 Axle': 2,
      '2 Axles': 4,
      '3 Axles': 6,
      '4 Axles': 8,
      '5 Axles': 10,
      '6 Axles': 12,
    };
    return axleMap[axleType] || 4; // Default to 4 if not found
  };

  // Generate tires based on selected vehicle's axle type
  const generateTiresForVehicle = (vehicle: VehicleData): TireData[] => {
    const tireCount = getTireCountFromAxle(vehicle.axleType);
    const tires: TireData[] = [];
    
    for (let i = 0; i < tireCount; i++) {
      tires.push({
        id: i + 1,
        pressure: 30 + Math.random() * 5, // Random pressure between 30-35
        temperature: 20 + Math.random() * 10, // Random temperature between 20-30
        connected: true,
        deviceId: `device_${i + 1}`,
        position: `tire_${i + 1}`,
      });
    }
    
    return tires;
  };

  const [tires, setTires] = useState<TireData[]>([
    { id: 1, pressure: 32, temperature: 25, connected: true, deviceId: '1234567890', position: 'front-left' },
    { id: 2, pressure: 31, temperature: 26, connected: true, deviceId: '1234567890', position: 'front-right' },
    { id: 3, pressure: 28, temperature: 30, connected: true, deviceId: '1234567890', position: 'rear-left' },
    { id: 4, pressure: 29, temperature: 28, connected: true, deviceId: '1234567890', position: 'rear-right' },
  ]);
  // Use vehicles from store if available, otherwise fallback to prop or preset data
  const vehicles = state.vehiclesData.length > 0 ? state.vehiclesData : (propVehiclesData || []);
  const [selectedTire, setSelectedTire] = useState<string | null>(focusedTire || null);
  const [selectedVehicle, setSelectedVehicleLocal] = useState<string | null>(null);

  // Set first vehicle (Power Unit) as selected by default
  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicle) {
      const firstVehicle = vehicles[0];
      setSelectedVehicleLocal(firstVehicle.id);
      setSelectedVehicle(firstVehicle.id);
      
      // Generate tires for the first vehicle
      const newTires = generateTiresForVehicle(firstVehicle);
      setTires(newTires);
      console.log(`✅ Auto-selected first vehicle: ${firstVehicle.name} with ${newTires.length} tires`);
    }
  }, [vehicles]);

  useEffect(() => {
    // Set the selected tire when component mounts or focusedTire changes
    if (focusedTire) {
      setSelectedTire(focusedTire);
    }
  }, [focusedTire]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTires((prev) => {
        return prev.map((tire) => {
          if (!tire.connected) {
            const updatedTirePressure = Math.random() * (40 - 25) + 25;
            const updatedTireTemperature = Math.random() * (100 - 90) + 90;
            return {
              ...tire,
              pressure: parseFloat((tire.pressure + updatedTirePressure).toFixed(1)),
              temperature: parseFloat((tire.temperature + updatedTireTemperature).toFixed(1)),
              connected: true,
            }
          }
          return tire;
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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
    console.log('🔥 DetailedStatusScreen - Vehicle selected:', vehicleId);
    setSelectedVehicleLocal(vehicleId);
    
    // Save selected vehicle to global store
    setSelectedVehicle(vehicleId);
    
    // Find the selected vehicle and generate tires based on its axle type
    const selectedVehicleData = vehicles.find(v => v.id === vehicleId);
    if (selectedVehicleData) {
      const newTires = generateTiresForVehicle(selectedVehicleData);
      setTires(newTires);
      console.log(`✅ Generated ${newTires.length} tires for ${selectedVehicleData.axleType} vehicle`);
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
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default DetailedStatusScreen;