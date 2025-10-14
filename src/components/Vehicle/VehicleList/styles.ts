import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#e9ecef",
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: "#212529",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: "#6c757d",
      marginBottom: 16,
    },
    vehicleItem: {
      backgroundColor: "#f8f9fa",
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#e9ecef",
    },
    vehicleHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    vehicleIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#e3f2fd",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    vehicleInfo: {
      flex: 1,
    },
    vehicleName: {
      fontSize: 16,
      fontWeight: "600",
      color: "#212529",
      marginBottom: 2,
    },
    vehicleType: {
      fontSize: 14,
      color: "#6c757d",
    },
    vehicleStats: {
      flexDirection: "row",
      alignItems: "center",
    },
    vehicleTireCount: {
      fontSize: 12,
      color: "#6c757d",
      marginRight: 8,
    },
    vehicleDetails: {
      flexDirection: "row",
      gap: 16,
    },
    vehicleDetailItem: {
      flex: 1,
    },
    vehicleDetailLabel: {
      fontSize: 12,
      color: "#6c757d",
      marginBottom: 2,
    },
    vehicleDetailValue: {
      fontSize: 12,
      color: "#212529",
      fontWeight: "500",
    },
  });
  
  export default styles;
  