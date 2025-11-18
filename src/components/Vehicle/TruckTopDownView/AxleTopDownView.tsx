import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './TruckTopDownView.style';
import { VehicleThresholds } from '../../../store/AppStore';

export interface AxleTireData {
  psi: number;
  temp: number;
}

export interface AxleTopDownViewProps {
  axleType: '1 Axle' | '2 Axles' | '2 Axles w/Dually' | '3 Axles' | '4 Axles' | '5 Axles' | '6 Axles';
  tireData?: {[key: string]: AxleTireData};
  onTirePress?: (tireId: string) => void;
  syncedTires?: {[key: string]: string};
  vehicleType?: 'power_unit' | 'towable';
  style?: any;
  thresholds?: VehicleThresholds;
}

const AxleTopDownView: React.FC<AxleTopDownViewProps> = ({
  axleType,
  tireData = {},
  onTirePress,
  syncedTires,
  vehicleType = 'power_unit',
  style,
  thresholds
}) => {
  // Force re-render when tireData changes
  const tireDataHash = React.useMemo(() => {
    return JSON.stringify(tireData);
  }, [tireData]);
  
  React.useEffect(() => {
    console.log('AxleTopDownView: Tire data updated', tireData);
  }, [tireDataHash]);
  
  const getVehicleImage = () => {
    if (vehicleType === 'towable') {
      return require('../../../assets/images/trailer.png');
    }
    return require('../../../assets/images/ford-ranger-topdown.png');
  };

  const getTireColor = (tireId: string, tireData?: AxleTireData) => {
    if (syncedTires) {
      const isSynced = syncedTires[tireId];
      return isSynced ? "#007AFF" : "#6c757d"; // Blue if synced, gray if not
    }
    
    if (tireData) {
      // Use stored thresholds or fallback to defaults
      const pressureLow = thresholds?.pressureLow ?? 28;
      const pressureWarning = thresholds?.pressureWarning ?? 32;
      const temperatureHigh = thresholds?.temperatureHigh ?? 160;
      
      // tireData.temp is in Celsius, convert to Fahrenheit for comparison
      const tempF = (tireData.temp * 9/5) + 32;
      if (tireData.psi < pressureLow || tempF > temperatureHigh) return "red";
      if (tireData.psi < pressureWarning) return "orange"; 
      return "green";
    }
    
    return "#212121";
  };

  const getTirePositions = () => {
    const positions = [];
    
    console.log('🔧 AxleTopDownView - axleType:', axleType);
    console.log('🔧 AxleTopDownView - vehicleType:', vehicleType);
    
    if (axleType === '1 Axle' || axleType?.includes('1 Axle') || axleType?.includes('1')) {
      positions.push(
        { id: 'left', x: 30, y: 50, label: '' },
        { id: 'right', x: 70, y: 50, label: '' }
      );
    } else {
      switch (axleType) {
        case '2 Axles':
        positions.push(
          { id: 'front-left', x: 30, y: 15, label: '' },
          { id: 'front-right', x: 70, y: 15, label: '' },
          { id: 'rear-left', x: 30, y: 80, label: '' },
          { id: 'rear-right', x: 70, y: 80, label: '' }
        );
        break;
        
      case '2 Axles w/Dually':
        positions.push(
          { id: 'front-left', x: 30, y: 15, label: '' },
          { id: 'front-right', x: 70, y: 15, label: '' },
          { id: 'rear-left-inner', x: 25, y: 80, label: '' },
          { id: 'rear-left-outer', x: 15, y: 80, label: '' },
          { id: 'rear-right-inner', x: 75, y: 80, label: '' },
          { id: 'rear-right-outer', x: 85, y: 80, label: '' }
        );
        break;
        
      case '3 Axles':
        positions.push(
          { id: 'front-left', x: 25, y: 15, label: '' },
          { id: 'front-right', x: 75, y: 15, label: '' },
          { id: 'middle-left', x: 25, y: 50, label: '' },
          { id: 'middle-right', x: 75, y: 50, label: '' },
          { id: 'rear-left', x: 25, y: 65, label: '' },
          { id: 'rear-right', x: 75, y: 65, label: '' }
        );
        break;
        
      default:
        console.log('⚠️ Unknown axleType:', axleType, 'defaulting to 2 Axles');
        positions.push(
          { id: 'front-left', x: 30, y: 15, label: '' },
          { id: 'front-right', x: 70, y: 15, label: '' },
          { id: 'rear-left', x: 30, y: 80, label: '' },
          { id: 'rear-right', x: 70, y: 80, label: '' }
        );
        break;
      }
    }
    
    console.log('🔧 Generated positions:', positions);
    return positions;
  };

  const tirePositions = getTirePositions();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.truckContainer}>
        <View style={styles.truckImageContainer} pointerEvents="none">
          <Image 
            source={getVehicleImage()} 
            style={styles.truckImage}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.tiresOverlay}>
          {tirePositions.map((tire) => {
            const tireDataForTire = tireData[tire.id];
            const tireColor = getTireColor(tire.id, tireDataForTire);
            
            return (
              <TouchableOpacity
                key={tire.id}
                style={[
                  styles.tire,
                  {
                    position: 'absolute',
                    left: `${tire.x}%`,
                    top: `${tire.y}%`,
                    backgroundColor: tireColor,
                    transform: [{ translateX: -25 }, { translateY: -40 }]
                  }
                ]}
                onPress={() => onTirePress?.(tire.id)}
                activeOpacity={0.5}
              >
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default AxleTopDownView;
