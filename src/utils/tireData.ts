/**
 * SINGLE SOURCE OF TRUTH for Tire Data
 * 
 * ALL tire pressure and temperature values MUST come from:
 * state.vehiclesData[vehicleId].tireData[tireId]
 * 
 * Format: { psi: number, temp: number }
 * - psi: Pressure in PSI
 * - temp: Temperature in Celsius
 */

import { AppState } from '../store/AppStore';

/**
 * Get tire data for a specific tire from the store
 * @param state - App state from useAppStore
 * @param vehicleId - Vehicle ID
 * @param tireId - Tire ID (e.g., 'front-left', 'rear-right')
 * @returns Tire data or null if not found
 */
export const getTireDataFromStore = (
  state: AppState,
  vehicleId: string | null,
  tireId: string
): { psi: number; temp: number } | null => {
  if (!vehicleId) {
    console.warn('getTireDataFromStore: No vehicleId provided');
    return null;
  }

  const vehicle = state.vehiclesData.find(v => v.id === vehicleId);
  if (!vehicle) {
    console.warn(`getTireDataFromStore: Vehicle ${vehicleId} not found`);
    return null;
  }

  if (!vehicle.tireData) {
    console.warn(`getTireDataFromStore: No tireData for vehicle ${vehicleId}`);
    return null;
  }

  const tireData = vehicle.tireData[tireId];
  if (!tireData) {
    console.warn(`getTireDataFromStore: No data for tire ${tireId} on vehicle ${vehicleId}`);
    return null;
  }

  return {
    psi: tireData.psi,
    temp: tireData.temp
  };
};

/**
 * Get all tire data for a vehicle from the store
 * @param state - App state from useAppStore
 * @param vehicleId - Vehicle ID
 * @returns Object with tire data or null if vehicle not found
 */
export const getAllTireDataFromStore = (
  state: AppState,
  vehicleId: string | null
): { [tireId: string]: { psi: number; temp: number } } | null => {
  if (!vehicleId) {
    return null;
  }

  const vehicle = state.vehiclesData.find(v => v.id === vehicleId);
  if (!vehicle || !vehicle.tireData) {
    return null;
  }

  return vehicle.tireData;
};

/**
 * Convert temperature from Celsius to Fahrenheit
 */
export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9/5) + 32;
};

/**
 * Convert temperature from Fahrenheit to Celsius
 */
export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return (fahrenheit - 32) * 5/9;
};

