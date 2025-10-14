import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
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
  // Original overlay props
  frontLeft,
  frontRight,
  rearLeft,
  rearRight
}) => {
  // Color state for overlay functionality
  const [colors, setColors] = useState({
    frontLeft: "#212121",
    frontRight: "#212121",
    rearLeft: "#212121",
    rearRight: "#212121",
  });

  // Use Ford Ranger image for all vehicle types
  const getVehicleImage = () => {
    return require('../../../assets/images/map.png');
  };

  // Original overlay color calculation
  useEffect(() => {
    if (frontLeft && frontRight && rearLeft && rearRight) {
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
  }, [frontLeft, frontRight, rearLeft, rearRight]);

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
    <View
      key={tire.id}
      style={[
        styles.tire,
        {
          left: tire.x,
          top: tire.y,
          backgroundColor: tire.isConnected ? getVehicleColor() : '#e9ecef',
        }
      ]}
      onTouchEnd={() => onTirePress?.(tire.id)}
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
    </View>
  );

  if (frontLeft && frontRight && rearLeft && rearRight) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.truckContainer}>
          <Image 
            source={getVehicleImage()} 
            style={styles.truckImage}
            resizeMode="contain"
          />
          
          <View style={styles.tiresOverlay}>
            <View style={[styles.tire, styles.frontLeftTire, { backgroundColor: colors.frontLeft }]} />
            <View style={[styles.tire, styles.frontRightTire, { backgroundColor: colors.frontRight }]} />
            <View style={[styles.tire, styles.rearLeftTire, { backgroundColor: colors.rearLeft }]} />
            <View style={[styles.tire, styles.rearRightTire, { backgroundColor: colors.rearRight }]} />
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
