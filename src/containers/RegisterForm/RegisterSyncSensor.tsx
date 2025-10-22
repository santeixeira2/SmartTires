import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RegisterLayout from './RegisterLayout';
import VehicleList, { Vehicle } from '../../components/Vehicle/VehicleList';
import TextBox from '../../components/Common/TextBox';
import CustomModal from '../../components/Common/Modal';
import { CameraScanner } from '../../components/Common/QrCodeScanner';
import TireSyncModal from '../../components/Common/TireSyncModal';

interface RegisterSyncSensorProps {
  onComplete: () => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
  setupData: {
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
  };
  syncedVehicles?: {[key: string]: boolean};
  onSyncedVehiclesUpdate?: (syncedVehicles: {[key: string]: boolean}) => void;
  vehicleSensorIds?: {[key: string]: {[key: string]: string}};
  onVehicleSensorIdsUpdate?: (vehicleSensorIds: {[key: string]: {[key: string]: string}}) => void;
}

const RegisterSyncSensor: React.FC<RegisterSyncSensorProps> = ({
  onComplete,
  onBack,
  isLoading,
  error,
  setupData,
  syncedVehicles: propSyncedVehicles,
  onSyncedVehiclesUpdate,
  vehicleSensorIds: propVehicleSensorIds,
  onVehicleSensorIdsUpdate,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showManualSyncModal, setShowManualSyncModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [sensorId, setSensorId] = useState("");
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showTireSyncModal, setShowTireSyncModal] = useState(false);
  const [syncedVehicles, setSyncedVehicles] = useState<{[key: string]: boolean}>(propSyncedVehicles || {});
  const [vehicleSensorIds, setVehicleSensorIds] = useState<{[key: string]: {[key: string]: string}}>(propVehicleSensorIds || {});
//   const [permission, requestPermission] = useCameraPermissions();

  const totalTires = (setupData.towables?.reduce((sum, towable) => sum + towable.tireCount, 0) || 0) + 4;

  const vehicles: Vehicle[] = [
    {
      id: "main-vehicle",
      name: setupData.vehicleName || "Main Vehicle",
      type: setupData.towingType || "Power Unit",
      towingType: setupData.towingType || "",
      axleType: setupData.axleTowingType || "",
      tireCount: 4,
      isMain: true,
    },
    ...(setupData.towables?.map((towable, index) => ({
      id: `towable-${index}`,
      name: towable.name,
      type: towable.type,
      towingType: towable.type,
      axleType: towable.axle,
      tireCount: towable.tireCount,
      isMain: false,
    })) || []),
  ];

  const handleVehicleSelect = (vehicleId: string) => {
    // Check if vehicle is already synced
    if (syncedVehicles[vehicleId]) {
      console.log(`⚠️ Vehicle ${vehicleId} is already synced. Cannot sync again.`);
      return;
    }
    
    setSelectedVehicle(vehicleId);
    // Open tire sync modal to select which tire to sync
    setShowTireSyncModal(true);
  };

  const handleSyncComplete = () => {
    setShowSyncModal(false);
    setSelectedVehicle(null);
    onComplete();
  };

  const handleTireSync = (tireId: string, sensorId: string) => {
    console.log(`🔥 RegisterSyncSensor - Tire sync: ${tireId} with sensor: ${sensorId}`);
    
    // Just log success - no complex operations
    console.log(`✅ Sensor ${sensorId} synced to ${tireId.replace('-', ' ')} tire on ${selectedVehicle}`);
  };

  const handleVehicleSyncComplete = (vehicleId: string, sensorIds: {[key: string]: string}) => {
    console.log(`✅ Vehicle ${vehicleId} sync complete!`);
    console.log(`📊 Sensor IDs for ${vehicleId}:`, sensorIds);
    
    const updatedSyncedVehicles = {
      ...syncedVehicles,
      [vehicleId]: true
    };
    setSyncedVehicles(updatedSyncedVehicles);
    
    // Save sensor IDs for this vehicle
    setVehicleSensorIds(prev => ({
      ...prev,
      [vehicleId]: sensorIds
    }));
    
    // Update parent component
    if (onSyncedVehiclesUpdate) {
      onSyncedVehiclesUpdate(updatedSyncedVehicles);
    }
    
    // Update parent with sensor IDs
    if (onVehicleSensorIdsUpdate) {
      onVehicleSensorIdsUpdate(vehicleSensorIds);
    }
    
    setShowTireSyncModal(false);
  };

  const handleQRCodeScanned = (data: string) => {
    console.log("QR Code scanned:", data);
    setSensorId(data);
    setShowQRScanner(false);
    setShowManualSyncModal(true);
    Alert.alert("QR Code Scanned", `Sensor ID: ${data}`, [
      {
        text: "Continue",
        onPress: () => {
          // The manual sync modal will already be open
        }
      }
    ]);
  };


  const openQRScanner = async () => {
    console.log("Opening QR Scanner");
    setShowQRScanner(true);
  };

  const renderSyncContent = () => (
    <View>
      <TouchableOpacity
        style={styles.backToVehicleList}
        onPress={() => setSelectedVehicle(null)}
      >
        <Ionicons name="arrow-back" size={20} color="#007bff" />
        <Text style={styles.backToVehicleListText}>Back to Vehicle List</Text>
      </TouchableOpacity>
      
      <View style={styles.todoContainer}>
        <Ionicons name="qr-code-outline" size={48} color="#6c757d" />
        <Text style={styles.todoTitle}>Sync Vehicle Sensors</Text>
        <Text style={styles.todoDescription}>
          Sync tire pressure sensors for: {vehicles.find(v => v.id === selectedVehicle)?.name}
        </Text>
        
        <View style={styles.syncOptions}>
          <TouchableOpacity style={[styles.syncOptionButton, { backgroundColor: 'orange' }]} onPress={openQRScanner}>
            <Ionicons name="qr-code-outline" size={24} color="#007bff" />
            <Text style={[styles.syncOptionText, { color: 'white', fontWeight: 'bold' }]}>🔴 SCAN QR CODE 🔴</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.syncOptionButton} 
            onPress={() => {
              setShowSyncModal(false);
              setShowManualSyncModal(true);
            }}
          >
            <Ionicons name="keypad-outline" size={24} color="#007bff" />
            <Text style={styles.syncOptionText}>Enter Manually</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderManualSyncContent = () => (
    <View style={styles.manualSyncContainer}>
      <Ionicons name="keypad-outline" size={48} color="#007bff" />
      <Text style={styles.manualSyncTitle}>Enter Sensor ID</Text>
      <Text style={styles.manualSyncDescription}>
        Enter the Sensor ID to manually sync with your vehicle
      </Text>
      
      <View style={styles.sensorIdContainer}>
        <TextInput
          style={styles.sensorIdInput}
          placeholder="Enter Sensor ID (e.g., SENSOR-ABC123)"
          value={sensorId}
          onChangeText={setSensorId}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholderTextColor="#6c757d"
        />
        <Ionicons name="bluetooth" size={20} color="#007bff" style={styles.sensorIdIcon} />
      </View>
      
      {sensorId && (
        <View style={styles.sensorIdPreview}>
          <Text style={styles.sensorIdPreviewLabel}>Sensor ID:</Text>
          <Text style={styles.sensorIdPreviewValue}>{sensorId}</Text>
        </View>
      )}
    </View>
  );

  const handleSensorSync = () => {
    if (sensorId.trim()) {
      console.log("Syncing sensor with ID:", sensorId);
      Alert.alert(
        "Sensor Synced",
        `Successfully synced sensor: ${sensorId}`,
        [
          {
            text: "OK",
            onPress: () => {
              setShowManualSyncModal(false);
              setSensorId("");
              setShowSyncModal(false);
              setSelectedVehicle(null);
              // You can add logic here to mark this vehicle as synced
            }
          }
        ]
      );
    } else {
      Alert.alert("Error", "Please enter a valid Sensor ID");
    }
  };

  const renderModalFooter = (isManualSync = false) => (
    <View style={styles.modalFooter}>
      <TouchableOpacity
        style={[
          styles.syncButton,
          isManualSync && !sensorId.trim() && styles.syncButtonDisabled
        ]}
        onPress={isManualSync ? handleSensorSync : handleSyncComplete}
        disabled={isManualSync && !sensorId.trim()}
      >
        <Text style={styles.syncButtonText}>
          {isManualSync ? "Sync Sensor" : "Complete Sync"}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.manualSyncLink}
        onPress={() => {
          if (isManualSync) {
            setShowManualSyncModal(false);
            setSensorId("");
          } else {
            setShowSyncModal(false);
            setShowManualSyncModal(true);
          }
        }}
      >
        <Text style={styles.manualSyncText}>
          {isManualSync ? "Cancel" : "Sync Manually"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <RegisterLayout
        onBack={onBack}
        title="Sync Sensors"
        subtitle="Connect and sync tire pressure sensors for all vehicles"
        progressPercentage={75}
        progressText="Sync Sensors"
        footerButton={{
          label: "Complete Registration",
          onPress: onComplete,
          disabled: isLoading,
        }}
        isLoading={isLoading}
      >
        

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Sync Instructions</Text>
          <Text style={styles.instructionsText}>
            1. Select each vehicle from the list below{"\n"}
            2. Follow the sync process for each vehicle{"\n"}
            3. Ensure all sensors are properly connected{"\n"}
            4. Complete sync for all vehicles
          </Text>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <Ionicons name="analytics-outline" size={20} color="#007bff" />
            <Text style={styles.summaryTitle}>Sensor Summary</Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalTires}</Text>
              <Text style={styles.summaryLabel}>Total Tires</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{setupData.towables?.length || 0}</Text>
              <Text style={styles.summaryLabel}>Towables</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>4</Text>
              <Text style={styles.summaryLabel}>Main Vehicle</Text>
            </View>
          </View>
        </View>

        <VehicleList
          vehicles={vehicles}
          onVehicleSelect={handleVehicleSelect}
          disabled={isLoading}
          title="Select Vehicle to Sync"
          subtitle="Tap on a vehicle to sync its tire pressure sensors"
        />

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={16} color="#dc3545" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </RegisterLayout>

      <CustomModal
        visible={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        title={selectedVehicle ? "Sync Vehicle" : "Select Vehicle"}
        footer={selectedVehicle ? renderModalFooter() : null}
      >
        {selectedVehicle ? renderSyncContent() : (
          <VehicleList
            vehicles={vehicles}
            onVehicleSelect={handleVehicleSelect}
            disabled={isLoading}
            title="Select Vehicle to Sync"
            subtitle="Tap on a vehicle to view or sync details"
            syncedVehicles={syncedVehicles}
          />
        )}
      </CustomModal>

      <CustomModal
        visible={showManualSyncModal}
        onClose={() => setShowManualSyncModal(false)}
        title="Manual Sensor Sync"
        footer={renderModalFooter(true)}
      >
        {renderManualSyncContent()}
      </CustomModal>

      {/* Real QR Scanner */}
      {showQRScanner && (
        <CameraScanner
          setIsCameraShown={setShowQRScanner}
          onReadCode={handleQRCodeScanned}
        />
      )}

      {/* Tire Sync Modal */}
      <TireSyncModal
        visible={showTireSyncModal}
        onClose={() => setShowTireSyncModal(false)}
        onTireSync={handleTireSync}
        onVehicleSyncComplete={(sensorIds) => handleVehicleSyncComplete(selectedVehicle || '', sensorIds)}
        vehicleName={selectedVehicle || 'Unknown Vehicle'}
      />

    </>
  );
};

const styles = StyleSheet.create({
  summarySection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginLeft: 8,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
  },

  instructionsContainer: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976d2",
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: "#1976d2",
    lineHeight: 18,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8d7da",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: "#721c24",
    marginLeft: 8,
    flex: 1,
  },

  modalFooter: {
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    gap: 12,
  },
  syncButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
  },
  syncButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  manualSyncLink: {
    alignItems: "center",
    paddingVertical: 8,
  },
  manualSyncText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
  },

  todoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  todoTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6c757d",
    marginTop: 16,
    marginBottom: 8,
  },
  todoDescription: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 20,
  },

  manualSyncContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  manualSyncTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#212529",
    marginTop: 16,
    marginBottom: 8,
  },
  manualSyncDescription: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },

  backToVehicleList: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  backToVehicleListText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  syncOptions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  syncOptionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  syncOptionText: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },

  qrScannerContainer: {
    flex: 1,
    position: "relative",
    minHeight: 400,
    width: "100%",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: 400,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  qrScannerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginTop: 16,
    marginBottom: 8,
  },
  qrScannerDescription: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  qrOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  qrFrame: {
    width: 200,
    height: 200,
    position: "relative",
    marginBottom: 16,
  },
  qrCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#007bff",
    borderWidth: 3,
  },
  qrCornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  qrCornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  qrCornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  qrCornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  qrInstructionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  sensorIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    paddingHorizontal: 12,
    marginBottom: 16,
    width: "100%",
  },
  sensorIdInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#212529",
  },
  sensorIdIcon: {
    marginLeft: 8,
  },
  sensorIdPreview: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
  },
  sensorIdPreviewLabel: {
    fontSize: 12,
    color: "#1976d2",
    fontWeight: "600",
    marginBottom: 4,
  },
  sensorIdPreviewValue: {
    fontSize: 16,
    color: "#1976d2",
    fontWeight: "700",
  },
  syncButtonDisabled: {
    backgroundColor: "#6c757d",
    opacity: 0.6,
  },
});


export default RegisterSyncSensor;