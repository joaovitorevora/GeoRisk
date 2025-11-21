import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

// 1. IMPORTAÇÕES CORRIGIDAS E SIMPLIFICADAS
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
// Apenas importe a instância 'auth' já pronta!
import { auth } from '../firebase/firebaseConfig'; // Verifique se este caminho está correto para seu projeto

// Interface para as propriedades do componente
interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. A INICIALIZAÇÃO DUPLICADA FOI REMOVIDA DAQUI

  const handleLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Erro', 'Por favor, preencha o e-mail e a senha.');
      return;
    }
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Usuário logado:', userCredential.user.email);
        onLoginSuccess();
      })
      .catch((error) => {
        Alert.alert('Erro no Login', 'Verifique suas credenciais e tente novamente.');
        console.error('Erro de Login:', error.code);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRegister = () => {
    if (email.trim() === '' || password.trim() === '') {
        Alert.alert('Erro', 'Por favor, preencha e-mail e senha para se cadastrar.');
        return;
    }
    setIsLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        Alert.alert('Sucesso!', 'Sua conta foi criada com sucesso.');
        console.log('Usuário cadastrado:', userCredential.user.email);
        onLoginSuccess();
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
            Alert.alert('Erro no Cadastro', 'Este endereço de e-mail já está em uso.');
        } else if (error.code === 'auth/weak-password') {
            Alert.alert('Erro no Cadastro', 'A senha deve ter no mínimo 6 caracteres.');
        } else {
            Alert.alert('Erro no Cadastro', 'Ocorreu um erro. Tente novamente.');
        }
        console.error('Erro de Cadastro:', error.code);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Bem-vindo!
      </Text>
      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={isLoading}
      />
      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        disabled={isLoading}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        loading={isLoading}
        disabled={isLoading}
      >
        Entrar
      </Button>
      <Button
        mode="outlined"
        onPress={handleRegister}
        style={styles.button}
        disabled={isLoading}
      >
        Cadastrar-se
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default LoginScreen;