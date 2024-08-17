import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MapPlace } from 'react-native-map-place';
import { MapMarker } from 'react-native-maps';
import type { GeocodeResult } from '../../src/types';

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject>();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const [place, setPlace] = useState<GeocodeResult>();

  if (!process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY) {
    console.error('No api key');
    return null;
  }

  if (!location) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MapPlace
        apiKey={process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY}
        region={{
          ...location.coords,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
        onPlace={setPlace}
        style={styles.map}
      >
        {place ? (
          <MapMarker
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
          />
        ) : null}
      </MapPlace>
      {place ? (
        <View style={styles.place}>
          <Text
            style={styles.latlong}
          >{`${place.geometry.location.lat.toFixed(5)}, ${place.geometry.location.lng.toFixed(5)}`}</Text>
          <Text>{place.formatted_address}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  place: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 16,
    gap: 1,
    borderRadius: 12,
    bottom: 16,
    left: 16,
    right: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  latlong: {
    fontWeight: '700',
  },
});
