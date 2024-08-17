export interface GeocodeResponse {
  results: GeocodeResult[];
}

export interface GeocodeResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
}

export interface PlacesAutocompleteResponse {
  predictions: PlaceAutocompletePrediction[];
  status: 'OK' | 'ZERO_RESULTS';
}

export interface PlaceAutocompletePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}
