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
    vehicleType?: 'power_unit' | 'towing_vehicles' | 'travel_trailer' | 'fifth_wheel';
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
  }