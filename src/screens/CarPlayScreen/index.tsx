import React, { useEffect } from 'react';
import { CarPlay, ListTemplate, TabBarTemplate } from 'react-native-carplay';
import { useAppStore, VehicleThresholds } from '../../store/AppStore';
import { formatPressure, formatTemperature } from '../../utils/units';
import uuid from 'react-native-uuid';

const getTireCountFromAxle = (axleType: string): number => {
  const axleMap: { [key: string]: number } = {
    '1 Axle': 2,
    '2 Axles': 4,
    '2 Axles w/Dually': 6,
    '3 Axles': 6,
    '4 Axles': 8,
    '5 Axles': 10,
    '6 Axles': 12,
  };
  return axleMap[axleType] || 4;
};

const CarPlayScreen: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const [isCarPlayConnected, setIsCarPlayConnected] = React.useState(false);

  const createCarPlayTemplates = React.useCallback(() => {
    // Get current vehicle data from store
    const currentVehicle = state.vehiclesData?.find(v => v.id === state.selectedVehicleId) || state.vehiclesData?.[0];
    const vehicleName = currentVehicle?.name || 'Unknown Vehicle';
    const axleType = currentVehicle?.axleType || '2 Axles';
      
    const tireCount = getTireCountFromAxle(axleType);
    const tireItems = [];
    
    // Use actual tire data from store
    if (currentVehicle?.tireData && Object.keys(currentVehicle.tireData).length > 0) {
      const tireData = currentVehicle.tireData;
      const tireKeys = Object.keys(tireData);
      console.log('CarPlay: Using tire data from store:', tireData);
      
      tireKeys.forEach((tireId, index) => {
        const tire = tireData[tireId];
        // Standardize: store uses psi/temp, but ensure we read correctly
        const pressure = tire?.psi ?? tire?.pressure ?? 30;
        // Temperature is stored in Celsius (temp), convert to Fahrenheit for display
        const tempCelsius = tire?.temp ?? tire?.temperature ?? 20;
        const temperatureF = (tempCelsius * 9/5) + 32;
        
        // Use stored thresholds or fallback to defaults
        const thresholds: VehicleThresholds = currentVehicle?.thresholds || {
          pressureLow: 28,
          pressureWarning: 32,
          temperatureHigh: 160,
        };
        
        let status = 'Normal';
        if (pressure < thresholds.pressureLow || temperatureF > thresholds.temperatureHigh) {
          status = 'Low Pressure';
        } else if (pressure < thresholds.pressureWarning) {
          status = 'Low Pressure';
        } else if (pressure > 35) { // High pressure threshold can be added to VehicleThresholds if needed
          status = 'High Pressure';
        }
        
        // Map tire IDs to positions
        let position = 'Front';
        let side = 'Left';
        
        // Better tire position mapping based on tire ID
        if (tireId.includes('front')) {
          position = 'Front';
          side = tireId.includes('left') ? 'Left' : 'Right';
        } else if (tireId.includes('rear')) {
          position = 'Rear';
          side = tireId.includes('left') ? 'Left' : 'Right';
        } else if (tireId.includes('middle')) {
          position = 'Middle';
          side = tireId.includes('left') ? 'Left' : 'Right';
        } else {
          // Fallback to index-based
          if (tireCount === 2) {
            side = index === 0 ? 'Left' : 'Right';
            position = 'Rear';
          } else {
            side = index % 2 === 0 ? 'Left' : 'Right';
            position = index < tireCount / 2 ? 'Front' : 'Rear';
          }
        }
        
        tireItems.push({
          id: `tire-${tireId}`,
          text: `${position} ${side}`,
          detailText: `${formatPressure(pressure, state.units)} • ${formatTemperature(temperatureF, state.units)} • ${status}`
        });
      });
      
      // Fill in missing tires if we have fewer than expected
      if (tireItems.length < tireCount) {
        console.log(`CarPlay: Only ${tireItems.length} tires in data, expected ${tireCount}`);
      }
    } else {
      // NO FALLBACK - Show "No Data" if tire data not available
      console.warn('CarPlay: No tire data available for vehicle:', currentVehicle?.name);
      console.log('CarPlay: Current vehicle:', currentVehicle);
      console.log('CarPlay: Tire data exists?', !!currentVehicle?.tireData);
      console.log('CarPlay: Tire data keys:', currentVehicle?.tireData ? Object.keys(currentVehicle.tireData) : 'none');
      
      // Show "No Data" for all tires instead of generating fake values
      for (let i = 0; i < tireCount; i++) {
        const position = i < tireCount / 2 ? 'Front' : 'Rear';
        const side = i % 2 === 0 ? 'Left' : 'Right';
        
        tireItems.push({
          id: `tire-${i}`,
          text: `${position} ${side}`,
          detailText: `No Data • Waiting for sensor...`
        });
      }
    }

    // Create Smart Tire Overview template
    const smartTireTemplate = new ListTemplate({
      id: uuid.v4(),
      title: 'Tire Status',
      tabTitle: 'Tire Status',
      tabSystemImageName: 'car.fill',
      sections: [
        {
          header: 'Vehicle Monitor',
          items: [
            { 
              id: "layout-info", 
              text: `${vehicleName}`, 
              detailText: "Top-down tire view"
            }
          ]
        },
        {
          header: 'Tire Status',
          items: tireItems
        }
      ],
      onItemSelect: async ({ templateId, index }) => {
        console.log(`Selected tire overview item at index: ${index}`);
      }
    });

    const vehiclesTemplate = createVehicleListTemplate(state.vehiclesData || [], dispatch);
    
    const moreTemplate = new ListTemplate({
      id: uuid.v4(),
      title: 'More',
      tabTitle: 'More',
      tabSystemImageName: 'ellipsis.circle.fill',
      sections: [
        {
          header: 'Vehicle Management',
          items: [
            { 
              id: "vehicle-list", 
              text: "My Vehicles", 
              detailText: "Switch between vehicles"
            }
          ]
        },
        {
          header: 'Settings',
          items: [
            { 
              id: "units", 
              text: "Units", 
              detailText: "Imperial (PSI/°F)"
            },
            { 
              id: "notifications", 
              text: "Notifications", 
              detailText: "Tire alerts and warnings"
            },
            { 
              id: "dark-mode", 
              text: "Dark Mode", 
              detailText: "Use dark theme"
            }
          ]
        }
      ],
      onItemSelect: async ({ templateId, index }) => {
        const allItems = [
          { id: 'vehicle-list' },
          { id: 'units' },
          { id: 'notifications' },
          { id: 'dark-mode' }
        ];
        
        const selectedItem = allItems[index];
        if (!selectedItem) return;
        
        switch (selectedItem.id) {
          case 'vehicle-list':
            CarPlay.pushTemplate(createVehicleListTemplate(state.vehiclesData || [], dispatch));
            break;
          case 'units':
          case 'notifications':
          case 'dark-mode':
            // Settings items - could show detail views in the future
            console.log(`Selected setting: ${selectedItem.id}`);
            break;
        }
      }
    });

    const template: TabBarTemplate = new TabBarTemplate({
      id: uuid.v4(),
      title: "Smart Tire",
      templates: [
        smartTireTemplate,
        moreTemplate,
      ],
      onTemplateSelect() { },
    });

    CarPlay.setRootTemplate(template);
  }, [state.selectedVehicleId, state.vehiclesData, state.units, dispatch]);

  // Register CarPlay connect/disconnect handlers once
  useEffect(() => {
    CarPlay.registerOnConnect(() => {
      console.log("CarPlay connected");
      setIsCarPlayConnected(true);
    });

    CarPlay.registerOnDisconnect(() => {
      console.log('CarPlay disconnected');
      setIsCarPlayConnected(false);
    });
  }, []);

  // Create a serialized version of tire data to detect changes
  const tireDataHash = React.useMemo(() => {
    const hash = JSON.stringify(
      state.vehiclesData.map(v => ({
        id: v.id,
        tireData: v.tireData
      }))
    );
    console.log('CarPlay: tireDataHash computed:', hash.substring(0, 100));
    return hash;
  }, [state.vehiclesData]);

  // Update CarPlay templates whenever data changes (if CarPlay is connected)
  useEffect(() => {
    if (isCarPlayConnected) {
      console.log("CarPlay data changed - updating templates");
      console.log("Vehicles:", state.vehiclesData.length);
      console.log("Selected vehicle:", state.selectedVehicleId);
      const currentVehicle = state.vehiclesData.find(v => v.id === state.selectedVehicleId);
      console.log("Vehicle tire data:", currentVehicle?.tireData);
      console.log("Tire data hash:", tireDataHash.substring(0, 100));
      createCarPlayTemplates();
    }
  }, [state.selectedVehicleId, tireDataHash, state.units, isCarPlayConnected, createCarPlayTemplates]);

  return null; // CarPlay screen doesn't render anything visible
};

// Helper functions to create CarPlay templates
// NOTE: These helper functions are NOT USED - the main template is created in createCarPlayTemplates
// They are kept for reference but should read from store if ever used

const createVehicleListTemplate = (vehiclesData: any[], dispatch: any) => {
  const vehicleItems = vehiclesData.map(vehicle => {
    const tireCount = getTireCountFromAxle(vehicle.axleType);
    return {
      id: vehicle.id,
      text: vehicle.name,
      detailText: `Connected • ${vehicle.axleType} • ${tireCount} Tires`
    };
  });

  return new ListTemplate({
    id: uuid.v4(),
    title: 'My Vehicles',
    sections: [
      {
        header: 'Connected Vehicles',
        items: vehicleItems.length > 0 ? vehicleItems : [
          { 
            id: "no-vehicles", 
            text: "No Vehicles", 
            detailText: "Register vehicles to see them here"
          }
        ]
      }
    ],
    onItemSelect: async ({ templateId, index }) => {
      console.log(`Selected vehicle at index: ${index}`);
      
      if (vehicleItems.length > 0 && index < vehicleItems.length) {
        const selectedVehicle = vehicleItems[index];
        console.log(`Switching to vehicle: ${selectedVehicle.text}`);
        
        // Update the selected vehicle in the store
        dispatch({ type: 'SET_SELECTED_VEHICLE', payload: selectedVehicle.id });
        
        // Go back to the main tire status view and refresh
        CarPlay.popTemplate();
        // The useEffect will automatically recreate templates with new vehicle data
      }
    }
  });
};

const createSettingsTemplate = () =>
  new ListTemplate({
    id: uuid.v4(),
    title: 'Settings',
    sections: [
      {
        header: 'Units',
        items: [
          { 
            id: "units-imperial", 
            text: "Imperial", 
            detailText: "PSI, °F"
          },
          { 
            id: "units-metric", 
            text: "Metric", 
            detailText: "kPa, °C"
          }
        ]
      },
      {
        header: 'Notifications',
        items: [
          { 
            id: "notifications-on", 
            text: "Enable Notifications", 
            detailText: "Get alerts for tire issues"
          }
        ]
      }
    ],
    onItemSelect: async ({ templateId, index }) => {
      console.log(`Selected settings item at index: ${index}`);
    }
  });

// NOTE: createTireDetailTemplate is NOT USED - should read from store if ever implemented

export default CarPlayScreen;