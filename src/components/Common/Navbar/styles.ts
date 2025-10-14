import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    navbar: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e9ecef',
      paddingBottom: 10,
      paddingTop: 10,
      height: 80,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
    },
    activeTab: {
      backgroundColor: '#f8f9ff',
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: '#6c757d',
      marginTop: 4,
    },
    activeTabLabel: {
      color: '#007bff',
    },
  });

export default styles;