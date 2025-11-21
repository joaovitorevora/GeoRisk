//renderizará o MapView
import React from 'react';
import MapView, { Marker, Circle, LongPressEvent } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_API_KEY } from '@env';
import { LocationObject } from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../assets/styles/mainStyles';

const customMapStyleNight = require('../customMapStyleNight.json');

interface MapViewComponentProps {
  mapRef: React.RefObject<MapView>;
  location: LocationObject | null;
  destination: { latitude: number; longitude: number } | null;
  riskZones: any[];
  tipoSelecionado: string | null;
  userRole: string | null;
  modoNoturno: boolean;
  modoWaze: boolean;
  onLongPress: (event: LongPressEvent) => void;
  onRouteReady: (result: any) => void;
  onConfirmDeleteZone: (zone: any) => void;
}

export default function MapViewComponent({
  mapRef,
  location,
  destination,
  riskZones,
  tipoSelecionado,
  userRole,
  modoNoturno,
  modoWaze,
  onLongPress,
  onRouteReady,
  onConfirmDeleteZone
}: MapViewComponentProps) {
    if (!location?.coords) {
    return null;
  }
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        ...location.coords,
        latitudeDelta: 0.0015,
        longitudeDelta: 0.0015,
      }}
      customMapStyle={modoNoturno ? customMapStyleNight : []}
      onLongPress={onLongPress}
    >
      <Marker coordinate={location.coords} title="Você está aqui" />
      {destination && (
        <>
          <Marker coordinate={destination} pinColor="blue" title="Destino" />
          <MapViewDirections
            origin={location.coords}
            destination={destination}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={5}
            strokeColor="blue"
            mode="DRIVING"
            onReady={(result) => {
              if (!modoWaze) {
                mapRef.current?.fitToCoordinates(result.coordinates, { 
                  edgePadding: { top: 150, bottom: 200, left: 50, right: 50 } 
                });
              }
              onRouteReady(result);
            }}
            onError={(err) => console.warn("Erro ao calcular rota:", err)}
          />
        </>
      )}
      {riskZones.filter(z => !tipoSelecionado || z.tipo?.toLowerCase() === tipoSelecionado).map((zona) => (
        <React.Fragment key={zona.id}>
          <Circle center={zona} radius={zona.raio} fillColor="rgba(255,0,0,0.3)" strokeColor="rgba(255,0,0,0.7)" />
          {userRole === 'admin' && (
            <Marker
              coordinate={zona}
              onPress={() => onConfirmDeleteZone(zona)}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <Icon name="close-circle" size={24} color="#B00020" style={{ backgroundColor: 'white', borderRadius: 12 }} />
            </Marker>
          )}
        </React.Fragment>
      ))}
    </MapView>
  );
}