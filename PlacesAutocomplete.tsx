import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GOOGLE_MAPS_API_KEY } from '@env';

type Prediction = {
  place_id: string;
  description: string;
};

type Props = {
  onPlaceSelected: (location: { latitude: number; longitude: number }) => void;
};

export default function PlacesAutocomplete({ onPlaceSelected }: Props) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const fetchPlaces = async (text: string) => {
    setQuery(text);
    if (text.length < 3) return;

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${GOOGLE_MAPS_API_KEY}&language=pt_BR`;
    const res = await fetch(url);
    const json = await res.json();
    setPredictions(json.predictions || []);
  };

  const selectPlace = async (placeId: string) => {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();

    const location = json.result.geometry.location;
    onPlaceSelected({ latitude: location.lat, longitude: location.lng });
    setQuery('');
    setPredictions([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Para onde você quer ir?"
        value={query}
        onChangeText={fetchPlaces}
      />
      {predictions.length > 0 && (
        <FlatList
          data={predictions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selectPlace(item.place_id)} style={styles.item}>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestions}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    width: '90%',
    alignSelf: 'center',
    zIndex: 1,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  suggestions: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 150,
  },
  item: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
});
