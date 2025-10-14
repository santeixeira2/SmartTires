import React from "react";
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "./styles";
import Badge from "../../Common/Badge";

export interface TireData {
  id: number;
  pressure: number;
  temperature: number;
  connected: boolean;
  deviceId?: string;
}

export interface TireCardProps {
  tire: TireData;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const TireCard: React.FC<TireCardProps> = ({ tire, style, onPress }) => {
  const getConnectionStatus = () => {
    return tire.connected ? "Connected" : "Disconnected";
  };

  const getPressureStatus = () => {
    if (tire.pressure < 25 || tire.pressure > 40)
      return { status: "danger", color: "#F44336" };
    if (tire.pressure < 30 || tire.pressure > 35)
      return { status: "alert", color: "#FF9800" };
    return { status: "normal", color: "#000000" };
  };

  const getTemperatureStatus = () => {
    if (tire.temperature > 100) return { status: "danger", color: "#F44336" };
    if (tire.temperature > 90) return { status: "alert", color: "#FF9800" };
    return { status: "normal", color: "#000000" };
  };

  return (
    <TouchableOpacity 
      style={[styles.tireCard, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.tireHeader}>
          <Text style={styles.tireTitle}>Tire {tire.id}</Text>
          <Badge text={getConnectionStatus()} isConnected={tire.connected} />
        </View>
        <View style={styles.tireDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons
                name="speedometer-outline"
                size={18}
                color={getPressureStatus().color}
              />
              <Text
                style={[
                  styles.detailValue,
                  {
                    color: getPressureStatus().color,
                    ...(getPressureStatus().status !== "normal" && {
                      textShadowColor: getPressureStatus().color,
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 8,
                    }),
                  },
                ]}
              >
                {tire.pressure} PSI
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="thermometer-outline"
                size={18}
                color={getTemperatureStatus().color}
              />
              <Text
                style={[
                  styles.detailValue,
                  {
                    color: getTemperatureStatus().color,
                    ...(getTemperatureStatus().status !== "normal" && {
                      textShadowColor: getTemperatureStatus().color,
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 8,
                    }),
                  },
                ]}
              >
                {tire.temperature}°F
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Ionicons name="chevron-forward" size={20} color="#6c757d" />
      </View>
    </TouchableOpacity>
  );
};

export default TireCard;
