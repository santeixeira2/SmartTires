/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { useEffect } from "react";
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { CarPlay, ListTemplate, PushableTemplates, TabBarTemplate } from "react-native-carplay";
import uuid from 'react-native-uuid'

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // CarPlay bağlandığında çalışacak
    CarPlay.registerOnConnect(() => {
      console.log('CarPlay connected');

      // Ana template'i ayarla
      const template: PushableTemplates | TabBarTemplate = new TabBarTemplate({
        id: uuid.v4(),
        title: 'Tabs',
        templates: [
          CarPlayHome({ name: "test" }), CarPlayDiscover
        ],
        onTemplateSelect(template, e) { },
      })

      CarPlay.setRootTemplate(template);
    });

    // CarPlay bağlantısı kesildiğinde
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

const CarPlayDiscover = new ListTemplate({
  id: uuid.v4(),
  tabTitle: 'Discover',
  tabSystemImageName: 'globe',
});

const ArtistsTemplate = (items: Array<{ Id: any; Name: string }>) =>
  new ListTemplate({
    id: uuid.v4(),
    sections: [
      {
        items:
          items?.map((item) => {
            return {
              id: item.Id!,
              text: item.Name ?? 'Untitled',
            }
          }) ?? [],
      },
    ],
    onItemSelect: async (item) => { },
  })

const CarPlayHome = (user: any) =>
  new ListTemplate({
    id: uuid.v4(),
    title: 'Home',
    tabTitle: 'Home',
    tabSystemImageName: 'music.house.fill',
    sections: [
      {
        header: `Hi ${user?.name}`,
        items: [],
      },
      {
        header: 'Recents',
        items: [
          { id: QueryKeys.RecentlyPlayedArtists, text: 'Recent Artists' },
          { id: QueryKeys.RecentlyPlayed, text: 'Play it again' },
        ],
      },
      {
        header: 'Frequents',
        items: [
          { id: QueryKeys.FrequentArtists, text: 'Most Played' },
          { id: QueryKeys.FrequentlyPlayed, text: 'On Repeat' },
        ],
      },
    ],
    onItemSelect: async ({ index }) => {
      console.debug(`Home item selected`)

      switch (index) {
        case 0: {
          // Recent Artists
          const list = Array(4).fill(null).map((i, index) => ({ Id: index, Name: `${0} - ${index}` }));

          CarPlay.pushTemplate(ArtistsTemplate(list));

          break
        }

        case 1: {
          // Recent Tracks

          const list = Array(4).fill(null).map((i, index) => ({ Id: index, Name: `${1} - ${index}` }));

          CarPlay.pushTemplate(ArtistsTemplate(list));

          break
        }

        case 2: {
          // Most Played Artists
          
          const list = Array(4).fill(null).map((i, index) => ({ Id: index, Name: `${2} - ${index}` }));

          CarPlay.pushTemplate(ArtistsTemplate(list));

          break
        }

        case 3: {
          // On Repeat
          
          const list = Array(4).fill(null).map((i, index) => ({ Id: index, Name: `${3} - ${index}` }));

          CarPlay.pushTemplate(ArtistsTemplate(list));

          break
        }
      }
    },
  })

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export enum QueryKeys {
  AddToQueue = 'ADD_TO_QUEUE',
  AlbumTracks = 'ALBUM_TRACKS',
  Api = 'API',
  ArtistAlbums = 'ARTIST_ALBUMS',
  ArtistById = 'ARTIST_BY_ID',
  Credentials = 'CREDENTIALS',

  /**
   * @deprecated React Native Fast Image is being used instead of
   * querying for the images with Tanstack
   */
  ItemImage = 'IMAGE_BY_ITEM_ID',
  Libraries = 'LIBRARIES',
  Pause = 'PAUSE',
  Play = 'PLAY',

  /**
   * Query representing the fetching of a user's created playlists.
   *
   * Invalidation occurs by providing this query key
   */
  Playlists = 'PLAYLISTS',
  Progress = 'PROGRESS',
  PlayQueue = 'PLAY_QUEUE',
  PublicApi = 'PUBLIC_API',
  PublicSystemInfo = 'PUBLIC_SYSTEM_INFO',
  RemoveFromQueue = 'REMOVE_FROM_QUEUE',
  RemoveMultipleFromQueue = 'REMOVE_MULTIPLE_FROM_QUEUE',
  ReportPlaybackPosition = 'REPORT_PLAYBACK_POSITION',
  ReportPlaybackStarted = 'REPORT_PLAYBACK_STARTED',
  ReportPlaybackStopped = 'REPORT_PLAYBACK_STOPPED',
  ServerUrl = 'SERVER_URL',
  Playlist = 'Playlist',
  RecentlyPlayed = 'RecentlyPlayed',
  RecentlyPlayedArtists = 'RecentlyPlayedArtists',
  ArtistFeaturedAlbums = 'ArtistFeaturedAlbums',
  ArtistImage = 'ArtistImage',
  PlaybackStateChange = 'PlaybackStateChange',
  Player = 'Player',
  NetworkStatus = 'NetworkStatus',

  /**
   * @deprecated Use Playlists instead
   */
  UserPlaylists = 'UserPlaylists',

  /**
   * Query representing the fetching of tracks for an album or playlist.
   *
   * Invalidation occurs when the ID of the album or playlist is provided
   * as a query key
   */
  ItemTracks = 'ItemTracks',
  RefreshHome = 'RefreshHome',
  FavoriteArtists = 'FavoriteArtists',
  FavoriteAlbums = 'FavoriteAlbums',
  FavoriteTracks = 'FavoriteTracks',
  UserData = 'UserData',
  UpdatePlayerOptions = 'UpdatePlayerOptions',
  Item = 'Item',
  Search = 'Search',
  SearchSuggestions = 'SearchSuggestions',
  FavoritePlaylists = 'FavoritePlaylists',
  UserViews = 'UserViews',
  Audio = 'Audio',
  RecentlyAdded = 'RecentlyAdded',
  SimilarItems = 'SimilarItems',
  AudioCache = 'AudioCache',
  MediaSources = 'MediaSources',
  FrequentArtists = 'FrequentArtists',
  FrequentlyPlayed = 'FrequentlyPlayed',
  InstantMix = 'InstantMix',

  /**
   * Query representing a cache of playlist items used to check if tracks
   * are already in playlists to prevent adding duplicates
   */
  PlaylistItemCheckCache = 'PlaylistItemCheckCache',
  ArtistFeaturedOn = 'ArtistFeaturedOn',
  AllArtists = 'AllArtists',
  AllTracks = 'AllTracks',
  AllAlbums = 'AllAlbums',
  StorageInUse = 'StorageInUse',
  Patrons = 'Patrons',
  AllArtistsAlphabetical = 'AllArtistsAlphabetical',
  AllAlbumsAlphabetical = 'AllAlbumsAlphabetical',
  RecentlyAddedAlbums = 'RecentlyAddedAlbums',
  PublicPlaylists = 'PublicPlaylists',
}

export default App;
