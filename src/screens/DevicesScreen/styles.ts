import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    placeholderContainer: {
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 40,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    placeholderEmoji: {
      fontSize: 64,
      marginBottom: 20,
    },
    placeholderTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    placeholderSubtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 20,
    },
    todoText: {
      fontSize: 14,
      color: '#007bff',
      fontWeight: '600',
      backgroundColor: '#f8f9fa',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
  });
  
export default styles;