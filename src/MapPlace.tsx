import { debounce } from 'lodash';
import { useCallback, useMemo } from 'react';
import MapView, {
  type LatLng,
  type MapPressEvent,
  type MapViewProps,
} from 'react-native-maps';
import { MapClient } from './MapClient';
import { type GeocodeResult } from './types';

export const MapPlace = ({
  apiKey,
  onPlace,
  ...props
}: MapViewProps & {
  apiKey: string;
  onPlace: (place: GeocodeResult) => void;
}) => {
  const mapClient = useMemo(() => new MapClient(apiKey), [apiKey]);

  const reverseGeocoding = useCallback(
    async (coor: LatLng) => {
      if (!coor) return;
      try {
        const result = await mapClient.reverseGeocoding(coor);
        const firstAddress = result.results.at(0);
        if (firstAddress) {
          onPlace?.(firstAddress);
        } else {
          console.warn('Cannot get the address', result);
        }
      } catch (error) {
        console.error('Failed to reverse geocoding', error);
      }
    },
    [mapClient, onPlace]
  );

  const debounceReverseCoding = useMemo(
    () => debounce(reverseGeocoding),
    [reverseGeocoding]
  );

  const onPress = (event: MapPressEvent) => {
    debounceReverseCoding(event.nativeEvent.coordinate);
    props.onPress?.(event);
  };

  return <MapView onPress={onPress} {...props} />;
};
