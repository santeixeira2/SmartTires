import React, { useEffect } from 'react';
import { CarPlay, ListTemplate, MapTemplate, MapTemplateConfig, TabBarTemplate } from "react-native-carplay";
import uuid from 'react-native-uuid';
import { View, Image } from 'react-native';
import { useAppStore } from '../../store/AppStore';

// Helper function to get tire count from axle type
const getTireCountFromAxle = (axleType: string): number => {
  const axleMap: {[key: string]: number} = {
    '1 Axle': 2,
    '2 Axles': 4,
    '3 Axles': 6,
    '4 Axles': 8,
    '5 Axles': 10,
    '6 Axles': 12,
  };
  return axleMap[axleType] || 4;
};

const CarPlayScreen: React.FC = () => {
  const { state } = useAppStore();

  useEffect(() => {
    CarPlay.registerOnConnect(() => {
      console.log("CarPlay connected");

      // Get current vehicle data from store
      const currentVehicle = state.vehiclesData?.find(v => v.id === state.selectedVehicleId) || state.vehiclesData?.[0];
      const vehicleName = currentVehicle?.name || 'Unknown Vehicle';
      const axleType = currentVehicle?.axleType || '2 Axles';
      
      const tireCount = getTireCountFromAxle(axleType);
      const tireItems = [];
      
      // Generate tire data similar to DetailedStatusScreen
      for (let i = 0; i < tireCount; i++) {
        const pressure = 30 + Math.random() * 5; // Random pressure between 30-35
        const temperature = 20 + Math.random() * 10; // Random temperature between 20-30
        const status = pressure < 28 ? 'Low Pressure' : pressure > 35 ? 'High Pressure' : 'Normal';
        const position = i < tireCount / 2 ? 'Front' : 'Rear';
        const side = i % 2 === 0 ? 'Left' : 'Right';
        
        tireItems.push({
          id: `tire-${i}`,
          text: `${position} ${side}`,
          detailText: `${pressure.toFixed(1)} PSI • ${temperature.toFixed(1)}°C • ${status}`
        });
      }

      // Create Smart Tire Overview template
      const smartTireTemplate = new ListTemplate({
        id: uuid.v4(),
        title: 'Smart Tire Overview',
        tabTitle: 'Tire Status',
        tabSystemImageName: 'car.fill',
        sections: [
          {
            header: 'Current Vehicle',
            items: [
              { 
                id: "vehicle-info", 
                text: vehicleName, 
                detailText: `Connected • ${axleType} • ${tireCount} Tires`
              }
            ]
          },
          {
            header: "Tire Status",
            items: tireItems
          },
          {
            header: "Quick Actions",
            items: [
              { 
                id: "detailed-view", 
                text: "Detailed Status", 
                detailText: "View comprehensive tire data"
              },
              { 
                id: "vehicle-list", 
                text: "My Vehicles", 
                detailText: "Switch between vehicles"
              },
              { 
                id: "settings", 
                text: "Settings", 
                detailText: "Configure tire monitoring"
              }
            ]
          }
        ],
        onItemSelect: async ({ templateId, index }) => {
          console.debug(`CarPlay item selected at index: ${index}`);
          
          // Get the item based on index
          const allItems = [
            { id: 'vehicle-info' },
            { id: 'front-left' },
            { id: 'front-right' },
            { id: 'rear-left' },
            { id: 'rear-right' },
            { id: 'tire-overview' },
            { id: 'detailed-view' },
            { id: 'vehicle-list' },
            { id: 'settings' }
          ];
          
          const selectedItem = allItems[index];
          if (!selectedItem) return;
          
          switch (selectedItem.id) {
            case 'tire-overview':
              CarPlay.pushTemplate(createTireOverviewTemplate());
              break;
            case 'detailed-view':
              CarPlay.pushTemplate(
                createDetailedStatusTemplate(
                  state.vehiclesData || [],
                  state.selectedVehicleId ?? undefined // Fixes possible null assignment
                )
              );
              break;
            case 'vehicle-list':
              CarPlay.pushTemplate(createVehicleListTemplate(state.vehiclesData || []));
              break;
            case 'settings':
              CarPlay.pushTemplate(createSettingsTemplate());
              break;
            case 'front-left':
            case 'front-right':
            case 'rear-left':
            case 'rear-right':
              CarPlay.pushTemplate(createTireDetailTemplate(selectedItem.id));
              break;
            default:
              console.log(`Selected item: ${selectedItem.id}`);
          }
        },
      });

      const mapTemplate = new ListTemplate({
        id: uuid.v4(),
        tabTitle: "Map",
        tabSystemImageName: 'map.fill',
        sections: [
          {
            header: "Navigation",
            items: [
              { 
                id: "show-map", 
                text: "Show Map", 
                detailText: "Open navigation view"
              }
            ]
          }
        ],
        onItemSelect: async ({ templateId, index }) => {
          if (index === 0) {
            showMapTemplate();
          }
        }
      });

      const template: TabBarTemplate = new TabBarTemplate({
        id: uuid.v4(),
        title: "Smart Tire",
        templates: [
          smartTireTemplate,
          mapTemplate,
        ],
        onTemplateSelect() { },
      });

      CarPlay.setRootTemplate(template);
    });

    CarPlay.registerOnDisconnect(() => {
      console.log('CarPlay disconnected');
    });
  }, []);

  return null; // CarPlay screen doesn't render anything visible
};

// Helper functions to create CarPlay templates
const createTireOverviewTemplate = () =>
  new ListTemplate({
    id: uuid.v4(),
    title: 'Tire Overview',
    sections: [
      {
        header: 'Vehicle Layout',
        items: [
          { 
            id: "layout-info", 
            text: "🚗 Ford Ranger", 
            detailText: "Top-down tire view"
          }
        ]
      },
      {
        header: 'Front Tires',
        items: [
          { 
            id: "front-left-overview", 
            text: "🔴 Front Left", 
            detailText: "32 PSI • 25°C • Normal"
          },
          { 
            id: "front-right-overview", 
            text: "🟢 Front Right", 
            detailText: "31 PSI • 26°C • Normal"
          }
        ]
      },
      {
        header: 'Rear Tires',
        items: [
          { 
            id: "rear-left-overview", 
            text: "🟡 Rear Left", 
            detailText: "28 PSI • 30°C • Low Pressure"
          },
          { 
            id: "rear-right-overview", 
            text: "🟢 Rear Right", 
            detailText: "29 PSI • 28°C • Normal"
          }
        ]
      },
      {
        header: 'Status Legend',
        items: [
          { 
            id: "legend-normal", 
            text: "🟢 Normal", 
            detailText: "Pressure and temperature within range"
          },
          { 
            id: "legend-warning", 
            text: "🟡 Warning", 
            detailText: "Low pressure or high temperature"
          },
          { 
            id: "legend-critical", 
            text: "🔴 Critical", 
            detailText: "Immediate attention required"
          }
        ]
      }
    ],
    onItemSelect: async ({ templateId, index }) => {
      console.log(`Selected tire overview item at index: ${index}`);
    }
  });

const createDetailedStatusTemplate = (vehiclesData: any[], selectedVehicleId?: string) => {
  const currentVehicle = vehiclesData.find(v => v.id === selectedVehicleId) || vehiclesData[0];
  const tireCount = getTireCountFromAxle(currentVehicle?.axleType || '2 Axles');
  
  const tireItems = [];
  for (let i = 0; i < tireCount; i++) {
    const pressure = 30 + Math.random() * 5;
    const temperature = 20 + Math.random() * 10;
    const status = pressure < 28 ? 'Low Pressure' : pressure > 35 ? 'High Pressure' : 'Normal';
    const position = i < tireCount / 2 ? 'Front' : 'Rear';
    const side = i % 2 === 0 ? 'Left' : 'Right';
    
    tireItems.push({
      id: `tire-detail-${i}`,
      text: `${position} ${side} Tire`,
      detailText: `${pressure.toFixed(1)} PSI • ${temperature.toFixed(1)}°C • ${status} • Connected`
    });
  }

  return new ListTemplate({
    id: uuid.v4(),
    title: 'Detailed Status',
    sections: [
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

const createVehicleListTemplate = (vehiclesData: any[]) => {
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
      // Could switch to that vehicle's tire status
    }
  });
};

const createSettingsTemplate = () =>
  new ListTemplate({
    id: uuid.v4(),
    title: 'Settings',
    sections: [
      {
        header: 'Tire Monitoring',
        items: [
          { 
            id: "units", 
            text: "Measurement Units", 
            detailText: "Imperial (PSI / °F)"
          },
          { 
            id: "alerts", 
            text: "Pressure Alerts", 
            detailText: "Enabled"
          },
          { 
            id: "auto-connect", 
            text: "Auto Connect", 
            detailText: "Disabled"
          }
        ]
      }
    ],
    onItemSelect: async ({ templateId, index }) => {
      console.log(`Selected setting at index: ${index}`);
    }
  });

const createTireDetailTemplate = (tireId: string) => {
  const tireNames = {
    'front-left': 'Front Left Tire',
    'front-right': 'Front Right Tire', 
    'rear-left': 'Rear Left Tire',
    'rear-right': 'Rear Right Tire'
  };
  
  const tireData = {
    'front-left': { psi: 32, temp: 25, status: 'Normal', color: '#4CAF50' },
    'front-right': { psi: 31, temp: 26, status: 'Normal', color: '#4CAF50' },
    'rear-left': { psi: 28, temp: 30, status: 'Low Pressure', color: '#FF9800' },
    'rear-right': { psi: 29, temp: 28, status: 'Normal', color: '#4CAF50' }
  };
  
  const tire = tireData[tireId as keyof typeof tireData];
  
  return new ListTemplate({
    id: uuid.v4(),
    title: tireNames[tireId as keyof typeof tireNames],
    sections: [
      {
        header: 'Tire Information',
        items: [
          { 
            id: "pressure", 
            text: "Pressure", 
            detailText: `${tire.psi} PSI`
          },
          { 
            id: "temperature", 
            text: "Temperature", 
            detailText: `${tire.temp}°C`
          },
          { 
            id: "status", 
            text: "Status", 
            detailText: tire.status
          },
          { 
            id: "connection", 
            text: "Connection", 
            detailText: "Connected"
          }
        ]
      }
    ],
    onItemSelect: async ({ templateId, index }) => {
      console.log(`Selected tire detail at index: ${index}`);
    }
  });
};

const showMapTemplate = (): void => {
  const mapConfig: MapTemplateConfig = {
    component: MapView,
    tripEstimateStyle: "dark",
    guidanceBackgroundColor: '#eeff00',
  };

  const mapTemplate = new MapTemplate(mapConfig);
  CarPlay.pushTemplate(mapTemplate, false);
};

const MapView = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require("../../assets/images/ford-ranger.png")} />
    </View>
  );
};

export default CarPlayScreen;
