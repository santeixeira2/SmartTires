import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { DropdownOption } from "../../components/Common/Dropdown/types";
import TextBox from "../../components/Common/TextBox";
import RegisterLayout from "./RegisterLayout";
import Dropdown from "../../components/Common/Dropdown";
import { RegisterSetupProps } from "./RegisterForm.types";

const RegisterSetup: React.FC<RegisterSetupProps> = ({
  onComplete,
  onBack,
  isLoading,
  error,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    role: (initialData?.role || "power_unit") as "power_unit" | "multiple_units",
    vehicleName: initialData?.vehicleName || "",
    vehicleType: "",
    towingType: initialData?.towingType || "",
    towablesType: "",
    axleTowingType: initialData?.axleTowingType || "",
    vehicleTireCount: 4,
    towables: initialData?.towables || [] as Array<{
      id: string;
      name: string;
      type: string;
      axle: string;
      tireCount: number;
    }>,
  });

  const [showAddTowableModal, setShowAddTowableModal] = useState(false);
  const [newTowable, setNewTowable] = useState({
    name: "",
    type: "",
    axle: "",
    tireCount: 4,
  });

  // Power Unit towing type options
  const powerUnitTowingOptions: DropdownOption[] = [
    { label: "Towing Vehicles", value: "Towing Vehicles" },
    { label: "Motorhomes", value: "Motorhomes" },
  ];

  // Towables type options
  const towablesTypeOptions: DropdownOption[] = [
    { label: "Travel Trailers", value: "Travel Trailers" },
    { label: "Fifth Wheels", value: "Fifth Wheels" },
    { label: "Vehicle", value: "Vehicle" },
  ];

  // Dynamic axle options based on selection
  const getAxleOptions = (
    towingType: string,
    towablesType?: string
  ): DropdownOption[] => {
    // Both Power Unit and Multi Vehicles use the same axle options for main vehicle
    if (towingType === "Towing Vehicles") {
      return [
        { label: "2 Axles", value: "2 Axles" },
        { label: "2 Axles w/Dually Tires", value: "2 Axles w/Dually Tires" },
      ];
    } else if (towingType === "Motorhomes") {
      return [
        { label: "2 Axles w/Dually Tires", value: "2 Axles w/Dually Tires" },
        {
          label: "3 Axles with Dually Tires",
          value: "3 Axles with Dually Tires",
        },
      ];
    }

    // For towables in the modal (when adding individual towables)
    if (formData.role === "multiple_units" && towablesType) {
      if (towablesType === "Travel Trailers") {
        return [
          { label: "1 Axle", value: "1 Axle" },
          { label: "2 Axles", value: "2 Axles" },
        ];
      } else if (towablesType === "Fifth Wheels") {
        return [
          { label: "2 Axles", value: "2 Axles" },
          { label: "3 Axles", value: "3 Axles" },
        ];
      } else if (towablesType === "Vehicle") {
        return [
          { label: "2 Axles", value: "2 Axles" },
          { label: "2 Axles w/Dually Tires", value: "2 Axles w/Dually Tires" },
        ];
      }
    }

    return [];
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Clear dependent fields when parent selection changes
      if (field === "towingType") {
        newData.axleTowingType = "";
      } else if (field === "towablesType") {
        newData.axleTowingType = "";
      }

      return newData;
    });
  };

  // This function is no longer needed as we're using updateFormData directly

  const handleAddTowable = () => {
    if (!newTowable.name || !newTowable.type || !newTowable.axle) {
      Alert.alert("Error", "Please fill in all towable fields");
      return;
    }

    const towable = {
      id: `towable-${Date.now()}`,
      name: newTowable.name,
      type: newTowable.type,
      axle: newTowable.axle,
      tireCount: newTowable.tireCount,
    };

    setFormData((prev) => ({
      ...prev,
      towables: [...prev.towables, towable],
    }));

    // Reset form and close modal
    setNewTowable({
      name: "",
      type: "",
      axle: "",
      tireCount: 4,
    });
    setShowAddTowableModal(false);
  };

  const handleRemoveTowable = (towableId: string) => {
    setFormData((prev) => ({
      ...prev,
      towables: prev.towables.filter((towable: { id: string; }) => towable.id !== towableId),
    }));
  };

  const handleComplete = () => {
    // Validate based on role
    if (formData.role === "power_unit") {
      if (
        !formData.towingType ||
        !formData.axleTowingType ||
        !formData.vehicleName
      ) {
        Alert.alert(
          "Error",
          "Please fill in all required fields for Power Unit"
        );
        return;
      }
    } else {
      if (
        !formData.towingType ||
        !formData.axleTowingType ||
        !formData.vehicleName
      ) {
        Alert.alert(
          "Error",
          "Please fill in all required fields for Multi Vehicle"
        );
        return;
      }
      if (formData.towables.length === 0) {
        Alert.alert(
          "Error",
          "Please add at least one towable for Multi Vehicle setup"
        );
        return;
      }
    }

    onComplete(formData);
  };

  return (
    <>
      <RegisterLayout
        onBack={onBack}
        title="Account Setup"
        subtitle="Vehicle Setup - Power Unit & Towables Information"
        progressPercentage={50}
        progressText="Vehicle Setup"
        footerButton={{
          label: "Complete Registration",
          onPress: handleComplete,
          disabled: isLoading,
          loading: isLoading,
        }}
        isLoading={isLoading}
      >
      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Select your vehicle type</Text>
        <View style={styles.roleButtons}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              formData.role === "power_unit" && styles.roleButtonActive,
            ]}
            onPress={() => updateFormData("role", "power_unit")}
            disabled={isLoading}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={formData.role === "power_unit" ? "#fff" : "#6c757d"}
            />
            <Text
              style={[
                styles.roleButtonText,
                formData.role === "power_unit" &&
                  styles.roleButtonTextActive,
              ]}
            >
              Power Unit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              formData.role === "multiple_units" && styles.roleButtonActive,
            ]}
            onPress={() => updateFormData("role", "multiple_units")}
            disabled={isLoading}
          >
            <MaterialCommunityIcons
              name="truck-outline"
              size={20}
              color={
                formData.role === "multiple_units" ? "#fff" : "#6c757d"
              }
            />
            <Text
              style={[
                styles.roleButtonText,
                formData.role === "multiple_units" &&
                  styles.roleButtonTextActive,
              ]}
            >
              Multi Vehicles
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vehicle Type Selection */}
      <Dropdown
        options={powerUnitTowingOptions}
        selectedValue={formData.towingType || ""}
        onSelect={(value: string) => updateFormData("towingType", value)}
        placeholder={
          formData.role === "power_unit"
            ? "Select your Power Unit's towing type *"
            : "Select your Multi Vehicle's towing type *"
        }
        disabled={isLoading}
        icon="car-outline"
      />
      <Dropdown
        options={getAxleOptions(formData.towingType || "")}
        selectedValue={formData.axleTowingType || ""}
        onSelect={(value: string) => updateFormData("axleTowingType", value)}
        placeholder={
          formData.role === "power_unit"
            ? "Select your Power Unit's axle type *"
            : "Select your Multi Vehicle's axle type *"
        }
        disabled={isLoading || !formData.towingType}
        icon="time-outline"
      />
      <TextBox
        placeholder={
          formData.role === "power_unit"
            ? "Power Unit Name"
            : "Towables Name"
        }
        value={formData.vehicleName || ""}
        onChangeText={(value: string) => updateFormData("vehicleName", value)}
        icon="car-outline"
        editable={!isLoading}
      />

      {/* Towables Section */}
      {formData.role === "multiple_units" && (
        <View style={styles.towablesSection}>
          <View style={styles.towablesHeader}>
            <Text style={styles.towablesTitle}>Towables</Text>
            <TouchableOpacity
              style={styles.addTowableButton}
              onPress={() => setShowAddTowableModal(true)}
              disabled={isLoading}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addTowableButtonText}>Add Towable</Text>
            </TouchableOpacity>
          </View>

          {formData.towables.length > 0 &&
            formData.towables.map((towable: { id: string; name: string; type: string; axle: string; }) => (
              <View key={towable.id} style={styles.towableItem}>
                <View style={styles.towableInfo}>
                  <Text style={styles.towableText}>
                    {towable.name} - {towable.type} ({towable.axle})
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeTowableButton}
                  onPress={() => handleRemoveTowable(towable.id)}
                  disabled={isLoading}
                >
                  <Text style={styles.removeTowableButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}

          {formData.towables.length === 0 &&
            formData.role === "multiple_units" && (
              <Text style={styles.towableText}>No towables added yet</Text>
            )}
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={16} color="#dc3545" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      </RegisterLayout>

      {/* Add Towable Modal */}
      <Modal
        visible={showAddTowableModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddTowableModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Towable</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddTowableModal(false)}
              >
                <Ionicons name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextBox
                placeholder="Towable Name"
                value={newTowable.name}
                onChangeText={(value: string) =>
                  setNewTowable((prev) => ({ ...prev, name: value }))
                }
                icon="car-outline"
                editable={!isLoading}
              />

              <Dropdown
                options={towablesTypeOptions}
                selectedValue={newTowable.type}
                onSelect={(value: string) =>
                  setNewTowable((prev) => ({ ...prev, type: value }))
                }
                placeholder="Select Towable Type *"
                disabled={isLoading}
                icon="car-outline"
              />

              <Dropdown
                options={getAxleOptions("", newTowable.type)}
                selectedValue={newTowable.axle}
                onSelect={(value: string) =>
                  setNewTowable((prev) => ({ ...prev, axle: value }))
                }
                placeholder="Select Axle Type *"
                disabled={isLoading || !newTowable.type}
                icon="time-outline"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddTowableModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddTowable}
                disabled={isLoading}
              >
                <Text style={styles.addButtonText}>Add Towable</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#495057",
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  roleButtonActive: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6c757d",
    marginLeft: 8,
  },
  roleButtonTextActive: {
    color: "#fff",
  },
  towablesSection: {
    marginBottom: 16,
  },
  towablesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  towablesTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#495057",
  },
  addTowableButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34A853",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addTowableButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  towableItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  towableInfo: {
    flex: 1,
  },
  towableText: {
    fontSize: 14,
    color: "#495057",
  },
  removeTowableButton: {
    backgroundColor: "#dc3545",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  removeTowableButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#721c24",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    minHeight: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  modalBody: {
    padding: 20,
    maxHeight: 300,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  cancelButtonText: {
    color: "#6c757d",
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegisterSetup;
    