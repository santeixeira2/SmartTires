import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import styles from './TruckTopDownView.style';
import AxleTopDownView, { AxleTireData } from './AxleTopDownView';
import { useAppStore, VehicleThresholds } from '../../../store/AppStore';
import { formatPressure, formatTemperature } from '../../../utils/units';
import { 
  TruckTopDownViewProps, 
  TireData, 
  TirePosition 
} from './TruckTopDownView.types';

const TruckTopDownView: React.FC<TruckTopDownViewProps> = ({
  vehicleType,
  axleCount,
  tirePositions,
  showLabels = true,
  showPressure = false,
  showTemperature = false,
  onTirePress,
  style,
  frontLeft,
  frontRight,
  rearLeft,
  rearRight,
  syncedTires,
  axleType,
  dynamicTireData,
  thresholds
}) => {
  const { state } = useAppStore();
  const getTireColor = (tireId: string) => {
    if (syncedTires) {
      const isSynced = syncedTires[tireId];
      console.log(`🔥 TruckTopDownView - Tire ${tireId}: synced=${isSynced}, color=${isSynced ? "#007AFF" : "#6c757d"}`);
      return isSynced ? "#007AFF" : "#6c757d";
    }
    return "#212121";
  };
  
  const [colors, setColors] = useState({
    frontLeft: getTireColor('front-left'),
    frontRight: getTireColor('front-right'),
    rearLeft: getTireColor('rear-left'),
    rearRight: getTireColor('rear-right'),
  });

  useEffect(() => {
    const getTireColorForSync = (tireId: string) => {
      if (syncedTires) {
        const isSynced = syncedTires[tireId];
        console.log(`🔥 TruckTopDownView - Tire ${tireId}: synced=${isSynced}, color=${isSynced ? "#007AFF" : "#6c757d"}`);
        return isSynced ? "#007AFF" : "#6c757d";
      }
      return "#212121";
    };

    const newColors = {
      frontLeft: getTireColorForSync('front-left'),
      frontRight: getTireColorForSync('front-right'),
      rearLeft: getTireColorForSync('rear-left'),
      rearRight: getTireColorForSync('rear-right'),
    };
    console.log('🔥 TruckTopDownView - Updating colors:', newColors);
    setColors(newColors);
  }, [syncedTires]);

  const getVehicleImage = () => {
    if (vehicleType === 'towable') {
      return require('../../../assets/images/trailer.png');
    }
    return require('../../../assets/images/ford-ranger-topdown.png');
  };

  if (axleType) {
    const axleTireData: {[key: string]: AxleTireData} = {};
    if (dynamicTireData) {
      Object.keys(dynamicTireData).forEach(key => {
        const tire = dynamicTireData[key];
        // Standardize: use psi/temp consistently (store format)
        // TireData interface uses psi/temp
        axleTireData[key] = {
          psi: tire?.psi ?? 30,
          temp: tire?.temp ?? 20
        };  
      });
    }

    return (
      <AxleTopDownView
        axleType={axleType}
        tireData={axleTireData}
        onTirePress={onTirePress}
        syncedTires={syncedTires}
        vehicleType={
          vehicleType === "towing_vehicles" ||
          vehicleType === "travel_trailer" ||
          vehicleType === "fifth_wheel"
            ? undefined
            : vehicleType
        }
        style={style}
        thresholds={thresholds}
      />
    );
  }

  useEffect(() => {
    if (frontLeft && frontRight && rearLeft && rearRight && !syncedTires) {
      const calcColor = (tire: TireData) => {
        // Use stored thresholds or fallback to defaults
        const pressureLow = thresholds?.pressureLow ?? 28;
        const pressureWarning = thresholds?.pressureWarning ?? 32;
        const temperatureHigh = thresholds?.temperatureHigh ?? 160;
        
        // tire.temp is in Celsius, convert to Fahrenheit for comparison
        const tempF = (tire.temp * 9/5) + 32;
        if (tire.psi < pressureLow || tempF > temperatureHigh) return "red";
        if (tire.psi < pressureWarning) return "orange"; 
        return "green";
      };

      setColors({
        frontLeft: calcColor(frontLeft),
        frontRight: calcColor(frontRight),
        rearLeft: calcColor(rearLeft),
        rearRight: calcColor(rearRight),
      });
    }
  }, [frontLeft, frontRight, rearLeft, rearRight, syncedTires, thresholds]);

  const getVehicleColor = () => {
    switch (vehicleType) {
      case 'power_unit':
        return '#007bff';
      case 'towing_vehicles':
        return '#28a745';
      case 'travel_trailer':
        return '#ffc107';
      case 'fifth_wheel':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const renderTire = (tire: TirePosition) => (
    <TouchableOpacity
      key={tire.id}
      style={[
        styles.tire,
        {
          left: tire.x,
          top: tire.y,
          backgroundColor: tire.isConnected ? getVehicleColor() : '#e9ecef',
        }
      ]}
      onPress={() => onTirePress?.(tire.id)}
      activeOpacity={0.7}
    >
      {showLabels && (
        <Text style={styles.tireLabel}>{tire.label}</Text>
      )}
      {showPressure && tire.pressure && (
        <Text style={styles.tireData}>
          {formatPressure(tire.pressure, state.units)}
        </Text>
      )}
      {showTemperature && tire.temperature && (
        <Text style={styles.tireData}>
          {formatTemperature((tire.temperature * 9/5) + 32, state.units)}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (frontLeft && frontRight && rearLeft && rearRight) {
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
            <TouchableOpacity 
              style={[styles.tire, styles.frontLeftTire, { backgroundColor: colors.frontLeft }]} 
              onPress={() => onTirePress?.('front-left')}
              activeOpacity={0.5}
            />
            <TouchableOpacity 
              style={[styles.tire, styles.frontRightTire, { backgroundColor: colors.frontRight }]} 
              onPress={() => onTirePress?.('front-right')}
              activeOpacity={0.5}
            />
            <TouchableOpacity 
              style={[styles.tire, styles.rearLeftTire, { backgroundColor: colors.rearLeft }]} 
              onPress={() => onTirePress?.('rear-left')}
              activeOpacity={0.5}
            />
            <TouchableOpacity 
              style={[styles.tire, styles.rearRightTire, { backgroundColor: colors.rearRight }]} 
              onPress={() => onTirePress?.('rear-right')}
              activeOpacity={0.5}
            />
          </View>
        </View>
      </View>
    );
  }

  return (  
    <View style={[styles.container, style]}>
      <View style={styles.vehicleContainer}>
        <Image 
          source={getVehicleImage()} 
          style={styles.vehicleImage}
          resizeMode="contain"
        />
        <Text style={styles.vehicleType}>{(vehicleType || 'power_unit').replace('_', ' ').toUpperCase()}</Text>
        <Text style={styles.axleInfo}>{axleCount || 2} Axle{(axleCount || 2) > 1 ? 's' : ''}</Text>
      </View>
      
      <View style={styles.tireContainer}>
        {(tirePositions || []).map(renderTire)}
      </View>
    </View>
  );
};



export default TruckTopDownView;
