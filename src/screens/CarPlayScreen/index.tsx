import React, { useEffect } from 'react';
import { CarPlay, ListTemplate, TabBarTemplate } from 'react-native-carplay';
import { useAppStore } from '../../store/AppStore';
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

  useEffect(() => {
    CarPlay.registerOnConnect(() => {
      console.log("CarPlay connected");
      createCarPlayTemplates();
    });

    CarPlay.registerOnDisconnect(() => {
      console.log('CarPlay disconnected');
    });
  }, [state.selectedVehicleId, state.vehiclesData]);

  const createCarPlayTemplates = () => {
    // Get current vehicle data from store
    const currentVehicle = state.vehiclesData?.find(v => v.id === state.selectedVehicleId) || state.vehiclesData?.[0];
    const vehicleName = currentVehicle?.name || 'Unknown Vehicle';
    const axleType = currentVehicle?.axleType || '2 Axles';
      
    const tireCount = getTireCountFromAxle(axleType);
    const tireItems = [];
    
    // Use actual tire data from store
    if (currentVehicle?.tireData) {
      const tireData = currentVehicle.tireData;
      const tireKeys = Object.keys(tireData);
      tireKeys.forEach((tireId, index) => {
        const tire = tireData[tireId];
        const pressure = tire.psi || tire.pressure || 30;
        const temperature = tire.temp || tire.temperature || 20;
        const status = pressure < 28 ? 'Low Pressure' : pressure > 35 ? 'High Pressure' : 'Normal';
        
        let position = 'Front';
        let side = 'Left';
        if (tireCount === 2) {
          side = index === 0 ? 'Left' : 'Right';
          position = 'Rear';
        } else {
          side = index % 2 === 0 ? 'Left' : 'Right';
          position = index < tireCount / 2 ? 'Front' : 'Rear';
        }
        
          tireItems.push({
            id: `tire-${tireId}`,
            text: `${position} ${side}`,
            detailText: `${formatPressure(pressure, state.units)} • ${formatTemperature((temperature * 9/5) + 32, state.units)} • ${status}`
          });
      });
    } else {
      // Fallback to generated data if no tire data available
      for (let i = 0; i < tireCount; i++) {
        const pressure = 30 + Math.random() * 5;
        const temperature = 20 + Math.random() * 10;
        const status = pressure < 28 ? 'Low Pressure' : pressure > 35 ? 'High Pressure' : 'Normal';
        const position = i < tireCount / 2 ? 'Front' : 'Rear';
        const side = i % 2 === 0 ? 'Left' : 'Right';
        
          tireItems.push({
            id: `tire-${i}`,
            text: `${position} ${side}`,
            detailText: `${formatPressure(pressure, state.units)} • ${formatTemperature((temperature * 9/5) + 32, state.units)} • ${status}`
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
  };

  return null; // CarPlay screen doesn't render anything visible
};

// Helper functions to create CarPlay templates
const createTireOverviewTemplate = (currentVehicle: any) => {
  const sections = [
    {
      header: 'Vehicle Layout',
      items: [
        { 
          id: "layout-info", 
          text: `🚗 ${currentVehicle?.name || 'Vehicle'}`, 
          detailText: "Top-down tire view"
        }
      ]
    }
  ];

  const tireCount = getTireCountFromAxle(currentVehicle?.axleType || '2 Axles');
  const tireItems = [];
  
  for (let i = 0; i < tireCount; i++) {
    const pressure = 30 + Math.random() * 5;
    const temperature = 20 + Math.random() * 10;
    const status = pressure < 28 ? 'Low Pressure' : pressure > 35 ? 'High Pressure' : 'Normal';
    const position = i < tireCount / 2 ? 'Front' : 'Rear';
    const side = i % 2 === 0 ? 'Left' : 'Right';
    
    tireItems.push({
      id: `tire-${i}`,
      text: `${position} ${side} Tire`,
      detailText: `${pressure.toFixed(1)} PSI • ${((temperature * 9/5) + 32).toFixed(1)}°F • ${status}`
    });
  }

  sections.push({
    header: 'Tire Status',
    items: tireItems
  });

  sections.push({
    header: 'Status Legend',
    items: [
      { 
        id: "legend-normal", 
        text: "🟢 Normal", 
        detailText: "All systems operating normally"
      },
      { 
        id: "legend-warning", 
        text: "🟡 Warning", 
        detailText: "Monitor closely"
      },
      { 
        id: "legend-critical", 
        text: "🔴 Critical", 
        detailText: "Immediate attention required"
      }
    ]
  });

  return new ListTemplate({
    id: uuid.v4(),
    title: 'Tire Status',
    sections: sections,
    onItemSelect: async ({ templateId, index }) => {
      console.log(`Selected tire overview item at index: ${index}`);
    }
  });
};

const createDetailedStatusTemplate = (vehiclesData: any[], selectedVehicleId?: string) => {
  const currentVehicle = vehiclesData.find(v => v.id === selectedVehicleId) || vehiclesData[0];
  const tireCount = getTireCountFromAxle(currentVehicle?.axleType || '2 Axles');
  
  const tireItems = [];
  for (let i = 0; i < tireCount; i++) {
    const pressure = 30 + Math.random() * 5;
    const temperature = 68 + Math.random() * 10;
    const status = pressure < 74 ? 'Low Pressure' : pressure > 100 ? 'High Pressure' : 'Normal';
    const position = i < tireCount / 2 ? 'Front' : 'Rear';
    const side = i % 2 === 0 ? 'Left' : 'Right';
    
    tireItems.push({
      id: `tire-detail-${i}`,
      text: `${position} ${side} Tire`,
      detailText: `${pressure.toFixed(1)} PSI • ${temperature.toFixed(1)}°F • ${status}`
    });
  }

  return new ListTemplate({
    id: uuid.v4(),
    title: 'Detailed Status',
    sections: [
      {
        header: 'Vehicle Information',
        items: [
          { 
            id: "vehicle-info", 
            text: currentVehicle?.name || 'Unknown Vehicle', 
            detailText: `${currentVehicle?.axleType || '2 Axles'} • ${tireCount} Tires`
          }
        ]
      },
      {
        header: 'Tire Details',
        items: tireItems
      }
    ],
    onItemSelect: async ({ templateId, index }) => {
      console.log(`Selected detailed tire at index: ${index}`);
    }
  });
};

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

const createTireDetailTemplate = (tireId: string, vehicleData: any) => {
  const pressure = 30 + Math.random() * 5;
  const temperature = 20 + Math.random() * 10;
  const status = pressure < 28 ? 'Low Pressure' : pressure > 35 ? 'High Pressure' : 'Normal';

  return new ListTemplate({
    id: uuid.v4(),
    title: `Tire ${tireId}`,
    sections: [
      {
        header: 'Current Status',
        items: [
          { 
            id: "pressure", 
            text: "Pressure", 
            detailText: `${pressure.toFixed(1)} PSI`
          },
          { 
            id: "temperature", 
            text: "Temperature", 
            detailText: `${((temperature * 9/5) + 32).toFixed(1)}°F`
          },
          { 
            id: "status", 
            text: "Status", 
            detailText: status
          }
        ]
      }
    ],
    onItemSelect: async ({ templateId, index }) => {
      console.log(`Selected tire detail item at index: ${index}`);
    }
  });
};

export default CarPlayScreen;