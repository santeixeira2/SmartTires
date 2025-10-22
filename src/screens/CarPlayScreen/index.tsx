import React, { useEffect } from 'react';
import { CarPlay, ListTemplate, MapTemplate, MapTemplateConfig, TabBarTemplate } from "react-native-carplay";
import uuid from 'react-native-uuid';
import { View, Image } from 'react-native';

const CarPlayScreen: React.FC = () => {
  useEffect(() => {
    CarPlay.registerOnConnect(() => {
      console.log("CarPlay connected");

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
                text: "Ford Ranger", 
                detailText: "Connected • 2 Axle"
              }
            ]
          },
          {
            header: "Tire Status",
            items: [
              { 
                id: "front-left", 
                text: "Front Left", 
                detailText: "32 PSI • 25°C • Normal"
              },
              { 
                id: "front-right", 
                text: "Front Right", 
                detailText: "31 PSI • 26°C • Normal"
              },
              { 
                id: "rear-left", 
                text: "Rear Left", 
                detailText: "28 PSI • 30°C • Low Pressure"
              },
              { 
                id: "rear-right", 
                text: "Rear Right", 
                detailText: "29 PSI • 28°C • Normal"
              }
            ]
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
              CarPlay.pushTemplate(createDetailedStatusTemplate());
              break;
            case 'vehicle-list':
              CarPlay.pushTemplate(createVehicleListTemplate());
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

const createDetailedStatusTemplate = () =>
  new ListTemplate({
    id: uuid.v4(),
    title: 'Detailed Status',
    sections: [
      {
        header: 'Tire Details',
        items: [
          { 
            id: "front-left-detail", 
            text: "Front Left Tire", 
            detailText: "32 PSI • 25°C • Normal • Connected"
          },
          { 
            id: "front-right-detail", 
            text: "Front Right Tire", 
            detailText: "31 PSI • 26°C • Normal • Connected"
          },
          { 
            id: "rear-left-detail", 
            text: "Rear Left Tire", 
            detailText: "28 PSI • 30°C • Low Pressure • Connected"
          },
          { 
            id: "rear-right-detail", 
            text: "Rear Right Tire", 
            detailText: "29 PSI • 28°C • Normal • Connected"
          }
        ]
      }
    ],
    onItemSelect: async ({ templateId, index }) => {
      console.log(`Selected detailed tire at index: ${index}`);
    }
  });

const createVehicleListTemplate = () =>
  new ListTemplate({
    id: uuid.v4(),
    title: 'My Vehicles',
    sections: [
      {
        header: 'Connected Vehicles',
        items: [
          { 
            id: "ford-ranger", 
            text: "Ford Ranger", 
            detailText: "Connected • 2 Axle • 4 Tires"
          },
          { 
            id: "travel-trailer", 
            text: "Travel Trailer", 
            detailText: "Disconnected • 3 Axle • 6 Tires"
          },
          { 
            id: "ford-f150", 
            text: "Ford F-150", 
            detailText: "Connected • 2 Axle • 4 Tires"
          },
          { 
            id: "fifth-wheel", 
            text: "Fifth Wheel", 
            detailText: "Connected • 4 Axle • 8 Tires"
          }
        ]
      }
    ],
    onItemSelect: async ({ templateId, index }) => {
      console.log(`Selected vehicle at index: ${index}`);
      // Could switch to that vehicle's tire status
    }
  });

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
