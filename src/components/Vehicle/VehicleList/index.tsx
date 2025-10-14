import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./styles";

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  towingType: string;
  axleType: string;
  tireCount: number;
  isMain: boolean;
}

interface VehicleListProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicleId: string) => void;
  disabled?: boolean;
  title?: string;
  subtitle?: string;
}

const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  onVehicleSelect,
  disabled = false,
  title = "Select Vehicle",
  subtitle = "Tap on a vehicle to select it",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      
      {vehicles.map((vehicle) => (
        <TouchableOpacity
          key={vehicle.id}
          style={styles.vehicleItem}
          onPress={() => onVehicleSelect(vehicle.id)}
          disabled={disabled}
        >
          <View style={styles.vehicleHeader}>
            <View style={styles.vehicleIcon}>
              <Ionicons 
                name={vehicle.isMain ? "car-outline" : "car-sport-outline"} 
                size={24} 
                color="#007bff" 
              />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.vehicleType}>{vehicle.type}</Text>
            </View>
            <View style={styles.vehicleStats}>
              <Text style={styles.vehicleTireCount}>{vehicle.tireCount} tires</Text>
              <Ionicons name="chevron-forward" size={20} color="#6c757d" />
            </View>
          </View>
          
          <View style={styles.vehicleDetails}>
            <View style={styles.vehicleDetailItem}>
              <Text style={styles.vehicleDetailLabel}>Towing Type:</Text>
              <Text style={styles.vehicleDetailValue}>{vehicle.towingType}</Text>
            </View>
            <View style={styles.vehicleDetailItem}>
              <Text style={styles.vehicleDetailLabel}>Axle Type:</Text>
              <Text style={styles.vehicleDetailValue}>{vehicle.axleType}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default VehicleList;