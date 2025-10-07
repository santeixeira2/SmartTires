import { StyleSheet } from 'react-native';

const textBoxStyles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      color: "#212529",
      marginBottom: 6,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e9ecef",
      paddingHorizontal: 16,
      height: 52,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: "#212529",
      padding: 0,
    },
    passwordToggle: {
      marginLeft: 12,
    },
  });

export default textBoxStyles;