import { FC, useEffect } from "react";
import { NewAppScreen } from "@react-native/new-app-screen";
import { Image, StatusBar, StyleSheet, useColorScheme, View } from "react-native";
import { CarPlay, ListTemplate, MapTemplate, MapTemplateConfig, PushableTemplates, TabBarTemplate } from "react-native-carplay";
import uuid from 'react-native-uuid'

const App: FC = () => {
  const isDarkMode = useColorScheme() === "dark";

  useEffect(() => {
    CarPlay.registerOnConnect(() => {
      console.log("CarPlay connected");

      const template: PushableTemplates | TabBarTemplate = new TabBarTemplate({
        id: uuid.v4(),
        title: "Tabs",
        templates: [
          RootTemplate,
          CarPlayMoreTemplate,
        ],
        onTemplateSelect() { },
      })

      CarPlay.setRootTemplate(template);
    });

    CarPlay.registerOnDisconnect(() => {
      console.log('CarPlay disconnected');
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NewAppScreen templateFileName="App.tsx" />
    </View>
  );
};

const RootTemplate =
  new ListTemplate({
    id: uuid.v4(),
    title: 'Home',
    tabTitle: 'Home',
    tabSystemImageName: 'music.house.fill',
    sections: [
      {
        header: `Hi`,
        items: [],
      },
      {
        header: "Section 1",
        items: [
          { id: "list1", text: "Show Map" },
        ],
      },
      {
        header: 'Section 1',
        items: [
          { id: "list1", text: "List1" },
          { id: "list2", text: "List2" },
        ],
      },
    ],
    onItemSelect: async ({ templateId, index }) => {
      console.debug(`Home item selected`)
      if (index === 0) return showMapTemplate();

      CarPlay.pushTemplate(RandomTemplate(templateId));
    },
  });

const CarPlayMoreTemplate = new ListTemplate({
  id: uuid.v4(),
  tabTitle: "More",
  tabSystemImageName: 'globe',
});

const RandomTemplate = (key: string) =>
  new ListTemplate({
    id: uuid.v4(),
    sections: [
      {
        items:
          Array(10)?.fill(null).map((item, index) => {
            return {
              id: index?.toString(),
              text: `${key} - ${index}`,
            }
          }) ?? [],
      },
    ],
    onItemSelect: async (item) => { },
  });

const showMapTemplate = (): void => {
  const mapConfig: MapTemplateConfig = {
    component: MapView,
    tripEstimateStyle: "dark",
    guidanceBackgroundColor: '#eeff00',
  };

  const mapTemplate = new MapTemplate(mapConfig);

  CarPlay.pushTemplate(mapTemplate, false);
}

const MapView = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require("./src/assets/images/map.jpg")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
