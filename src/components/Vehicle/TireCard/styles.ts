import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
    },
    content: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2C3E50',
      textAlign: 'center',
    },
    tireCard: {
      paddingBottom: 12,
      marginBottom: 18,
      borderBottomWidth: 2,
      borderColor: '#e9ecef',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardContent: {
      flex: 1,
    },
    tireHeader: {
      flexDirection: 'row',
      gap: 16,
      alignItems: 'center',
      marginBottom: 15,
    },
    tireTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2C3E50',
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      minWidth: 100,
    },
    statusBadgeText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    tireDetails: {
      gap: 10,
    },
    detailRow: {
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
      paddingVertical: 5,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      marginLeft: 16,
      backgroundColor: '#e9ecef',
      borderRadius: 30,
    },
    detailLabel: {
      fontSize: 12,
      color: '#6c757d',
    },
    detailValue: {
      fontSize: 14,
      color: '#2C3E50',
    },
  });

  export default styles;