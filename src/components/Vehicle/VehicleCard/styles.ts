import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: 285,
    height: 254,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  headerText: {
    fontSize: 12,
    color: '#6c757d',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6c757d',
  },
});

export default styles;