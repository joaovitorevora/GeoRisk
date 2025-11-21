import React, { useState } from 'react';
import { View, Alert, Platform } from 'react-native';
import { Modal, Portal, Text, Button, TextInput } from 'react-native-paper';
import { collection, addDoc, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { firestore, auth } from '../firebase/firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker'; // 1. Importe o DatePicker

interface ReportCrimeModalProps {
  visible: boolean;
  onClose: () => void;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

const ReportCrimeModal: React.FC<ReportCrimeModalProps> = ({ visible, onClose, location }) => {
  const [crimeType, setCrimeType] = useState('');
  const [newsLink, setNewsLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. O estado da data agora guarda um objeto Date, não mais um texto
  const [crimeDate, setCrimeDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || crimeDate;
    setShowDatePicker(Platform.OS === 'ios'); // No iOS, o picker fica visível
    setCrimeDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!location || !crimeType || !newsLink) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, "reports"), {
        location: new GeoPoint(location.latitude, location.longitude),
        crimeType: crimeType,
        crimeDate: crimeDate, // 3. Agora passamos o objeto Date diretamente
        newsLink: newsLink,
        status: "pending",
        submittedBy: auth.currentUser?.uid,
        submittedAt: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Sua denúncia foi enviada para análise. Obrigado por contribuir!");
      handleClose();
    } catch (error) {
      console.error("Erro ao enviar denúncia:", error);
      Alert.alert("Erro", "Não foi possível enviar sua denúncia.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCrimeType('');
    setNewsLink('');
    setCrimeDate(new Date());
    onClose();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleClose} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20 }}>
        <Text variant="headlineSmall" style={{ marginBottom: 20 }}>Adicionar Nova Denúncia</Text>
        
        <TextInput
          label="Tipo do Crime (ex: Roubo, Furto)"
          value={crimeType}
          onChangeText={setCrimeType}
          style={{ marginBottom: 10 }}
        />
        
        {/* Botão que abre o DatePicker */}
        <Button 
          icon="calendar" 
          mode="outlined" 
          onPress={() => setShowDatePicker(true)} 
          style={{ marginBottom: 10, paddingVertical: 8 }}
        >
          {`Data do Crime: ${crimeDate.toLocaleDateString()}`}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={crimeDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
          />
        )}

        <TextInput
          label="Link da Notícia para Verificação"
          value={newsLink}
          onChangeText={setNewsLink}
          style={{ marginBottom: 20 }}
          keyboardType="url"
        />

        <Button 
          mode="contained" 
          onPress={handleSubmit} 
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Enviar Denúncia
        </Button>
        <Button 
          onPress={handleClose} 
          style={{marginTop: 8}}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </Modal>
    </Portal>
  );
};

export default ReportCrimeModal;