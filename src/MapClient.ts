import queryString from 'query-string';
import { type LatLng } from 'react-native-maps';
import type {
  GeocodeResponse,
  GeocodeResult,
  PlacesAutocompleteResponse,
} from './types';

export class MapClient {
  baseUrl = 'https://maps.googleapis.com/maps/api';
  apiKey = '';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async reverseGeocoding(data: LatLng): Promise<GeocodeResponse> {
    const response = await fetch(
      `${this.baseUrl}/geocode/json?latlng=${data.latitude},${data.longitude}&key=${this.apiKey}`
    );
    return await response.json();
  }

  async searchNearby(data: LatLng): Promise<GeocodeResponse> {
    const response = await fetch(
      `${this.baseUrl}/place/nearbysearch/json?location=${data.latitude},${data.longitude}&radius=50&key=${this.apiKey}`
    );
    return await response.json();
  }

  async searchPlaces(
    query: string,
    language: string,
    region: string | undefined
  ): Promise<GeocodeResponse> {
    const params = queryString.stringify({
      key: this.apiKey,
      query,
      language,
      region,
    });

    const response = await fetch(
      `${this.baseUrl}/place/textsearch/json?${params}`
    );

    return await response.json();
  }

  async getPlaceDetails({
    placeId,
    language,
  }: {
    placeId: string;
    language: string;
  }): Promise<{ result: GeocodeResult }> {
    const params = queryString.stringify({
      key: this.apiKey,
      language,
      placeid: placeId,
    });

    const response = await fetch(
      `${this.baseUrl}/place/details/json?${params}`
    );

    return await response.json();
  }

  async autocomplete({
    input,
    language,
    country,
  }: {
    input: string;
    language: string;
    country: string | undefined;
  }): Promise<PlacesAutocompleteResponse> {
    const params = queryString.stringify({
      key: this.apiKey,
      input,
      language,
      components: `country:${country}`,
    });

    const response = await fetch(
      `${this.baseUrl}/place/autocomplete/json?${params}`
    );

    return await response.json();
  }
}
