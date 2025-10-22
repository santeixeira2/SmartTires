import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, TouchableOpacity } from "react-native";
import Header from "../components/Common/Header";
import TruckTopDownView from "../components/Vehicle/TruckTopDownView";
import { useAppStore } from "../store/AppStore";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 80;

interface HomeScreenProps {
  frontLeft?: { psi: number; temp: number };
  frontRight?: { psi: number; temp: number };
  rearLeft?: { psi: number; temp: number };
  rearRight?: { psi: number; temp: number };
  onNavigateToDetailed?: (tireId: string, vehicleName: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ frontLeft, frontRight, rearLeft, rearRight, onNavigateToDetailed }) => {
  const { state } = useAppStore();
  
  // Use vehicles from store if available, otherwise fallback to empty array
  const vehicles = state.vehiclesData.length > 0 ? state.vehiclesData : [];
  
  // If no vehicles, show a message
  if (vehicles.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <Header title="Smart Tire Overview" subtitle="Real-time Tire Monitoring" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No vehicles registered yet</Text>
          <Text style={styles.emptyStateSubtext}>Complete the registration process to see your vehicles here</Text>
        </View>
      </ScrollView>
    );
  }

  const handleTirePress = (tireId: string, vehicleName: string) => {
    console.log(`🔥 HomeScreen - Tire pressed: ${tireId} on ${vehicleName}`);
    console.log(`🔥 HomeScreen - onNavigateToDetailed function:`, onNavigateToDetailed);
    if (onNavigateToDetailed) {
      console.log(`🔥 HomeScreen - Calling onNavigateToDetailed...`);
      onNavigateToDetailed(tireId, vehicleName);
    } else {
      console.log(`🔥 HomeScreen - onNavigateToDetailed is null/undefined`);
      Alert.alert('Tire Selected', `You selected ${tireId} tire on ${vehicleName}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Smart Tire Overview" subtitle="Real-time Tire Monitoring" />

      <View style={styles.overviewSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vehiclesScrollContainer}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
        >
          {vehicles.map((vehicle) => (
            <View key={vehicle.id} style={[styles.vehicleCard, { width: CARD_WIDTH }]}>
              <View style={styles.vehicleHeader}>
                <Text style={styles.vehicleName}>{vehicle.name}</Text>
                <Text style={styles.vehicleSubtext}>
                  {vehicle.towingType === 'towing' ? ('Towing').toUpperCase() : ('Towable').toUpperCase()} • {vehicle.axleType}
                </Text>
              </View>
              <View style={styles.svgContainer}>
                <TruckTopDownView 
                  frontLeft={vehicle.tireData?.frontLeft || { psi: 32, temp: 25 }}
                  frontRight={vehicle.tireData?.frontRight || { psi: 31, temp: 26 }}
                  rearLeft={vehicle.tireData?.rearLeft || { psi: 28, temp: 30 }}
                  rearRight={vehicle.tireData?.rearRight || { psi: 29, temp: 28 }}
                  onTirePress={(tireId) => handleTirePress(tireId, vehicle.name)}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.sectionTitle}>Status Legend</Text>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
            <Text style={styles.legendText}>Normal</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'orange' }]} />
            <Text style={styles.legendText}>Low Pressure</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
            <Text style={styles.legendText}>Danger</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  overviewSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
    marginLeft: 16,
  },
  vehiclesScrollContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    gap: 16,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  vehicleHeader: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  vehicleSubtext: {
    fontSize: 14,
    color: '#6c757d',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  statusContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#495057',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen; 