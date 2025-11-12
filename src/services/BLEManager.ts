import BleManagerModule, { 
  Peripheral, 
  PeripheralInfo,
  BleManagerDidUpdateValueForCharacteristicEvent
} from 'react-native-ble-manager';
import { EventSubscription } from 'react-native';

// Tire Sensor Service and Characteristic UUIDs
// These should match your actual sensor hardware
const TIRE_SERVICE_UUID = '0000180F-0000-1000-8000-00805F9B34FB'; // Battery Service (example)
const TIRE_DATA_CHARACTERISTIC_UUID = '00002A19-0000-1000-8000-00805F9B34FB'; // Battery Level (example)
// Replace with your actual sensor UUIDs

interface TireSensor {
  deviceId: string;
  vehicleId: string;
  tireId: string; // 'front-left', 'front-right', etc.
  device: Peripheral | null;
  isConnected: boolean;
  lastUpdate: number;
}

interface TireData {
  pressure: number; // PSI
  temperature: number; // Celsius
  batteryLevel?: number;
  timestamp: number;
}

type AppDispatch = (action: { type: string; payload: any }) => void;

class BLEManager {
  private manager: typeof BleManagerModule;
  private sensors: Map<string, TireSensor> = new Map();
  private scanTimeout: NodeJS.Timeout | null = null;
  private isScanning = false;
  private eventSubscriptions: EventSubscription[] = [];
  private dispatch: AppDispatch | null = null;

  constructor() {
    this.manager = BleManagerModule;
  }

  // Set dispatch function for updating store (called from React components)
  setDispatch(dispatch: AppDispatch): void {
    this.dispatch = dispatch;
  }

  // Initialize BLE
  async initialize(): Promise<void> {
    try {
      await this.manager.enableBluetooth();
      console.log('Bluetooth enabled');
    } catch (error) {
      console.error('Failed to enable Bluetooth:', error);
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
      console.log('Scan already in progress');
      return [];
    }

    this.isScanning = true;
    const foundSensors: TireSensor[] = [];

    // Set up event listener for discovered peripherals
    const discoverSubscription = this.manager.onDiscoverPeripheral((peripheral: Peripheral) => {
      // Check if device matches tire sensor pattern
      // Adjust these checks based on your sensor hardware
      const isTireSensor = 
        peripheral.name?.includes('Tire') ||
        peripheral.name?.includes('TPMS') ||
        peripheral.name?.startsWith('TIRE-') ||
        peripheral.advertising?.localName?.includes('Tire');

      if (isTireSensor && !this.sensors.has(peripheral.id)) {
        // Determine tire position from device name or advertising data
        const tireId = this.parseTireIdFromDevice(peripheral, expectedTires);
        
        if (tireId) {
          const sensor: TireSensor = {
            deviceId: peripheral.id,
            vehicleId,
            tireId,
            device: peripheral,
            isConnected: false,
            lastUpdate: 0
          };

          this.sensors.set(peripheral.id, sensor);
          foundSensors.push(sensor);
          
          console.log(`Found tire sensor: ${peripheral.name || peripheral.id} -> ${tireId}`);
          
          if (onSensorFound) {
            onSensorFound(sensor);
          }
        }
      }
    });

    this.eventSubscriptions.push(discoverSubscription);

    return new Promise(async (resolve, reject) => {
      try {
        // Start scanning
        await this.manager.scan([], 10, false);

        // Stop scanning after 10 seconds
        this.scanTimeout = setTimeout(async () => {
          try {
            await this.manager.stopScan();
            discoverSubscription.remove();
            this.isScanning = false;
            console.log(`Scan complete. Found ${foundSensors.length} sensors`);
            resolve(foundSensors);
          } catch (error) {
            console.error('Error stopping scan:', error);
            this.isScanning = false;
            resolve(foundSensors);
          }
        }, 10000);
      } catch (error) {
        console.error('Scan error:', error);
        discoverSubscription.remove();
        this.isScanning = false;
        reject(error);
      }
    });
  }

  // Parse tire ID from device name/advertising
  private parseTireIdFromDevice(device: Peripheral, expectedTires: string[]): string | null {
    const name = (device.name || device.advertising?.localName || '').toLowerCase();
    
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
      console.log(`Connecting to sensor: ${sensor.deviceId}`);
      await this.manager.connect(sensor.device.id);
      await this.manager.retrieveServices(sensor.device.id);
      
      sensor.isConnected = true;
      console.log(`Connected to sensor: ${sensor.deviceId}`);
    } catch (error) {
      console.error(`Failed to connect to sensor ${sensorId}:`, error);
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
      // Set up event listener for characteristic value updates
      const characteristicSubscription = this.manager.onDidUpdateValueForCharacteristic(
        (data: BleManagerDidUpdateValueForCharacteristicEvent) => {
          // Only process updates for this sensor
          if (data.peripheral !== sensor.device!.id) {
            return;
          }

          // Only process updates for the tire data characteristic
          if (
            data.service !== TIRE_SERVICE_UUID ||
            data.characteristic !== TIRE_DATA_CHARACTERISTIC_UUID
          ) {
            return;
          }

          // Parse tire data from BLE characteristic value (number array)
          const tireData = this.parseTireDataFromCharacteristic(data.value);
          
          if (tireData) {
            sensor.lastUpdate = Date.now();
            
            // Update store if dispatch is available
            if (this.dispatch) {
              console.log(`BLEManager: Updating store for vehicle ${sensor.vehicleId}, tire ${sensor.tireId}`);
              console.log(`BLEManager: Tire data - PSI: ${tireData.pressure}, Temp: ${tireData.temperature}`);
              this.dispatch({
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
              console.log(`BLEManager: Store update dispatched`);
            } else {
              console.warn('BLEManager: No dispatch function available!');
            }

            // Call callback
            onUpdate(tireData);
          }
        }
      );

      this.eventSubscriptions.push(characteristicSubscription);

      // Start notifications for tire data
      await this.manager.startNotification(
        sensor.device.id,
        TIRE_SERVICE_UUID,
        TIRE_DATA_CHARACTERISTIC_UUID
      );

      console.log(`Subscribed to tire data: ${sensorId}`);
    } catch (error) {
      console.error(`Failed to subscribe to ${sensorId}:`, error);
      throw error;
    }
  }

  // Parse tire data from BLE characteristic value
  private parseTireDataFromCharacteristic(value: number[]): TireData | null {
    if (!value || value.length === 0) {
      return null;
    }

    try {
      // Example data format (adjust based on your sensor):
      // Byte 0-1: Pressure (uint16, PSI * 10)
      // Byte 2-3: Temperature (uint16, Celsius * 10)
      // Byte 4: Battery level (uint8, 0-100)
      
      // Convert number array to Buffer
      const buffer = Buffer.from(value);
      
      if (buffer.length < 4) {
        console.warn('Tire data too short:', buffer.length);
        return null;
      }
      
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

    console.log(`Connecting to ${vehicleSensors.length} sensors for vehicle ${vehicleId}`);

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

    console.log(`Subscribing to ${vehicleSensors.length} sensors for vehicle ${vehicleId}`);

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
      console.log(`Disconnected from sensor: ${sensorId}`);
    } catch (error) {
      console.error(`Failed to disconnect from ${sensorId}:`, error);
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
      this.scanTimeout = null;
    }
    
    // Remove all event subscriptions
    this.eventSubscriptions.forEach(subscription => {
      subscription.remove();
    });
    this.eventSubscriptions = [];
    
    // Disconnect from all sensors
    Array.from(this.sensors.values()).forEach(sensor => {
      if (sensor.isConnected) {
        this.disconnectFromSensor(sensor.deviceId).catch(error => {
          console.error(`Error disconnecting from ${sensor.deviceId}:`, error);
        });
      }
    });
    
    this.sensors.clear();
    this.isScanning = false;
  }
}

// Singleton instance
export const bleManager = new BLEManager();
export default bleManager;