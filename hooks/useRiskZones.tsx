//busca de dados do Firestore
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from '../firebase/firebaseConfig';

export function useRiskZones() {
  const [riskZones, setRiskZones] = useState<any[]>([]);

  useEffect(() => {
    const q = collection(firestore, "risk_zones");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const zonesFromDB = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRiskZones(zonesFromDB);
    });

    return () => unsubscribe(); // Limpa a inscrição ao desmontar
  }, []);

  return riskZones;
}