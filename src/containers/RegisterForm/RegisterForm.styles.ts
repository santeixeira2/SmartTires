import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  devNav: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 8,
    zIndex: 1000,
  },
  devToggle: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 8,
  },
  devToggleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  devButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  devButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  devButtonActive: {
    backgroundColor: '#28a745',
  },
  devButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default styles;