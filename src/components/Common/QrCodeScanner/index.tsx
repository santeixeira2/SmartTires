import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Alert, Modal, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices, useCodeScanner, CameraRuntimeError } from 'react-native-vision-camera';

export interface ICameraScannerProps {
  setIsCameraShown: (value: boolean) => void,
  onReadCode: (value: string) => void;
}

export const CameraScanner = ({
  setIsCameraShown, 
  onReadCode
}: ICameraScannerProps ) => {

  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back') || 
                 devices.find(d => d.position === 'front') || 
                 devices[0];
  const camera = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    checkCameraPermission();
    console.log('Available camera devices:', devices);
    console.log('Selected device:', device);
  }, [devices, device]);

  const checkCameraPermission = async () => {
    const permission = await Camera.getCameraPermissionStatus();
    if (permission === 'granted') {
      setHasPermission(true);
    } else if (permission === 'not-determined') {
      const newPermission = await Camera.requestCameraPermission();
      setHasPermission(newPermission === 'granted');
    } else {
      Alert.alert('Camera Permission', 'Camera permission is required to scan QR codes');
      setIsCameraShown(false);
    }
  };

  if(device == null) {
    // Simulator mode - show mock scanner
    return (
      <SafeAreaView style={styles.safeArea}>
        <Modal presentationStyle='fullScreen' animationType='slide' visible={true}>
          <View style={styles.cameraContainer}>
            <View style={styles.mockCamera}>
              <Text style={styles.mockCameraText}>📱 Simulator Mode</Text>
              <Text style={styles.mockCameraSubtext}>Camera not available in simulator</Text>
              
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              
              <Text style={styles.scanText}>Mock QR Scanner</Text>
              
              <View style={styles.mockButtonsContainer}>
                <TouchableOpacity 
                  style={styles.mockScanButton}
                  onPress={() => {
                    // Mock scan a QR code
                    const mockQRCode = `SENSOR-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
                    onReadCode(mockQRCode);
                  }}
                >
                  <Text style={styles.mockScanButtonText}>Mock Scan QR Code</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.manualButton}
                  onPress={() => {
                    // Show manual input
                    Alert.prompt(
                      'Enter Sensor ID',
                      'Please enter the sensor ID manually:',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Add',
                          onPress: (sensorId: string | undefined) => {
                            if (sensorId) {
                              onReadCode(sensorId.trim());
                            } else {
                              Alert.alert('Error', 'Sensor ID is required');
                            }
                          },
                        },
                      ],
                      'plain-text',
                      '',
                      'default'
                    );
                  }}
                >
                  <Text style={styles.manualButtonText}>Add Manually</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsCameraShown(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={checkCameraPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onError = (error: CameraRuntimeError) => {
    Alert.alert('Camera error', error.message);
  }

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'code-128', 'code-39', 'ean-13', 'ean-8', 'code-93', 'codabar', 'upc-e', 'pdf-417', 'aztec', 'data-matrix'],
    onCodeScanned: codes => {
      if (codes.length > 0 && !isScanned) {
        setIsScanned(true);
        const scannedValue = codes[0]?.value || 'No value found';
        onReadCode(scannedValue);
        setTimeout(() => {
          setIsCameraShown(false);
        }, 1000);
      }
    }
  })

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal presentationStyle='fullScreen' animationType='slide' visible={true} >
        <View style={styles.cameraContainer}>
          <Camera 
            ref={camera}
            onError={onError}
            photo={false}
            style={styles.fullScreenCamera}
            device={device}
            codeScanner={codeScanner} 
            isActive={true}        
          />
          
          {/* Overlay with scanning frame */}
          <View style={styles.overlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            
            <Text style={styles.scanText}>Position QR code within the frame</Text>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsCameraShown(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  fullScreenCamera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00ff00',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 30,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mockCamera: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mockCameraText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mockCameraSubtext: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  mockButtonsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
  },
  mockScanButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
  },
  mockScanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  manualButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
  },
  manualButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});