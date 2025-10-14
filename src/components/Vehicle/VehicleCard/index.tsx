import React from "react";
import { View, Text, Image, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./styles";

export interface VehicleData {
  id: string;
  name: string;
  towingType: 'towing' | 'towable';
  axleType: string;
  connectionStatus: 'connected' | 'disconnected';
  imageUrl: string;
}

export interface VehicleCardProps {
  vehicle: VehicleData;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {vehicle.towingType === 'towing' ? 'Towing' : 'Towable'}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../../assets/images/map.png')} 
            style={styles.vehicleImage}
            resizeMode="contain"
          />
        </View>

        {/* Vehicle Name */}
        <Text style={styles.vehicleName}>{vehicle.name}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="car-outline" size={16} color="#6c757d" />
          <Text style={styles.footerText}>{vehicle.axleType}</Text>
        </View>
        
        <View style={styles.footerItem}>
          <Ionicons 
            name={vehicle.connectionStatus === 'connected' ? "checkmark-circle" : "close-circle"} 
            size={16} 
            color={vehicle.connectionStatus === 'connected' ? "#4CAF50" : "#F44336"} 
          />
          <Text style={[
            styles.footerText,
            { color: vehicle.connectionStatus === 'connected' ? "#4CAF50" : "#F44336" }
          ]}>
            {vehicle.connectionStatus === 'connected' ? "Connected" : "Disconnected"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default VehicleCard;