import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, Linking } from 'react-native';
import { Modal, Portal, Text, Button, Card } from 'react-native-paper';
// MUDANÇA 1: Adicionar 'deleteDoc' à lista de importações
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebaseConfig';

interface AdminModalProps {
  visible: boolean;
  onClose: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ visible, onClose }) => {
  const [pendingReports, setPendingReports] = useState<any[]>([]);

  // Busca as denúncias pendentes em tempo real sempre que o modal fica visível
  useEffect(() => {
    if (!visible) return;
    
    const q = query(collection(firestore, "reports"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reports = snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        // Converte o timestamp do Firestore para um objeto Date do JS
        crimeDate: d.data().crimeDate.toDate() 
      }));
      setPendingReports(reports);
    });

    // Limpa a escuta quando o componente é desmontado ou o modal fecha
    return () => unsubscribe();
  }, [visible]);

  const handleOpenLink = async (url: string) => {
    if (!url) return;

    // Adiciona https:// se o link não tiver um protocolo
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `https://${url}`;

    try {
      const supported = await Linking.canOpenURL(fullUrl);
      if (supported) {
        await Linking.openURL(fullUrl);
      } else {
        Alert.alert("Erro", `Não foi possível abrir a URL: ${fullUrl}`);
      }
    } catch (error) {
        Alert.alert("Erro", `Ocorreu um problema ao tentar abrir o link.`);
    }
  };

  const handleApprove = async (report: any) => {
    try {
      // 1. Atualiza o status da denúncia original para "approved"
      await updateDoc(doc(firestore, "reports", report.id), { status: "approved" });
      
      // 2. Cria a nova zona de risco pública na coleção 'risk_zones'
      await addDoc(collection(firestore, "risk_zones"), {
        latitude: report.location.latitude,
        longitude: report.location.longitude,
        tipo: report.crimeType,
        raio: 50, // Raio padrão
      });
      
      Alert.alert("Sucesso", "Denúncia aprovada e publicada no mapa!");
    } catch (e) {
      console.error("Erro ao aprovar:", e);
      Alert.alert("Erro", "Não foi possível aprovar a denúncia.");
    }
  };

  // MUDANÇA 2: Lógica da função handleReject alterada
  const handleReject = async (reportId: string) => {
    try {
      // Ação principal: Exclui o documento da coleção "reports"
      await deleteDoc(doc(firestore, "reports", reportId));
      
      // MUDANÇA 3: Mensagem de sucesso atualizada
      Alert.alert("Sucesso", "Denúncia removida com sucesso.");
    } catch (e) {
      console.error("Erro ao remover denúncia:", e);
      Alert.alert("Erro", "Não foi possível remover a denúncia.");
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={{ backgroundColor: 'white', padding: 10, margin: 20, maxHeight: '80%' }}>
        <Text variant="headlineSmall" style={{marginBottom: 10, paddingHorizontal: 10}}>Denúncias Pendentes</Text>
        <FlatList
          data={pendingReports}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginVertical: 8 }}>
              <Card.Title title={item.crimeType} subtitle={`Data: ${item.crimeDate.toLocaleDateString()}`} />
              <Card.Content>
                {item.newsLink && (
                  <Button onPress={() => handleOpenLink(item.newsLink)}>Ver Notícia</Button>
                )}
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => handleReject(item.id)}>Rejeitar</Button>
                <Button mode="contained" onPress={() => handleApprove(item)}>Aprovar</Button>
              </Card.Actions>
            </Card>
          )}
          ListEmptyComponent={<Text style={{textAlign: 'center', padding: 20}}>Nenhuma denúncia pendente.</Text>}
        />
      </Modal>
    </Portal>
  );
};

export default AdminModal;