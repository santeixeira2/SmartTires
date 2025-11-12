import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Common/Header';
import VehicleList from '../../components/Vehicle/VehicleList';
import Dropdown from '../../components/Common/Dropdown';
import TextBox from '../../components/Common/TextBox';
import TireSyncModal from '../../components/Common/TireSyncModal';
import { useAppStore, useAppActions, VehicleThresholds } from '../../store/AppStore';

interface DropdownOption {
  label: string;
  value: string;
}

const VehiclesScreen: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const { setVehiclesData, setRegistrationData, updateVehicleThresholds } = useAppActions();
  const [showAddTowableModal, setShowAddTowableModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [selectedVehicleForSync, setSelectedVehicleForSync] = useState<string | null>(null);
  const [newTowable, setNewTowable] = useState({
    name: "",
    type: "",
    axle: "",
    tireCount: 4,
  });

  const vehicles = state.vehiclesData || [];

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
    return axleMap[axleType] || 4;
  };

  // Get synced vehicles from registration data
  const syncedVehicles = state.registrationData?.syncedVehicles || {};

  // Convert vehicles to VehicleList format
  const vehicleListData = vehicles.map(v => {
    // Calculate tire count from axle type if not already set
    const tireCount = v.tireCount || getTireCountFromAxle(v.axleType || '2 Axles');
    return {
      id: v.id,
      name: v.name,
      type: v.towingType || '',
      towingType: v.towingType || '',
      axleType: v.axleType || '',
      tireCount: tireCount,
      isMain: v.id === 'main-vehicle' || v.towingType === 'towing',
    };
  });

  const towablesTypeOptions: DropdownOption[] = [
    { label: "Travel Trailers", value: "Travel Trailers" },
    { label: "Fifth Wheels", value: "Fifth Wheels" },
    { label: "Vehicle", value: "Vehicle" },
  ];

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
    const newVehicleData: any = {
      id: `towable-${Date.now()}`,
      name: newTowable.name,
      towingType: 'towable' as const,
      axleType: newTowable.axle,
      connectionStatus: 'connected' as const,
      imageUrl: require('../../assets/images/trailer-side.png'),
      role: 'towable',
      tireCount: tireCount,
      synced: false,
      thresholds: {
        pressureLow: 28,
        pressureWarning: 32,
        temperatureHigh: 160,
      }
    };

    const updatedVehicles = [...vehicles, newVehicleData];
    setVehiclesData(updatedVehicles);

    setNewTowable({
      name: "",
      type: "",
      axle: "",
      tireCount: 4,
    });
    setShowAddTowableModal(false);
    Alert.alert("Success", "Towable added successfully!");
  };

  const handleVehicleSelect = (vehicleId: string) => {
    // Check if vehicle is already synced
    if (syncedVehicles[vehicleId]) {
      Alert.alert(
        "Already Synced",
        "This vehicle is already synced. You can sync it again if needed.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sync Again",
            onPress: () => {
              setSelectedVehicleForSync(vehicleId);
              setShowSyncModal(true);
            },
          },
        ]
      );
      return;
    }
    
    setSelectedVehicleForSync(vehicleId);
    setShowSyncModal(true);
  };

  const handleTireSync = (tireId: string, sensorId: string) => {
    console.log(`🔥 VehiclesScreen - Tire sync: ${tireId} with sensor: ${sensorId}`);
    console.log(`✅ Sensor ${sensorId} synced to ${tireId.replace('-', ' ')} tire on ${selectedVehicleForSync}`);
  };

  const handleVehicleSyncComplete = (vehicleId: string, sensorIds: {[key: string]: string}, thresholds?: VehicleThresholds) => {
    console.log(`✅ Vehicle ${vehicleId} sync complete!`);
    console.log(`📊 Sensor IDs for ${vehicleId}:`, sensorIds);
    console.log(`📊 Thresholds for ${vehicleId}:`, thresholds);
    
    // Find the vehicle to get its axle type
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
      console.error('Vehicle not found:', vehicleId);
      return;
    }
    
    // Create initial tire data based on sensor IDs and tire positions
    const tireData: {[key: string]: {psi: number, temp: number}} = {};
    
    // Map tire positions based on axle type
    const tirePositions = Object.keys(sensorIds);
    tirePositions.forEach(tireId => {
      // Create initial tire data entry with placeholder values
      // These will be updated when BLE data comes in
      tireData[tireId] = {
        psi: 30, // Default pressure
        temp: 20  // Default temperature in Celsius
      };
    });
    
    // Update registration data with sensor IDs
    if (state.registrationData) {
      const updatedRegistrationData = {
        ...state.registrationData,
        vehicleSensorIds: {
          ...(state.registrationData.vehicleSensorIds || {}),
          [vehicleId]: sensorIds
        },
        syncedVehicles: {
          ...(state.registrationData.syncedVehicles || {}),
          [vehicleId]: true
        }
      };
      setRegistrationData(updatedRegistrationData);
      console.log('Updated registration data with sensor IDs');
    }
    
    // Update vehicle with synced status, initial tire data, and thresholds
    const updatedVehicles = vehicles.map(v => {
      if (v.id === vehicleId) {
        return { 
          ...v, 
          synced: true,
          tireData: tireData, // Add initial tire data so tires show as connected
          thresholds: thresholds || {
            pressureLow: 28,
            pressureWarning: 32,
            temperatureHigh: 160,
          }
        };
      }
      return v;
    });
    setVehiclesData(updatedVehicles);
    
    // Store thresholds separately using the action
    if (thresholds) {
      updateVehicleThresholds(vehicleId, thresholds);
    }
    
    // Also dispatch tire data update to ensure it's properly stored
    dispatch({
      type: 'UPDATE_VEHICLE_TIRE_DATA',
      payload: {
        vehicleId: vehicleId,
        tireData: tireData
      }
    });
    
    setShowSyncModal(false);
    setSelectedVehicleForSync(null);
    Alert.alert("Success", "Vehicle sensors synced successfully!");
  };

  const selectedVehicle = selectedVehicleForSync ? vehicles.find(v => v.id === selectedVehicleForSync) : null;

  return (
    <View style={styles.container}>
      <Header title="Vehicles" />
      <ScrollView style={styles.content}>
        {vehicles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🚗</Text>
            <Text style={styles.emptyTitle}>No Vehicles</Text>
            <Text style={styles.emptySubtitle}>Add a towable to get started</Text>
          </View>
        ) : (
          <VehicleList
            vehicles={vehicleListData}
            onVehicleSelect={handleVehicleSelect}
            title="My Vehicles"
            subtitle="Tap on a vehicle to sync its tire pressure sensors"
            syncedVehicles={syncedVehicles}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddTowableModal(true)}
        >
          <Icon name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Towable</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Towable Modal - Same style as RegisterSetup */}
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
                onSelect={(value: string) => {
                  const tireCount = getTireCountFromAxle(value);
                  setNewTowable((prev) => ({ ...prev, axle: value, tireCount }));
                }}
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
                style={styles.addButtonModal}
                onPress={handleAddTowable}
              >
                <Text style={styles.addButtonTextModal}>Add Towable</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sync Sensors Modal */}
      {selectedVehicle && (
        <TireSyncModal
          visible={showSyncModal}
          onClose={() => {
            setShowSyncModal(false);
            setSelectedVehicleForSync(null);
          }}
          onTireSync={handleTireSync}
          onVehicleSyncComplete={(sensorIds, thresholds) => handleVehicleSyncComplete(selectedVehicle.id, sensorIds, thresholds)}
          vehicleName={selectedVehicle.name}
          vehicleType={selectedVehicle.towingType === 'towing' ? 'power_unit' : 'towable'}
          axleType={selectedVehicle.axleType}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#34A853',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 300,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonModal: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonTextModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VehiclesScreen;
