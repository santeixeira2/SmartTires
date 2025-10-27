import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';

export interface RegistrationData {
  user: {
    name: string;
    email: string;
    role: 'power_unit' | 'multiple_units';
    registrationDate: string;
  };
  vehicle: {
    name: string;
    type: string;
    axleType: string;
    role: 'power_unit' | 'multiple_units';
  };
  towables: Array<{
    id: string;
    name: string;
    type: string;
    axle: string;
    tireCount: number;
  }>;
  syncedVehicles: {[key: string]: boolean};
  vehicleSensorIds: {[key: string]: {[key: string]: string}};
  syncStatus: {
    totalVehicles: number;
    syncedCount: number;
    allSynced: boolean;
  };
  metadata: {
    registrationStep: string;
    timestamp: string;
    version: string;
  };
}

export interface AppState {
  registrationData: RegistrationData | null;
  isDemoUser: boolean;
  vehiclesData: any[];
  selectedVehicleId: string | null;
  isLoading: boolean;
  isDarkMode: boolean;
  units: 'imperial' | 'metric';
}

type AppAction =
  | { type: 'SET_REGISTRATION_DATA'; payload: RegistrationData }
  | { type: 'SET_DEMO_USER'; payload: boolean }
  | { type: 'SET_VEHICLES_DATA'; payload: any[] }
  | { type: 'SET_SELECTED_VEHICLE'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ALL_DATA' }
  | { type: 'UPDATE_SYNCED_VEHICLES'; payload: {[key: string]: boolean} }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_UNITS'; payload: 'imperial' | 'metric' };

const initialState: AppState = {
  registrationData: null,
  isDemoUser: false,
  vehiclesData: [],
  selectedVehicleId: null,
  isLoading: false,
  isDarkMode: false,
  units: 'imperial',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_REGISTRATION_DATA':
      return {
        ...state,
        registrationData: action.payload,
      };
    case 'SET_DEMO_USER':
      return {
        ...state,
        isDemoUser: action.payload,
      };
    case 'SET_VEHICLES_DATA':
      return {
        ...state,
        vehiclesData: action.payload,
      };
    case 'SET_SELECTED_VEHICLE':
      return {
        ...state,
        selectedVehicleId: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'CLEAR_ALL_DATA':
      return {
        ...initialState,
      };
    case 'UPDATE_SYNCED_VEHICLES':
      return {
        ...state,
        registrationData: state.registrationData ? {
          ...state.registrationData,
          syncedVehicles: action.payload,
          syncStatus: {
            totalVehicles: Object.keys(action.payload).length,
            syncedCount: Object.values(action.payload).filter(Boolean).length,
            allSynced: Object.values(action.payload).every(Boolean),
          }
        } : null,
      };
    case 'SET_DARK_MODE':
      return {
        ...state,
        isDarkMode: action.payload,
      };
    case 'SET_UNITS':
      return {
        ...state,
        units: action.payload,
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};

// Helper functions for common operations
export const useAppActions = () => {
  const { dispatch } = useAppStore();

  const setRegistrationData = useCallback((data: RegistrationData) => {
    dispatch({ type: 'SET_REGISTRATION_DATA', payload: data });
  }, [dispatch]);
  
  const setDemoUser = useCallback((isDemo: boolean) => {
    dispatch({ type: 'SET_DEMO_USER', payload: isDemo });
  }, [dispatch]);
  
  const setVehiclesData = useCallback((vehicles: any[]) => {
    dispatch({ type: 'SET_VEHICLES_DATA', payload: vehicles });
  }, [dispatch]);
  
  const setSelectedVehicle = useCallback((vehicleId: string | null) => {
    dispatch({ type: 'SET_SELECTED_VEHICLE', payload: vehicleId });
  }, [dispatch]);
  
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [dispatch]);
  
  const clearAllData = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
  }, [dispatch]);
  
  const updateSyncedVehicles = useCallback((syncedVehicles: {[key: string]: boolean}) => {
    dispatch({ type: 'UPDATE_SYNCED_VEHICLES', payload: syncedVehicles });
  }, [dispatch]);

  return {
    setRegistrationData,
    setDemoUser,
    setVehiclesData,
    setSelectedVehicle,
    setLoading,
    clearAllData,
    updateSyncedVehicles,
  };
};
