import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Header from '../../components/Common/Header';
import TireCard, { TireData } from '../../components/Vehicle/TireCard';
import VehicleCard, { VehicleData } from '../../components/Vehicle/VehicleCard';
import vehiclesData from '../../data/vehicles.json';
import styles from './styles';

const DetailedStatusScreen = () => {
  const [tires, setTires] = useState<TireData[]>([
    { id: 1, pressure: 32, temperature: 25, connected: true, deviceId: '1234567890' },
    { id: 2, pressure: 31, temperature: 26, connected: true, deviceId: '1234567890' },
    { id: 3, pressure: 28, temperature: 30, connected: true, deviceId: '1234567890' },
    { id: 4, pressure: 29, temperature: 28, connected: true, deviceId: '1234567890' },
  ]);
  const [vehicles, setVehicles] = useState<VehicleData[]>(vehiclesData as VehicleData[]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTires((prev) => {
        return prev.map((tire) => {
          if (!tire.connected) {
            const updatedTirePressure = Math.random() * (40 - 25) + 25;
            const updatedTireTemperature = Math.random() * (100 - 90) + 90;
            return {
              ...tire,
              pressure: parseFloat((tire.pressure + updatedTirePressure).toFixed(1)),
              temperature: parseFloat((tire.temperature + updatedTireTemperature).toFixed(1)),
              connected: true,
            }
          }
          return tire;
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Header title="Smart Tire Detailed Status" subtitle="Comprehensive tire monitoring" />
      
      {/* Vehicles Section */}
      <View style={styles.vehiclesSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vehiclesContainer}
        >
          {vehicles.map((vehicle) => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle}
              onPress={() => console.log('Vehicle pressed:', vehicle.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Tire Details</Text>
        {tires.map((tire) => (
          <TireCard key={tire.id} tire={tire} />
        ))}
      </View>
    </ScrollView>
  );
};

export default DetailedStatusScreen;