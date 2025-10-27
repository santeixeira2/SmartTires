// Unit conversion utilities
export const convertPressure = (psi: number, units: 'imperial' | 'metric'): number => {
  if (units === 'metric') {
    // Convert PSI to kPa: 1 PSI = 6.89476 kPa
    return psi * 6.89476;
  }
  return psi; // Return PSI for imperial
};

export const convertTemperature = (fahrenheit: number, units: 'imperial' | 'metric'): number => {
  if (units === 'metric') {
    // Convert Fahrenheit to Celsius: °C = (°F - 32) × 5/9
    return (fahrenheit - 32) * 5/9;
  }
  return fahrenheit; // Return Fahrenheit for imperial
};

export const getPressureUnit = (units: 'imperial' | 'metric'): string => {
  return units === 'imperial' ? 'PSI' : 'kPa';
};

export const getTemperatureUnit = (units: 'imperial' | 'metric'): string => {
  return units === 'imperial' ? '°F' : '°C';
};

export const formatPressure = (psi: number, units: 'imperial' | 'metric'): string => {
  const value = convertPressure(psi, units);
  const unit = getPressureUnit(units);
  return `${value.toFixed(1)} ${unit}`;
};

export const formatTemperature = (fahrenheit: number, units: 'imperial' | 'metric'): string => {
  const value = convertTemperature(fahrenheit, units);
  const unit = getTemperatureUnit(units);
  return `${value.toFixed(1)}${unit}`;
};

