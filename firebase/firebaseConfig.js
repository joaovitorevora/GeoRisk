import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { 
  API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, 
  MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID 
} from '@env';


// 1. As chaves agora são lidas do arquivo .env de forma segura
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

// 2. Inicialize o Firebase App
const app = initializeApp(firebaseConfig);

// 3. Inicialize o Firebase Auth com persistência
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const firestore = getFirestore(app);
export { app, auth, firestore };