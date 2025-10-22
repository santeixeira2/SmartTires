import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      padding: 20,
    },
    vehicleContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    vehicleImage: {
      width: 120,
      height: 80,
      marginBottom: 8,
    },
    vehicleType: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
    },
    axleInfo: {
      fontSize: 14,
      color: '#666',
    },
    tireContainer: {
      position: 'relative',
      display: 'flex',
      width: 300,
      height: 200,
    },
    tire: {
      position: 'absolute',
      width: 50,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 7,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    tireLabel: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
    },
    tireData: {
      fontSize: 8,
      color: '#fff',
      textAlign: 'center',
    },
    truckContainer: {
      position: 'relative',
      width: 300,
      maxHeight: 300,
      alignItems: 'center',
      justifyContent: 'center',
    },
    truckImageContainer: {
      width: '100%',
      margin: 20,
      position: 'relative',
      zIndex: 3,
    },
    truckImage: {
      width: '100%',
    },
    tiresOverlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 1,
    },
    frontLeftTire: {
      top: 15,
      left: 70,
      zIndex: 2
    },
    frontRightTire: {
      top: 15,
      right: 70,
      zIndex: 2
    },
    rearLeftTire: {
      bottom: 35,
      left: 70,
      zIndex: 2
    },
    rearRightTire: {
      bottom: 35,
      right: 70,
      zIndex: 2
    },
  });

  export default styles;