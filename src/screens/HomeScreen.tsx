import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import Header from "../components/Common/Header";
import TruckTopDownView from "../components/Vehicle/TruckTopDownView";

const HomeScreen: React.FC<HomeScreenProps> = ({ frontLeft, frontRight, rearLeft, rearRight }) => {
  const tireData = {
    frontLeft: { psi: frontLeft.psi, temp: frontLeft.temp },
    frontRight: { psi: frontRight.psi, temp: frontRight.temp },
    rearLeft: { psi: rearLeft.psi, temp: rearLeft.temp },
    rearRight: { psi: rearRight.psi, temp: rearRight.temp },
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Smart Tire Overview" subtitle="Real-time Tire Monitoring" />

      <View style={styles.truckSectionContainer}>
        <Text style={styles.sectionTitle}>Tire Status Overview</Text>
        <View style={styles.svgContainer}>
          <TruckTopDownView 
            frontLeft={tireData.frontLeft}
            frontRight={tireData.frontRight}
            rearLeft={tireData.rearLeft}
            rearRight={tireData.rearRight}
          />
        </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 15,
    textAlign: 'center',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  truckSectionContainer: {
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
  truckContainer: {
    position: 'relative',
    width: 300,
    height: 400,
    alignItems: 'center',
  },
  truckImage: {
    width: '135%',
    height: '135%',
    top: -70,
    zIndex: 2,
  },
  tiresOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  tire: {
    position: 'absolute',
    width: 30,
    height: 50,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#333',
    zIndex: 1,
  },
  frontLeftTire: {
    top: 100,
    left: 60,
    zIndex: 1
  },
  frontRightTire: {
    top: 100,
    right: 60,
  },
  rearLeftTire: {
    bottom: 80,
    left: 60,
  },
  rearRightTire: {
    bottom: 80,
    right: 60,
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
});

export default HomeScreen; 