import React, { useEffect, useRef, useState } from 'react';
import { View, Alert, Vibration } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy,
  LocationObject,
} from 'expo-location';
import * as Notifications from 'expo-notifications';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { Provider as PaperProvider, Menu, Button, IconButton } from 'react-native-paper';

import { styles } from './styles';
import { zonasDeRisco } from './zonasDeRisco';
import PlacesAutocomplete from './PlacesAutocomplete';

const customMapStyleNight = require('./customMapStyleNight.json');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function AppContent() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modoWaze, setModoWaze] = useState(false);
  const [modoNoturno, setModoNoturno] = useState(false);
  const zonasNotificadasRef = useRef<Set<string>>(new Set());
  const mapRef = useRef<MapView>(null);

  const getDistanceFromLatLonInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sendRiskNotification = async (zonaId: string) => {
    Vibration.vibrate(1000);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Alerta de Zona de Risco',
        body: `Você está entrando na zona de risco ${zonaId}. Tenha atenção!`,
        sound: 'default',
      },
      trigger: null,
    });
    console.log(`Notificação enviada para zona ${zonaId}`);
  };

  useEffect(() => {
    (async () => {
      const { granted } = await requestForegroundPermissionsAsync();
      if (!granted) {
        Alert.alert("Permissão negada", "É necessário permitir acesso à localização.");
        return;
      }

      const position = await getCurrentPositionAsync();
      setLocation(position);

      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permissão negada", "É necessário permitir notificações.");
      }
    })();
  }, []);

  useEffect(() => {
    let subscription: any;

    (async () => {
      subscription = await watchPositionAsync(
        {
          accuracy: LocationAccuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (response) => {
          setLocation(response);

          mapRef.current?.animateCamera({
            center: response.coords,
            pitch: modoWaze ? 75 : 0,
            heading: modoWaze ? response.coords.heading ?? 0 : 0,
            zoom: modoWaze ? 18 : 16,
          });

          zonasDeRisco
            .filter((zona) =>
              !tipoSelecionado || zona.tipo.toLowerCase() === tipoSelecionado.toLowerCase()
            )
            .forEach((zona) => {
              const distance = getDistanceFromLatLonInMeters(
                response.coords.latitude,
                response.coords.longitude,
                zona.latitude,
                zona.longitude
              );

              const isInside = distance <= zona.raio;
              const wasNotified = zonasNotificadasRef.current.has(zona.id);

              if (isInside && !wasNotified) {
                sendRiskNotification(zona.id);
                zonasNotificadasRef.current.add(zona.id);
              }

              if (!isInside && wasNotified) {
                zonasNotificadasRef.current.delete(zona.id);
              }
            });
        }
      );
    })();

    return () => {
      if (subscription) subscription.remove();
    };
  }, [tipoSelecionado, modoWaze]);

  useEffect(() => {
    if (location?.coords && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        pitch: modoWaze ? 75 : 0,
        heading: modoWaze ? location.coords.heading ?? 0 : 0,
        zoom: modoWaze ? 18 : 16,
      });
    }
  }, [modoWaze]);

  return (
    <View style={styles.container}>
      {location?.coords && (
        <>
          <PlacesAutocomplete
            onPlaceSelected={(coords) => setDestination(coords)}
            onClearDestination={() => setDestination(null)}
            hasDestination={!!destination}
            recenterMap={() => {
              if (location?.coords) {
                mapRef.current?.animateCamera({
                  center: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  },
                  zoom: 16,
                });
              }
            }}
          />


          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0015,
              longitudeDelta: 0.0015,
            }}
            customMapStyle={modoNoturno ? customMapStyleNight : []}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Você está aqui"
            />

            {destination && (
              <>
                <Marker coordinate={destination} pinColor="blue" title="Destino" />
                <MapViewDirections
                  origin={location.coords}
                  destination={destination}
                  apikey={GOOGLE_MAPS_API_KEY}
                  strokeWidth={4}
                  strokeColor="blue"
                  mode="DRIVING"
                  onReady={(result) => {
                    if (!modoWaze) {
                      mapRef.current?.fitToCoordinates(result.coordinates, {
                        edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
                      });
                    }
                  }}
                  onError={(err) => {
                    console.warn("Erro ao calcular rota:", err);
                  }}
                />
              </>
            )}

            {zonasDeRisco
              .filter((zona) =>
                !tipoSelecionado || zona.tipo.toLowerCase() === tipoSelecionado.toLowerCase()
              )
              .map((zona) => (
                <Circle
                  key={zona.id}
                  center={{ latitude: zona.latitude, longitude: zona.longitude }}
                  radius={zona.raio}
                  fillColor="rgba(255, 0, 0, 0.3)"
                  strokeColor="rgba(255, 0, 0, 0.7)"
                />
              ))}
          </MapView>

          {/* Filtros e botões */}
          <View style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 10 }}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="contained"
                  icon="filter-variant"
                  onPress={() => setMenuVisible(true)}
                  style={{ borderRadius: 30 }}
                  compact
                >
                  {tipoSelecionado ? tipoSelecionado : 'Todos'}
                </Button>
              }
            >
              <Menu.Item onPress={() => setTipoSelecionado(null)} title="Todos" />
              <Menu.Item onPress={() => setTipoSelecionado('assalto')} title="Assalto" />
              <Menu.Item onPress={() => setTipoSelecionado('furto')} title="Furto" />
              <Menu.Item onPress={() => setTipoSelecionado('homicídio')} title="Homicídio" />
            </Menu>
          </View>

          <View style={{ position: 'absolute', bottom: 20, right: 80, zIndex: 10 }}>
            <IconButton
              icon={modoWaze ? 'satellite-variant' : 'car'}
              size={28}
              onPress={() => setModoWaze((prev) => !prev)}
              mode="contained"
              style={{ backgroundColor: '#6200ee' }}
              iconColor="#fff"
            />
          </View>

          <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10 }}>
            <IconButton
              icon={modoNoturno ? 'weather-night' : 'white-balance-sunny'}
              size={28}
              onPress={() => setModoNoturno((prev) => !prev)}
              mode="contained"
              style={{ backgroundColor: '#6200ee' }}
              iconColor="#fff"
            />
          </View>
        </>
      )}
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AppContent />
    </PaperProvider>
  );
}
