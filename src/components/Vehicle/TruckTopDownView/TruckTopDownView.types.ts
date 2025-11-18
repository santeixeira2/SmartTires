import { VehicleThresholds } from '../../../store/AppStore';

export interface TireData {
    psi: number;
    temp: number;
  }
  
  export interface TirePosition {
    id: string;
    x: number;
    y: number;
    label: string;
    pressure?: number;
    temperature?: number;
    isConnected?: boolean;
  }
  
  export interface TruckTopDownViewProps {
    vehicleType?: 'power_unit' | 'towing_vehicles' | 'travel_trailer' | 'fifth_wheel' | 'towable';
    axleCount?: number;
    tirePositions?: TirePosition[];
    showLabels?: boolean;
    showPressure?: boolean;
    showTemperature?: boolean;
    onTirePress?: (tireId: string) => void;
    style?: any;
    // Original overlay props
    frontLeft?: TireData;
    frontRight?: TireData;
    rearLeft?: TireData;
    rearRight?: TireData;
    // Synced tires tracking
    syncedTires?: {[key: string]: string};
    // New dynamic axle support
    axleType?: '1 Axle' | '2 Axles' | '2 Axles w/Dually' | '3 Axles' | '4 Axles' | '5 Axles' | '6 Axles';
    dynamicTireData?: {[key: string]: TireData};
    thresholds?: VehicleThresholds;
  }