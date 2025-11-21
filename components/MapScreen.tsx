// components/MapScreen.tsx

import React, { useEffect, useRef, useState } from 'react';
import { View, Alert, Vibration } from 'react-native';
import MapView, { LongPressEvent } from 'react-native-maps';
import { signOut } from 'firebase/auth';
import { deleteDoc, doc } from "firebase/firestore";
import { auth, firestore } from '../firebase/firebaseConfig';
import * as Notifications from 'expo-notifications';
import { Text, IconButton, Button } from 'react-native-paper'; 

import { useUserLocation } from '../hooks/useUserLocation';
import { useRiskZones } from '../hooks/useRiskZones';

import styles from '../assets/styles/mainStyles';
import PlacesAutocomplete from '../PlacesAutocomplete';
import AdminModal from './AdminModal';
import ReportCrimeModal from './ReportCrimeModal';
import MapViewComponent from './MapViewComponent';
import MapControls from './MapControls';

interface MapScreenProps {
  onLogout: () => void;
  userRole: string | null;
}

export default function MapScreen({ onLogout, userRole }: MapScreenProps) {
  const location = useUserLocation();
  const riskZones = useRiskZones();

  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modoWaze, setModoWaze] = useState(false);
  const [modoNoturno, setModoNoturno] = useState(false);
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [newReportLocation, setNewReportLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const mapRef = useRef<MapView>(null);
  const zonasNotificadasRef = useRef<Set<string>>(new Set());
  const routeCheckedRef = useRef<boolean>(false);
  
  const getDistanceFromLatLonInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  
  const sendRiskNotification = async (zonaId: string) => {
    Vibration.vibrate(1000);
    await Notifications.scheduleNotificationAsync({
      content: { title: '⚠️ Alerta de Zona de Risco', body: `Você está se aproximando de uma zona de risco.`, sound: 'default' },
      trigger: { seconds: 1, channelId: 'risk-alerts' },
    });
  };

  useEffect(() => {
    if (!location) return;
    
    // Esta é a lógica que força a câmera para o modo Waze
    if (modoWaze && mapRef.current) {
        mapRef.current.animateCamera({ center: location.coords, pitch: 75, heading: location.coords.heading ?? 0, zoom: 20 });
    }

    riskZones.forEach((zona) => {
        if (typeof zona.latitude !== 'number') return;
        const dist = getDistanceFromLatLonInMeters(location.coords.latitude, location.coords.longitude, zona.latitude, zona.longitude);
        const notified = zonasNotificadasRef.current.has(zona.id);
        const isInside = dist <= (zona.raio + 30);
        if (isInside && !notified) { sendRiskNotification(zona.id); zonasNotificadasRef.current.add(zona.id); } 
        else if (!isInside && notified) { zonasNotificadasRef.current.delete(zona.id); }
      });
  }, [location, modoWaze, riskZones]);
  
  const isPointNearLine = (start: {latitude: number, longitude: number}, end: {latitude: number, longitude: number}, point: {latitude: number, longitude: number}, radius: number) => {
    const distToStart = getDistanceFromLatLonInMeters(point.latitude, point.longitude, start.latitude, start.longitude);
    if (distToStart <= radius) return true;
    const distToEnd = getDistanceFromLatLonInMeters(point.latitude, point.longitude, end.latitude, end.longitude);
    if (distToEnd <= radius) return true;
    const segmentLength = getDistanceFromLatLonInMeters(start.latitude, start.longitude, end.latitude, end.longitude);
    if (distToStart + distToEnd < segmentLength + (radius * 2)) return true;
    return false;
  };

  const findAllIntersectingZones = (coordinates: {latitude: number, longitude: number}[], zones: any[]) => {
    const intersectingZones = new Set<string>();
    for (const zone of zones) {
      if (typeof zone.latitude !== 'number' || typeof zone.longitude !== 'number' || typeof zone.raio !== 'number') continue;
      const zoneCenter = { latitude: zone.latitude, longitude: zone.longitude };
      for (let i = 0; i < coordinates.length - 1; i++) {
          const startPoint = coordinates[i];
          const endPoint = coordinates[i + 1];
          if (isPointNearLine(startPoint, endPoint, zoneCenter, zone.raio)) {
              intersectingZones.add(zone.tipo || 'Risco Desconhecido');
              break;
          }
      }
    }
    return Array.from(intersectingZones);
  };
  
  const handleRouteReady = (result: any) => {
    if (routeCheckedRef.current) return;
    routeCheckedRef.current = true;
    const intersectingZoneTypes = findAllIntersectingZones(result.coordinates, riskZones);
    if (intersectingZoneTypes.length > 0) {
        Alert.alert(
            "⚠️ Atenção: Rota Arriscada",
            `A rota sugerida passa por áreas com os seguintes riscos reportados:\n\n• ${intersectingZoneTypes.join('\n• ')}\n\nDeseja prosseguir com cautela?`,
            [{ text: "Cancelar Rota", style: "destructive", onPress: () => setDestination(null) }, { text: "Prosseguir", style: "default" }]
        );
    }
  };
  
  const handleLogout = async () => {
    await signOut(auth).catch(e => Alert.alert("Erro", "Não foi possível desconectar."));
    onLogout();
  };
  
  const handleMapLongPress = (event: LongPressEvent) => {
    if (!isReporting) return;
    setNewReportLocation(event.nativeEvent.coordinate);
    setReportModalVisible(true);
    setIsReporting(false);
  };

  const handleReportClose = () => {
    setReportModalVisible(false);
    setNewReportLocation(null);
  };
  
  const toggleModoWaze = () => {
    const novo = !modoWaze;
    setModoWaze(novo);
    if (!novo && mapRef.current) {
        mapRef.current.animateCamera({ pitch: 0, heading: 0, zoom: 16 }, { duration: 1000 });
    }
  };
  
  const handleDeleteZone = async (zoneId: string) => {
    try { await deleteDoc(doc(firestore, "risk_zones", zoneId)); Alert.alert("Sucesso", "Zona removida."); } 
    catch (error) { Alert.alert("Erro", "Não foi possível remover a zona."); }
  };

  const confirmDeleteZone = (zone: any) => {
    if (userRole !== 'admin') return;
    Alert.alert("Remover Zona", `Deseja remover a zona "${zone.tipo}"?`,
      [{ text: "Cancelar" }, { text: "Remover", onPress: () => handleDeleteZone(zone.id) }]
    );
  };

  const handleReportPress = () => {
      setIsReporting(!isReporting);
      if (!isReporting) {
          Alert.alert("Marcar Local", "Pressione e segure no mapa para marcar o local da ocorrência.");
      }
  };

  const handleFilterChange = (tipo: string | null) => {
      setTipoSelecionado(tipo);
      setMenuVisible(false);
  };

  const tiposUnicos = Array.from(new Set(riskZones.map(z => z.tipo?.toLowerCase()).filter(Boolean)));
  
  if (!location) {
    return (
        <View style={styles.container}>
            <Button loading>Carregando mapa...</Button>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <AdminModal visible={adminModalVisible} onClose={() => setAdminModalVisible(false)} />
      <ReportCrimeModal visible={reportModalVisible} onClose={handleReportClose} location={newReportLocation} />
      
      {isReporting && (<View style={styles.infoBox}><Text style={{ color: 'white' }}>Pressione e segure no mapa para marcar.</Text></View>)}
      
      <View style={styles.adminIconContainer}>
        {userRole === 'admin' && (<IconButton icon="shield-check" size={28} onPress={() => setAdminModalVisible(true)} mode="contained" style={{ backgroundColor: '#006400' }} iconColor="#fff" />)}
      </View>
      
      <PlacesAutocomplete
        onPlaceSelected={(coords) => { setDestination(coords); routeCheckedRef.current = false; }}
        onClearDestination={() => { setDestination(null); }}
        hasDestination={!!destination}
        recenterMap={() => {
            if (location) {
                mapRef.current?.animateCamera({ center: location.coords, zoom: 16 });
            }
        }}
      />
      
      <MapViewComponent 
        mapRef={mapRef}
        location={location}
        destination={destination}
        riskZones={riskZones}
        tipoSelecionado={tipoSelecionado}
        userRole={userRole}
        modoNoturno={modoNoturno}
        modoWaze={modoWaze} // Passa o estado para o componente filho
        onLongPress={handleMapLongPress}
        onRouteReady={handleRouteReady}
        onConfirmDeleteZone={confirmDeleteZone}
      />

      <MapControls
        userRole={userRole}
        isReporting={isReporting}
        onReportPress={handleReportPress}
        menuVisible={menuVisible}
        onMenuDismiss={() => setMenuVisible(false)}
        onMenuOpen={() => setMenuVisible(true)}
        tipoSelecionado={tipoSelecionado}
        tiposUnicos={tiposUnicos}
        onFilterChange={handleFilterChange}
        onLogout={handleLogout}
        toggleModoWaze={toggleModoWaze}
        modoWaze={modoWaze}
        toggleModoNoturno={() => setModoNoturno(!modoNoturno)}
        modoNoturno={modoNoturno}
      />
    </View>
  );
}