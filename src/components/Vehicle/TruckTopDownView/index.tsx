import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import styles from './TruckTopDownView.style';
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
  syncedTires
}) => {
  // console.log('🔥 TruckTopDownView - onTirePress prop:', onTirePress);
  
  // Set tire colors based on sync status
  const getTireColor = (tireId: string) => {
    // If syncedTires prop is provided (sync modal context), use sync colors
    if (syncedTires) {
      const isSynced = syncedTires[tireId];
      console.log(`🔥 TruckTopDownView - Tire ${tireId}: synced=${isSynced}, color=${isSynced ? "#007AFF" : "#6c757d"}`);
      return isSynced ? "#007AFF" : "#6c757d"; // Blue if synced, gray if not
    }
    // Default colors for normal usage (HomeScreen)
    return "#212121";
  };
  
  const [colors, setColors] = useState({
    frontLeft: getTireColor('front-left'),
    frontRight: getTireColor('front-right'),
    rearLeft: getTireColor('rear-left'),
    rearRight: getTireColor('rear-right'),
  });

  // Update colors when syncedTires changes (only in sync modal)
  useEffect(() => {
    const getTireColorForSync = (tireId: string) => {
      // If syncedTires prop is provided (sync modal context), use sync colors
      if (syncedTires) {
        const isSynced = syncedTires[tireId];
        console.log(`🔥 TruckTopDownView - Tire ${tireId}: synced=${isSynced}, color=${isSynced ? "#007AFF" : "#6c757d"}`);
        return isSynced ? "#007AFF" : "#6c757d"; // Blue if synced, gray if not
      }
      // Default colors for normal usage (HomeScreen)
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
    return require('../../../assets/images/ford-ranger-topdown.png');
  };

  useEffect(() => {
    // Only apply pressure-based colors if NOT in sync modal context
    if (frontLeft && frontRight && rearLeft && rearRight && !syncedTires) {
      const calcColor = (tire: TireData) => {
        if (tire.psi < 28 || tire.temp > 160) return "red";
        if (tire.psi < 32) return "orange"; 
        return "green";
      };

      setColors({
        frontLeft: calcColor(frontLeft),
        frontRight: calcColor(frontRight),
        rearLeft: calcColor(rearLeft),
        rearRight: calcColor(rearRight),
      });
    }
  }, [frontLeft, frontRight, rearLeft, rearRight, syncedTires]);

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
        <Text style={styles.tireData}>{tire.pressure} PSI</Text>
      )}
      {showTemperature && tire.temperature && (
        <Text style={styles.tireData}>{tire.temperature}°C</Text>
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
