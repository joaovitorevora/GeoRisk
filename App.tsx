// App.tsx
import React, { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import { auth, firestore } from './firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import LoginScreen from './components/LoginScreen';
import MapScreen from './components/MapScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('risk-alerts', { 
        name: 'Alertas de Risco', 
        importance: Notifications.AndroidImportance.MAX, 
        vibrationPattern: [0, 250, 250, 250], 
        lightColor: '#FF231F7C', 
        sound: 'default' 
      });
    }
    Notifications.requestPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') Alert.alert("Permissão negada", "É necessário permitir notificações.");
    });
  }, []);

  const handleLoginSuccess = async () => {
    if (auth.currentUser) {
      try { 
        const userDoc = await getDoc(doc(firestore, "users", auth.currentUser.uid)); 
        setUserRole(userDoc.exists() ? userDoc.data().role : 'user'); 
      } 
      catch (error) { 
        console.error("Erro ao buscar dados do usuário:", error);
        setUserRole('user'); 
      }
    }
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <PaperProvider>
      {isLoggedIn ? (
        <MapScreen onLogout={handleLogout} userRole={userRole} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </PaperProvider>
  );
}