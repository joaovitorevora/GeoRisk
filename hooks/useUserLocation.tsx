//lógica de localização
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy,
  LocationObject,
} from 'expo-location';

export function useUserLocation() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    
    const startWatching = async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permissão negada", "Acesso à localização é necessário para o funcionamento do app.");
        return;
      }

      try {
        const initialLocation = await getCurrentPositionAsync({ accuracy: LocationAccuracy.Highest });
        setLocation(initialLocation);
      } catch (e) {
        console.error("Erro ao obter localização inicial: ", e);
      }

      subscription = await watchPositionAsync({
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      }, (newLocation) => {
        setLocation(newLocation);
      });
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return location;
}