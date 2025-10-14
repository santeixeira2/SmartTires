import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RegisterLayout from "./RegisterLayout";
import { RegisterSummaryProps } from "./RegisterForm.types";

const RegisterSummary: React.FC<RegisterSummaryProps> = ({
  onNext,
  onBack,
  isLoading,
  error,
  setupData,
}) => {
  const renderVehicleInfo = () => {
    const vehicleType = setupData.role === "power_unit" ? "Power Unit" : "Multi Vehicle";
    const vehicleName = setupData.vehicleName || "Not specified";
    const towingType = setupData.towingType || "Not specified";
    const axleType = setupData.axleTowingType || "Not specified";

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="car-outline" size={20} color="#007bff" />
          <Text style={styles.sectionTitle}>{vehicleType} Information</Text>
        </View>
        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Vehicle Name:</Text>
            <Text style={styles.infoValue}>{vehicleName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Towing Type:</Text>
            <Text style={styles.infoValue}>{towingType}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Axle Type:</Text>
            <Text style={styles.infoValue}>{axleType}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTowables = () => {
    if (!setupData.towables || setupData.towables.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="truck-outline" size={20} color="#007bff" />
          <Text style={styles.sectionTitle}>Towables ({setupData.towables.length})</Text>
        </View>
        <ScrollView style={styles.towablesList} showsVerticalScrollIndicator={false}>
          {setupData.towables.map((towable, index) => (
            <View key={towable.id} style={styles.towableItem}>
              <View style={styles.towableHeader}>
                <Text style={styles.towableName}>{towable.name}</Text>
                <Text style={styles.towableNumber}>#{index + 1}</Text>
              </View>
              <View style={styles.towableDetails}>
                <View style={styles.towableDetailItem}>
                  <Ionicons name="car-outline" size={16} color="#6c757d" />
                  <Text style={styles.towableDetailText}>{towable.type}</Text>
                </View>
                <View style={styles.towableDetailItem}>
                  <Ionicons name="settings-outline" size={16} color="#6c757d" />
                  <Text style={styles.towableDetailText}>{towable.axle}</Text>
                </View>
                <View style={styles.towableDetailItem}>
                  <Ionicons name="ellipse-outline" size={16} color="#6c757d" />
                  <Text style={styles.towableDetailText}>{towable.tireCount} tires</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSummaryStats = () => {
    const totalTires = setupData.towables?.reduce((sum, towable) => sum + towable.tireCount, 0) || 0;
    const vehicleTires = 4; // Assuming main vehicle has 4 tires
    const grandTotal = totalTires + vehicleTires;

    return (
      <View style={styles.statsSection}>
        <View style={styles.statsHeader}>
          <Ionicons name="analytics-outline" size={20} color="#28a745" />
          <Text style={styles.statsTitle}>Summary</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{setupData.towables?.length || 0}</Text>
            <Text style={styles.statLabel}>Towables</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalTires}</Text>
            <Text style={styles.statLabel}>Towable Tires</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{vehicleTires}</Text>
            <Text style={styles.statLabel}>Vehicle Tires</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.statValueTotal]}>{grandTotal}</Text>
            <Text style={styles.statLabel}>Total Tires</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <RegisterLayout
      onBack={onBack}
      title="Review & Sync"
      subtitle="Review your setup and sync with sensors"
      progressPercentage={75}
      progressText="Review Setup"
      footerButton={{
        label: "Sync Sensors",
        onPress: onNext,
        disabled: isLoading,
        loading: isLoading,
      }}
      isLoading={isLoading}
    >
      {renderVehicleInfo()}

      {renderTowables()}

      {renderSummaryStats()}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={16} color="#dc3545" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.infoNote}>
        <Ionicons name="information-circle-outline" size={20} color="#007bff" />
        <Text style={styles.infoNoteText}>
          Review the information above. Once you proceed, we'll help you sync your tire pressure sensors.
        </Text>
      </View>
    </RegisterLayout>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginLeft: 8,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#212529",
    fontWeight: "600",
  },
  towablesList: {
    maxHeight: 200,
  },
  towableItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  towableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  towableName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  towableNumber: {
    fontSize: 12,
    color: "#6c757d",
    backgroundColor: "#e9ecef",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  towableDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  towableDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  towableDetailText: {
    fontSize: 12,
    color: "#6c757d",
  },
  statsSection: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 4,
  },
  statValueTotal: {
    color: "#28a745",
  },
  statLabel: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
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
  infoNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  infoNoteText: {
    fontSize: 14,
    color: "#1976d2",
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default RegisterSummary;
