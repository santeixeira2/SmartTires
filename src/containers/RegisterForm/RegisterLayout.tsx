import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface RegisterLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
  title: string;
  subtitle: string;
  progressPercentage: number;
  progressText: string;
  footerButton?: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  isLoading?: boolean;
}

const RegisterLayout: React.FC<RegisterLayoutProps> = ({
  children,
  onBack,
  title,
  subtitle,
  progressPercentage,
  progressText,
  footerButton,
  isLoading = false,
}) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#6c757d" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Ionicons name="car-sport" size={50} color="#007bff" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Sticky Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{progressText}</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>{children}</View>
      </ScrollView>

      {/* Footer */}
      {footerButton && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.footerButton,
              (footerButton.disabled || isLoading) && styles.footerButtonDisabled,
            ]}
            onPress={footerButton.onPress}
            disabled={footerButton.disabled || isLoading}
          >
            {footerButton.loading ? (
              <View style={styles.loadingContainer}>
                <Ionicons
                  name="reload"
                  size={20}
                  color="#fff"
                  style={styles.spinning}
                />
                <Text style={styles.footerButtonText}>Loading...</Text>
              </View>
            ) : (
              <Text style={styles.footerButtonText}>{footerButton.label}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  stickyHeader: {
    backgroundColor: "#f8f9fa",
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    zIndex: 1000,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 10,
    padding: 8,
    zIndex: 1,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  progressContainer: {
    marginBottom: 10,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e9ecef",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007bff",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  footer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  footerButton: {
    backgroundColor: "#007bff",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  footerButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  spinning: {
    marginRight: 8,
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default RegisterLayout;
