# BLE Direct Connection Implementation Guide

## Overview
Connect iPhone directly to tire sensors via Bluetooth Low Energy (BLE). No gateway, no cloud - just direct device-to-device communication.

---

## Architecture

```
Tire Sensors (BLE) → iPhone/iPad App → App Store → CarPlay Display
```

**Requirements:**
- Tire sensors must support BLE (Bluetooth 4.0+)
- iPhone must be within ~10 meters (33 feet) of vehicle
- App handles scanning, connecting, and data reading

---

## Step 1: Install BLE Library

```bash
npm install react-native-ble-manager
npm install react-native-permissions

# iOS specific
cd ios && pod install
```

**Package:** `react-native-ble-manager` - Most popular, well-maintained
**Alternative:** `react-native-ble-plx` - Another good option

---

## Step 2: Permissions Setup

### iOS: `ios/carplaytest20/Info.plist`

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>We need Bluetooth access to connect to tire pressure sensors</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>We need Bluetooth access to connect to tire pressure sensors</string>
```

### Android: `android/app/src/main/AndroidManifest.xml`

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
```

---

## Step 3: Create BLE Service

### `src/services/BLEManager.ts`

```typescript
import { BleManager, Device, Characteristic, Service } from 'react-native-ble-manager';
import { useAppStore } from '../store/AppStore';

// Tire Sensor Service and Characteristic UUIDs
// These should match your actual sensor hardware
const TIRE_SERVICE_UUID = '0000180F-0000-1000-8000-00805F9B34FB'; // Battery Service (example)
const TIRE_DATA_CHARACTERISTIC_UUID = '00002A19-0000-1000-8000-00805F9B34FB'; // Battery Level (example)
// Replace with your actual sensor UUIDs

interface TireSensor {
  deviceId: string;
  vehicleId: string;
  tireId: string; // 'front-left', 'front-right', etc.
  device: Device | null;
  isConnected: boolean;
  lastUpdate: number;
}

interface TireData {
  pressure: number; // PSI
  temperature: number; // Celsius
  batteryLevel?: number;
  timestamp: number;
}

class BLEManager {
  private manager: BleManager;
  private sensors: Map<string, TireSensor> = new Map();
  private scanTimeout: NodeJS.Timeout | null = null;
  private isScanning = false;

  constructor() {
    this.manager = new BleManager();
  }

  // Initialize BLE
  async initialize(): Promise<void> {
    try {
      await this.manager.enableBluetooth();
      console.log('✅ Bluetooth enabled');
    } catch (error) {
      console.error('❌ Failed to enable Bluetooth:', error);
      throw error;
    }
  }

  // Scan for tire sensors
  async scanForSensors(
    vehicleId: string,
    expectedTires: string[],
    onSensorFound?: (sensor: TireSensor) => void
  ): Promise<TireSensor[]> {
    if (this.isScanning) {
      console.log('⚠️ Scan already in progress');
      return [];
    }

    this.isScanning = true;
    const foundSensors: TireSensor[] = [];

    return new Promise((resolve) => {
      // Start scanning
      this.manager.startScan([], { scanPeriod: 10000 }, (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          return;
        }

        // Check if device matches tire sensor pattern
        // Adjust these checks based on your sensor hardware
        const isTireSensor = 
          device.name?.includes('Tire') ||
          device.name?.includes('TPMS') ||
          device.name?.startsWith('TIRE-') ||
          device.advertising?.name?.includes('Tire');

        if (isTireSensor && !this.sensors.has(device.id)) {
          // Determine tire position from device name or advertising data
          const tireId = this.parseTireIdFromDevice(device, expectedTires);
          
          if (tireId) {
            const sensor: TireSensor = {
              deviceId: device.id,
              vehicleId,
              tireId,
              device,
              isConnected: false,
              lastUpdate: 0
            };

            this.sensors.set(device.id, sensor);
            foundSensors.push(sensor);
            
            console.log(`🔍 Found tire sensor: ${device.name || device.id} -> ${tireId}`);
            
            if (onSensorFound) {
              onSensorFound(sensor);
            }
          }
        }
      });

      // Stop scanning after 10 seconds
      this.scanTimeout = setTimeout(() => {
        this.manager.stopScan();
        this.isScanning = false;
        console.log(`✅ Scan complete. Found ${foundSensors.length} sensors`);
        resolve(foundSensors);
      }, 10000);
    });
  }

  // Parse tire ID from device name/advertising
  private parseTireIdFromDevice(device: Device, expectedTires: string[]): string | null {
    const name = (device.name || device.advertising?.name || '').toLowerCase();
    
    // Try to match tire position from device name
    for (const tireId of expectedTires) {
      const patterns = [
        tireId.replace('-', ' '),
        tireId,
        tireId.replace('-', ''),
      ];
      
      for (const pattern of patterns) {
        if (name.includes(pattern.toLowerCase())) {
          return tireId;
        }
      }
    }
    
    // Fallback: assign first available tire position
    const usedTires = Array.from(this.sensors.values()).map(s => s.tireId);
    const availableTire = expectedTires.find(t => !usedTires.includes(t));
    return availableTire || null;
  }

  // Connect to a specific sensor
  async connectToSensor(sensorId: string): Promise<void> {
    const sensor = this.sensors.get(sensorId);
    if (!sensor || !sensor.device) {
      throw new Error(`Sensor ${sensorId} not found`);
    }

    try {
      console.log(`🔌 Connecting to sensor: ${sensor.deviceId}`);
      await this.manager.connectToDevice(sensor.device.id);
      await this.manager.discoverAllServicesAndCharacteristicsForDevice(sensor.device.id);
      
      sensor.isConnected = true;
      console.log(`✅ Connected to sensor: ${sensor.deviceId}`);
    } catch (error) {
      console.error(`❌ Failed to connect to sensor ${sensorId}:`, error);
      sensor.isConnected = false;
      throw error;
    }
  }

  // Subscribe to tire data updates
  async subscribeToTireData(
    sensorId: string,
    onUpdate: (data: TireData) => void
  ): Promise<void> {
    const sensor = this.sensors.get(sensorId);
    if (!sensor || !sensor.device) {
      throw new Error(`Sensor ${sensorId} not found`);
    }

    if (!sensor.isConnected) {
      await this.connectToSensor(sensorId);
    }

    try {
      // Start notifications for tire data
      await this.manager.startNotification(
        sensor.device.id,
        TIRE_SERVICE_UUID,
        TIRE_DATA_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error(`Notification error for ${sensorId}:`, error);
            return;
          }

          // Parse tire data from BLE characteristic
          const tireData = this.parseTireDataFromCharacteristic(characteristic);
          
          if (tireData) {
            sensor.lastUpdate = Date.now();
            
            // Update store without resetting CarPlay
            const { dispatch } = useAppStore.getState();
            dispatch({
              type: 'UPDATE_VEHICLE_TIRE_DATA',
              payload: {
                vehicleId: sensor.vehicleId,
                tireData: {
                  [sensor.tireId]: {
                    psi: tireData.pressure,
                    temp: tireData.temperature
                  }
                }
              }
            });

            // Call callback
            onUpdate(tireData);
          }
        }
      );

      console.log(`📡 Subscribed to tire data: ${sensorId}`);
    } catch (error) {
      console.error(`❌ Failed to subscribe to ${sensorId}:`, error);
      throw error;
    }
  }

  // Parse tire data from BLE characteristic value
  private parseTireDataFromCharacteristic(characteristic: Characteristic): TireData | null {
    if (!characteristic.value) {
      return null;
    }

    try {
      // Example data format (adjust based on your sensor):
      // Byte 0-1: Pressure (uint16, PSI * 10)
      // Byte 2-3: Temperature (uint16, Celsius * 10)
      // Byte 4: Battery level (uint8, 0-100)
      
      const buffer = Buffer.from(characteristic.value, 'base64');
      
      const pressure = buffer.readUInt16LE(0) / 10; // Convert to PSI
      const temperature = buffer.readUInt16LE(2) / 10; // Convert to Celsius
      const batteryLevel = buffer.length > 4 ? buffer.readUInt8(4) : undefined;

      return {
        pressure: Math.max(0, Math.min(150, pressure)), // Clamp to reasonable range
        temperature: Math.max(-40, Math.min(100, temperature)), // Clamp to reasonable range
        batteryLevel,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error parsing tire data:', error);
      return null;
    }
  }

  // Connect to all sensors for a vehicle
  async connectToVehicleSensors(vehicleId: string): Promise<void> {
    const vehicleSensors = Array.from(this.sensors.values())
      .filter(s => s.vehicleId === vehicleId);

    console.log(`🔌 Connecting to ${vehicleSensors.length} sensors for vehicle ${vehicleId}`);

    // Connect to all sensors in parallel
    const connectPromises = vehicleSensors.map(sensor =>
      this.connectToSensor(sensor.deviceId).catch(error => {
        console.error(`Failed to connect to ${sensor.deviceId}:`, error);
      })
    );

    await Promise.all(connectPromises);
  }

  // Subscribe to all sensors for a vehicle
  async subscribeToVehicleSensors(
    vehicleId: string,
    onUpdate?: (sensorId: string, data: TireData) => void
  ): Promise<void> {
    const vehicleSensors = Array.from(this.sensors.values())
      .filter(s => s.vehicleId === vehicleId);

    console.log(`📡 Subscribing to ${vehicleSensors.length} sensors for vehicle ${vehicleId}`);

    const subscribePromises = vehicleSensors.map(sensor =>
      this.subscribeToTireData(sensor.deviceId, (data) => {
        if (onUpdate) {
          onUpdate(sensor.deviceId, data);
        }
      }).catch(error => {
        console.error(`Failed to subscribe to ${sensor.deviceId}:`, error);
      })
    );

    await Promise.all(subscribePromises);
  }

  // Disconnect from sensor
  async disconnectFromSensor(sensorId: string): Promise<void> {
    const sensor = this.sensors.get(sensorId);
    if (!sensor || !sensor.device) {
      return;
    }

    try {
      await this.manager.disconnect(sensor.device.id);
      sensor.isConnected = false;
      console.log(`🔌 Disconnected from sensor: ${sensorId}`);
    } catch (error) {
      console.error(`❌ Failed to disconnect from ${sensorId}:`, error);
    }
  }

  // Get connected sensors
  getConnectedSensors(vehicleId?: string): TireSensor[] {
    const allSensors = Array.from(this.sensors.values());
    const connected = allSensors.filter(s => s.isConnected);
    
    if (vehicleId) {
      return connected.filter(s => s.vehicleId === vehicleId);
    }
    
    return connected;
  }

  // Cleanup
  cleanup(): void {
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
    }
    
    // Disconnect from all sensors
    Array.from(this.sensors.values()).forEach(sensor => {
      if (sensor.isConnected) {
        this.disconnectFromSensor(sensor.deviceId);
      }
    });
    
    this.sensors.clear();
    this.isScanning = false;
  }
}

// Singleton instance
export const bleManager = new BLEManager();
export default bleManager;
```

---

## Step 4: Create React Hook for BLE

### `src/hooks/useBLETireSensors.ts`

```typescript
import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../store/AppStore';
import bleManager from '../services/BLEManager';

export const useBLETireSensors = (vehicleId: string) => {
  const { state } = useAppStore();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedSensors, setConnectedSensors] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Initialize BLE on mount
  useEffect(() => {
    bleManager.initialize().catch(err => {
      setError('Failed to initialize Bluetooth');
      console.error(err);
    });

    return () => {
      bleManager.cleanup();
    };
  }, []);

  // Scan for sensors
  const scanForSensors = useCallback(async () => {
    if (isScanning) return;

    setIsScanning(true);
    setError(null);

    try {
      const vehicle = state.vehiclesData.find(v => v.id === vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      // Get expected tire positions based on axle type
      const getExpectedTires = (axleType: string): string[] => {
        switch (axleType) {
          case '1 Axle':
            return ['left', 'right'];
          case '2 Axles':
            return ['front-left', 'front-right', 'rear-left', 'rear-right'];
          case '2 Axles w/Dually':
            return ['front-left', 'front-right', 'rear-left-inner', 'rear-left-outer', 'rear-right-inner', 'rear-right-outer'];
          default:
            return ['front-left', 'front-right', 'rear-left', 'rear-right'];
        }
      };

      const expectedTires = getExpectedTires(vehicle.axleType);
      
      const foundSensors = await bleManager.scanForSensors(
        vehicleId,
        expectedTires
      );

      console.log(`Found ${foundSensors.length} sensors for ${vehicle.name}`);

      // Auto-connect and subscribe to found sensors
      if (foundSensors.length > 0) {
        await bleManager.connectToVehicleSensors(vehicleId);
        await bleManager.subscribeToVehicleSensors(vehicleId);
        
        const connected = bleManager.getConnectedSensors(vehicleId);
        setConnectedSensors(connected.length);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to scan for sensors');
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  }, [vehicleId, state.vehiclesData, isScanning]);

  // Auto-connect when vehicle changes
  useEffect(() => {
    if (vehicleId) {
      const connected = bleManager.getConnectedSensors(vehicleId);
      if (connected.length === 0) {
        // Auto-scan and connect
        scanForSensors();
      } else {
        setConnectedSensors(connected.length);
      }
    }
  }, [vehicleId]);

  return {
    isScanning,
    connectedSensors,
    error,
    scanForSensors,
    disconnect: () => {
      bleManager.getConnectedSensors(vehicleId).forEach(sensor => {
        bleManager.disconnectFromSensor(sensor.deviceId);
      });
      setConnectedSensors(0);
    }
  };
};
```

---

## Step 5: Integrate into CarPlayScreen

### Update `src/screens/CarPlayScreen/index.tsx`

```typescript
import { useBLETireSensors } from '../hooks/useBLETireSensors';

const CarPlayScreen: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const [isCarPlayConnected, setIsCarPlayConnected] = React.useState(false);
  
  // BLE connection for selected vehicle
  const selectedVehicleId = state.selectedVehicleId || state.vehiclesData[0]?.id;
  const { connectedSensors } = useBLETireSensors(selectedVehicleId || '');

  // ... rest of your CarPlayScreen code
```

**Note:** The BLE hook automatically updates the store via `UPDATE_VEHICLE_TIRE_DATA`, which triggers CarPlay template updates without resetting.

---

## Step 6: Add BLE Status to Settings/Home Screen

Show connection status to users:

```typescript
// In HomeScreen or SettingsScreen
const { connectedSensors, isScanning, scanForSensors } = useBLETireSensors(vehicleId);

<TouchableOpacity onPress={scanForSensors} disabled={isScanning}>
  <Text>{isScanning ? 'Scanning...' : 'Scan for Tire Sensors'}</Text>
  <Text>{connectedSensors} sensors connected</Text>
</TouchableOpacity>
```

---

## Important Notes

### 1. **Sensor UUIDs**
Replace `TIRE_SERVICE_UUID` and `TIRE_DATA_CHARACTERISTIC_UUID` with your actual sensor hardware UUIDs.

### 2. **Data Format**
Adjust `parseTireDataFromCharacteristic()` based on your sensor's data format.

### 3. **Tire ID Mapping**
You need a way to map sensor devices to tire positions. Options:
- **Device name pattern**: Sensors named "TIRE-FRONT-LEFT", etc.
- **Manual pairing**: User assigns sensors to positions during setup
- **Advertising data**: Sensors broadcast tire position in BLE advertising

### 4. **Background Limitations**
iOS restricts BLE in background. For always-on monitoring:
- Use "Background Modes" → "Uses Bluetooth LE accessories"
- Or require app to be in foreground

### 5. **Range**
BLE range is ~10 meters. If user moves away, connection drops.

---

## Advantages of BLE Direct

✅ **Free** - No cloud costs
✅ **Fast** - 1-50ms latency
✅ **Offline** - Works without internet
✅ **Simple** - Direct connection, no infrastructure
✅ **Real-time** - Immediate sensor readings

---

## Testing Without Hardware

Create a mock BLE manager for testing:

```typescript
// src/services/MockBLEManager.ts
class MockBLEManager {
  // Simulate BLE with setInterval
  startMockUpdates(vehicleId: string) {
    setInterval(() => {
      // Generate mock tire data
      const mockData = {
        vehicleId,
        tireData: {
          'front-left': { psi: 30 + Math.random() * 2, temp: 20 + Math.random() * 1 },
          'front-right': { psi: 31 + Math.random() * 2, temp: 21 + Math.random() * 1 },
          // ...
        }
      };
      
      // Update store
      dispatch({
        type: 'UPDATE_VEHICLE_TIRE_DATA',
        payload: mockData
      });
    }, 2000);
  }
}
```

---

This implementation will:
- ✅ Connect directly to tire sensors via BLE
- ✅ Update tire data in real-time
- ✅ Update CarPlay without resetting templates
- ✅ Handle multiple sensors per vehicle
- ✅ Work offline (no internet needed)

