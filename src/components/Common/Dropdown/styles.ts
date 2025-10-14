import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    inputIcon: {
      marginRight: 12,
    },
    dropdown: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#e9ecef",
      paddingHorizontal: 16,
      height: 56,
      justifyContent: "space-between",
      marginBottom: 16,
    },
    dropdownDisabled: {
      backgroundColor: "#f8f9fa",
      borderColor: "#dee2e6",
    },
    dropdownContent: {
      flex: 1,
    },
    dropdownText: {
      fontSize: 16,
      color: "#212529",
    },
    placeholderText: {
      color: "#6c757d",
    },
    subtitleText: {
      fontSize: 12,
      color: "#6c757d",
      marginTop: 2,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "70%",
      minHeight: 200,
      paddingBottom: 36,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#e9ecef",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#212529",
    },
    closeButton: {
      padding: 4,
    },
    optionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f8f9fa",
    },
    selectedOption: {
      backgroundColor: "#f8f9ff",
    },
    optionContent: {
      flex: 1,
    },
    optionText: {
      fontSize: 16,
      color: "#495057",
      fontWeight: "500",
    },
    selectedOptionText: {
      color: "#007bff",
    },
    optionSubtitle: {
      fontSize: 14,
      color: "#6c757d",
      marginTop: 2,
    },
    selectedOptionSubtitle: {
      color: "#007bff",
    },
  });

export default styles;