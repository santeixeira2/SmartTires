import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TruckTopDownView from '../../Vehicle/TruckTopDownView';
import { CameraScanner } from '../QrCodeScanner';
import { VehicleThresholds } from '../../../store/AppStore';

interface TireSyncModalProps {
  visible: boolean;
  onClose: () => void;
  onTireSync: (tireId: string, sensorId: string) => void;
  onVehicleSyncComplete: (sensorIds: {[key: string]: string}, thresholds?: VehicleThresholds) => void;
  vehicleName: string;
  vehicleType?: 'power_unit' | 'towable';
  axleType?: string;
}

const TireSyncModal: React.FC<TireSyncModalProps> = ({
  visible,
  onClose,
  onTireSync,
  onVehicleSyncComplete,
  vehicleName,
  vehicleType = 'power_unit',
  axleType = '2 Axles',
}) => {
  const [selectedTire, setSelectedTire] = useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualSensorId, setManualSensorId] = useState('');
  const [syncedTires, setSyncedTires] = useState<{[key: string]: string}>({});
  const [showThresholdInput, setShowThresholdInput] = useState(false);
  const [thresholds, setThresholds] = useState<VehicleThresholds>({
    pressureLow: 28,      // Default: 28 PSI
    pressureWarning: 32, // Default: 32 PSI
    temperatureHigh: 160, // Default: 160°F
  });
  
  // Get expected tire count based on axle type
  const getExpectedTireCount = () => {
    switch (axleType) {
      case '1 Axle':
        return 2; // 1 axle = 2 tires
      case '2 Axles':
        return 4; // 2 axles = 4 tires
      case '2 Axles w/Dually':
        return 6; // 2 axles w/dually = 6 tires
      case '3 Axles':
        return 6; // 3 axles = 6 tires
      case '4 Axles':
        return 8; // 4 axles = 8 tires
      case '5 Axles':
        return 10; // 5 axles = 10 tires
      case '6 Axles':
        return 12; // 6 axles = 12 tires
      default:
        return 4; // Default to 4 tires
    }
  };

  const expectedTireCount = getExpectedTireCount();
  
  // Reset synced tires and thresholds when modal opens
  React.useEffect(() => {
    if (visible) {
      console.log('🔥 TireSyncModal - Modal opened, resetting syncedTires');
      setSyncedTires({});
      setShowThresholdInput(false);
      setThresholds({
        pressureLow: 28,
        pressureWarning: 32,
        temperatureHigh: 160,
      });
    }
  }, [visible]);

  // Debug syncedTires changes
  React.useEffect(() => {
    console.log('🔥 TireSyncModal - syncedTires updated:', syncedTires);
  }, [syncedTires]);

  // Use useCallback to prevent unnecessary re-renders
  const handleTirePress = useCallback((tireId: string) => {
    console.log(`🔥 TireSyncModal - Tire selected: ${tireId}`);
    setSelectedTire(tireId);
    setShowQRScanner(false);
    setShowManualInput(false);
  }, []);

  const handleQRScan = useCallback((sensorId: string) => {
    if (selectedTire) {
      const tireId = selectedTire; // Capture before reset
      console.log(`🔥 TireSyncModal - QR scanned: ${sensorId} for tire: ${tireId}`);
      
      // Add to synced tires
      setSyncedTires(prev => {
        const newSyncedTires = {
          ...prev,
          [tireId]: sensorId
        };
        console.log('🔥 TireSyncModal - Adding tire to synced:', tireId, sensorId, newSyncedTires);
        return newSyncedTires;
      });
      
      // Close scanner and reset selection
      setShowQRScanner(false);
      setSelectedTire(null);
      
      // Call parent to notify sync
      onTireSync(tireId, sensorId);
    }
  }, [selectedTire, onTireSync]);

  const handleManualInput = useCallback((sensorId: string) => {
    if (selectedTire) {
      const tireId = selectedTire; // Capture before reset
      console.log(`🔥 TireSyncModal - Manual input: ${sensorId} for tire: ${tireId}`);
      
      // Add to synced tires
      setSyncedTires(prev => {
        const newSyncedTires = {
          ...prev,
          [tireId]: sensorId
        };
        console.log('🔥 TireSyncModal - Adding tire to synced (manual):', tireId, sensorId, newSyncedTires);
        return newSyncedTires;
      });
      
      // Close manual input and reset selection
      setShowManualInput(false);
      setManualSensorId('');
      setSelectedTire(null);
      
      // Call parent to notify sync
      onTireSync(tireId, sensorId);
    }
  }, [selectedTire, onTireSync]);

  const handleClose = useCallback(() => {
    // Reset all states
    setSelectedTire(null);
    setShowQRScanner(false);
    setShowManualInput(false);
    setManualSensorId('');
    onClose();
  }, [onClose]);

  const resetSelection = useCallback(() => {
    setSelectedTire(null);
    setShowQRScanner(false);
    setShowManualInput(false);
    setManualSensorId('');
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Sync Sensor to Tire</Text>
          <Text style={styles.subtitle}>{vehicleName}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {!selectedTire ? (
            <View style={styles.tireSelectionContainer}>
              <Text style={styles.instructionText}>
                Select a tire to sync with a sensor:
              </Text>
              
              <View style={styles.truckContainer}>
                <TruckTopDownView
                  frontLeft={{ psi: 32, temp: 25 }}
                  frontRight={{ psi: 31, temp: 26 }}
                  rearLeft={{ psi: 28, temp: 30 }}
                  rearRight={{ psi: 29, temp: 28 }}
                  onTirePress={handleTirePress}
                  // Pass synced state for visual indicators
                  syncedTires={syncedTires}
                  // Pass vehicle type and axle type for correct image and tire layout
                  vehicleType={vehicleType}
                  axleType={axleType as '1 Axle' | '2 Axles' | '2 Axles w/Dually' | '3 Axles' | '4 Axles' | '5 Axles' | '6 Axles'}
                />
              </View>
              
              {/* Synced Tires List */}
              {Object.keys(syncedTires).length > 0 && (
                <View style={styles.syncedTiresContainer}>
                  <Text style={styles.syncedTiresTitle}>Synced Tires:</Text>
                  {Object.entries(syncedTires).map(([tireId, sensorId]) => (
                    <View key={tireId} style={styles.syncedTireItem}>
                      <Icon name="checkmark-circle" size={20} color="#007AFF" />
                      <Text style={styles.syncedTireText}>
                        {tireId.replace('-', ' ').toUpperCase()}: {sensorId}
                      </Text>
                    </View>
                  ))}
                  
                  {/* Complete Sync Button */}
                  {Object.keys(syncedTires).length === expectedTireCount && !showThresholdInput && (
                    <TouchableOpacity
                      style={styles.completeSyncButton}
                      onPress={() => {
                        console.log(`✅ All ${expectedTireCount} tires synced! Showing threshold input.`);
                        setShowThresholdInput(true);
                      }}
                    >
                      <Icon name="checkmark-circle" size={24} color="#fff" />
                      <Text style={styles.completeSyncButtonText}>
                        Set Thresholds & Complete Sync ({Object.keys(syncedTires).length}/{expectedTireCount})
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.syncOptionsContainer}>
              <Text style={styles.selectedTireText}>
                Selected Tire: {selectedTire.replace('-', ' ').toUpperCase()}
              </Text>
              
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => setShowQRScanner(true)}
                >
                  <Icon name="qr-code-outline" size={24} color="#fff" />
                  <Text style={styles.optionButtonText}>Scan QR Code</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => setShowManualInput(true)}
                >
                  <Icon name="create-outline" size={24} color="#fff" />
                  <Text style={styles.optionButtonText}>Enter Manually</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={resetSelection}
                >
                  <Icon name="arrow-back-outline" size={20} color="#666" />
                  <Text style={styles.backButtonText}>Back to Tire Selection</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {showQRScanner && (
            <View style={styles.scannerContainer}>
              <View style={styles.scannerHeader}>
                <TouchableOpacity
                  style={styles.scannerCloseButton}
                  onPress={() => setShowQRScanner(false)}
                >
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.scannerTitle}>Scan QR Code</Text>
              </View>
              <CameraScanner
                setIsCameraShown={setShowQRScanner}
                onReadCode={handleQRScan}
              />
            </View>
          )}

          {showManualInput && (
            <View style={styles.manualInputContainer}>
              <View style={styles.manualInputHeader}>
                <TouchableOpacity
                  style={styles.manualInputCloseButton}
                  onPress={() => {
                    setShowManualInput(false);
                    setManualSensorId('');
                  }}
                >
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.manualInputTitle}>Enter Sensor ID</Text>
              </View>
              
              <View style={styles.inputSection}>
                <TextInput
                  style={styles.textInput}
                  value={manualSensorId}
                  onChangeText={setManualSensorId}
                  placeholder="Enter sensor ID..."
                  autoFocus={true}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (manualSensorId.trim()) {
                      handleManualInput(manualSensorId.trim());
                    }
                  }}
                />
                
                <TouchableOpacity
                  style={[styles.submitButton, !manualSensorId.trim() && styles.submitButtonDisabled]}
                  onPress={() => {
                    if (manualSensorId.trim()) {
                      handleManualInput(manualSensorId.trim());
                    }
                  }}
                  disabled={!manualSensorId.trim()}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {showThresholdInput && (
            <View style={styles.thresholdInputContainer}>
              <View style={styles.thresholdInputHeader}>
                <TouchableOpacity
                  style={styles.thresholdInputCloseButton}
                  onPress={() => {
                    setShowThresholdInput(false);
                  }}
                >
                  <Icon name="arrow-back-outline" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.thresholdInputTitle}>Set Tire Thresholds</Text>
                <View style={{ width: 24 }} />
              </View>
              
              <ScrollView style={styles.thresholdInputSection}>
                <Text style={styles.thresholdDescription}>
                  Configure pressure and temperature thresholds for {vehicleName}. These values will be used to determine tire status alerts.
                </Text>
                
                <View style={styles.thresholdInputGroup}>
                  <Text style={styles.thresholdLabel}>Low Pressure Warning (PSI)</Text>
                  <Text style={styles.thresholdHint}>Alert when pressure drops below this value</Text>
                  <TextInput
                    style={styles.thresholdTextInput}
                    value={thresholds.pressureLow.toString()}
                    onChangeText={(text: string) => {
                      const value = parseFloat(text) || 0;
                      setThresholds(prev => ({ ...prev, pressureLow: value }));
                    }}
                    placeholder="28"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.thresholdInputGroup}>
                  <Text style={styles.thresholdLabel}>Pressure Warning (PSI)</Text>
                  <Text style={styles.thresholdHint}>Warning when pressure is high than this value</Text>
                  <TextInput
                    style={styles.thresholdTextInput}
                    value={thresholds.pressureWarning.toString()}
                    onChangeText={(text: string) => {
                      const value = parseFloat(text) || 0;
                      setThresholds(prev => ({ ...prev, pressureWarning: value }));
                    }}
                    placeholder="32"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.thresholdInputGroup}>
                  <Text style={styles.thresholdLabel}>High Temperature Warning (°F)</Text>
                  <Text style={styles.thresholdHint}>Alert when temperature exceeds this value</Text>
                  <TextInput
                    style={styles.thresholdTextInput}
                    value={thresholds.temperatureHigh.toString()}
                    onChangeText={(text: string) => {
                      const value = parseFloat(text) || 0;
                      setThresholds(prev => ({ ...prev, temperatureHigh: value }));
                    }}
                    placeholder="160"
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity
                  style={styles.completeThresholdButton}
                  onPress={() => {
                    console.log(`✅ Thresholds set:`, thresholds);
                    console.log(`✅ All ${expectedTireCount} tires synced! Vehicle sync complete.`);
                    console.log('📊 Sensor IDs saved:', syncedTires);
                    onVehicleSyncComplete(syncedTires, thresholds);
                  }}
                >
                  <Icon name="checkmark-circle" size={24} color="#fff" />
                  <Text style={styles.completeThresholdButtonText}>
                    Complete Vehicle Sync
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tireSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  truckContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  syncOptionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTireText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  optionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 5,
  },
  scannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  scannerHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  scannerCloseButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 10,
  },
  scannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  manualInputContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  manualInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  manualInputCloseButton: {
    padding: 5,
  },
  manualInputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inputSection: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  syncedTiresContainer: {
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  syncedTiresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  syncedTireItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  syncedTireText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  completeSyncButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  completeSyncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  thresholdInputContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  thresholdInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  thresholdInputCloseButton: {
    padding: 5,
  },
  thresholdInputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  thresholdInputSection: {
    flex: 1,
    padding: 20,
  },
  thresholdDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  thresholdInputGroup: {
    marginBottom: 24,
  },
  thresholdLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  thresholdHint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  thresholdTextInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  completeThresholdButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  completeThresholdButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TireSyncModal;
