import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Common/Header';
import TireCard, { TireData } from '../../components/Vehicle/TireCard';
import VehicleCard, { VehicleData } from '../../components/Vehicle/VehicleCard';
import { useAppStore, useAppActions } from '../../store/AppStore';
import TextBox from '../../components/Common/TextBox';
import Dropdown from '../../components/Common/Dropdown';
import { DropdownOption } from '../../components/Common/Dropdown/types';
import styles from './styles';

interface DetailedStatusScreenProps {
  focusedTire?: string;
  vehicleName?: string;
  vehiclesData?: VehicleData[];
  onNavigateToTireDetail?: (tireId: string, vehicleName: string) => void;
}

const DetailedStatusScreen: React.FC<DetailedStatusScreenProps> = ({ focusedTire, vehicleName, vehiclesData: propVehiclesData, onNavigateToTireDetail }) => {
  const { state } = useAppStore();
  const { setSelectedVehicle, setVehiclesData } = useAppActions();
  const [showAddTowableModal, setShowAddTowableModal] = useState(false);
  const [newTowable, setNewTowable] = useState({
    name: "",
    type: "",
    axle: "",
    tireCount: 4,
  });

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

  // Towables type options (same as RegisterSetup)
  const towablesTypeOptions: DropdownOption[] = [
    { label: "Travel Trailers", value: "Travel Trailers" },
    { label: "Fifth Wheels", value: "Fifth Wheels" },
    { label: "Vehicle", value: "Vehicle" },
  ];

  // Dynamic axle options based on towable type (same as RegisterSetup)
  const getAxleOptions = (towablesType?: string): DropdownOption[] => {
    if (towablesType === "Travel Trailers") {
      return [
        { label: "1 Axle", value: "1 Axle" },
        { label: "2 Axles", value: "2 Axles" },
      ];
    } else if (towablesType === "Fifth Wheels") {
      return [
        { label: "2 Axles", value: "2 Axles" },
        { label: "3 Axles", value: "3 Axles" },
      ];
    } else if (towablesType === "Vehicle") {
      return [
        { label: "2 Axles", value: "2 Axles" },
        { label: "2 Axles w/Dually Tires", value: "2 Axles w/Dually Tires" },
      ];
    }
    return [];
  };

  const handleAddTowable = () => {
    if (!newTowable.name || !newTowable.type || !newTowable.axle) {
      Alert.alert("Error", "Please fill in all towable fields");
      return;
    }

    const tireCount = getTireCountFromAxle(newTowable.axle);
    const towableVehicle: any = {
      id: `towable-${Date.now()}`,
      name: newTowable.name,
      towingType: 'towable' as const,
      axleType: newTowable.axle,
      connectionStatus: 'connected' as const,
      imageUrl: require('../../assets/images/trailer-side.png'),
      role: 'towable',
      tireCount: tireCount,
      synced: false,
    };

    // Add to vehiclesData
    const updatedVehicles = [...vehicles, towableVehicle];
    setVehiclesData(updatedVehicles);

    // Reset form and close modal
    setNewTowable({
      name: "",
      type: "",
      axle: "",
      tireCount: 4,
    });
    setShowAddTowableModal(false);
    Alert.alert("Success", "Towable added successfully!");
  };

  // Generate tires based on selected vehicle's axle type
  const generateTiresForVehicle = (vehicle: VehicleData): TireData[] => {
    const tireCount = getTireCountFromAxle(vehicle.axleType);
    const tires: TireData[] = [];
    
    for (let i = 0; i < tireCount; i++) {
      tires.push({
        id: i + 1,
        pressure: 30 + Math.random() * 5, // Random pressure between 74-79
        temperature: 68 + Math.random() * 10, // Random temperature between 68-78
        connected: true,
        deviceId: `device_${i + 1}`,
        position: `tire_${i + 1}`,
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
    console.log('DetailedStatusScreen - Vehicle selected:', vehicleId);
    setSelectedVehicleLocal(vehicleId);
    
    // Save selected vehicle to global store
    setSelectedVehicle(vehicleId);
    
    // Find the selected vehicle and generate tires based on its axle type
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
          
          {/* Add Towable Button */}
          <TouchableOpacity
            style={styles.addTowableButton}
            onPress={() => setShowAddTowableModal(true)}
            activeOpacity={0.7}
          >
            <Icon name="add" size={32} color="#007AFF" />
            <Text style={styles.addTowableButtonText}>Add Towable</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Add Towable Modal */}
      <Modal
        visible={showAddTowableModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddTowableModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Towable</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddTowableModal(false)}
              >
                <Icon name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextBox
                placeholder="Towable Name"
                value={newTowable.name}
                onChangeText={(value: string) =>
                  setNewTowable((prev) => ({ ...prev, name: value }))
                }
                icon="car-outline"
              />

              <Dropdown
                options={towablesTypeOptions}
                selectedValue={newTowable.type}
                onSelect={(value: string) =>
                  setNewTowable((prev) => ({ ...prev, type: value, axle: "" }))
                }
                placeholder="Select Towable Type *"
                icon="car-outline"
              />

              <Dropdown
                options={getAxleOptions(newTowable.type)}
                selectedValue={newTowable.axle}
                onSelect={(value: string) =>
                  setNewTowable((prev) => ({ ...prev, axle: value }))
                }
                placeholder="Select Axle Type *"
                disabled={!newTowable.type}
                icon="time-outline"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddTowableModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTowable}
              >
                <Text style={styles.addButtonText}>Add Towable</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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