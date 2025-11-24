# 🛡️ GeoRisk - Aplicativo de Mapeamento de Zonas de Risco

> **Trabalho de Conclusão de Curso (TCC)**
> **Tema:** Aplicativo de Mapeamento de Zonas de Risco Utilizando Geolocalização para Otimização da Segurança Urbana.

![Badge Concluído](http://img.shields.io/static/v1?label=STATUS&message=CONCLUÍDO&color=GREEN&style=for-the-badge)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)

---

## 📋 Sobre o Projeto

O **GeoRisk** é uma solução mobile desenvolvida para mitigar a exposição de usuários a áreas de alta criminalidade em centros urbanos. Diferente dos navegadores GPS tradicionais que priorizam apenas a rapidez, o GeoRisk prioriza a **segurança**.

O sistema utiliza um algoritmo geométrico para analisar rotas sugeridas e alertar o usuário caso o trajeto cruze zonas de risco mapeadas. A base de dados é alimentada de forma colaborativa (crowdsourcing) e automatizada (Web Scraping de notícias locais).

---

## 🚀 Funcionalidades Principais

### 📱 Aplicativo Mobile (React Native)
* **Mapa Interativo:** Visualização de zonas de risco (círculos vermelhos) sobre o Google Maps.
* **Monitoramento em Tempo Real:** Alerta vibratório e visual ao entrar em um raio de perigo (Fórmula de Haversine).
* **Rota Segura:** Análise matemática de rotas que verifica interseções com zonas de crime antes do início do trajeto.
* **Crowdsourcing:** Usuários podem reportar crimes (Roubo, Furto, etc.) diretamente no mapa.
* **Modo Waze (3D):** Navegação com câmera inclinada seguindo a bússola do dispositivo.
* **Painel Administrativo:** Moderação de denúncias (Aprovar/Rejeitar) integrada ao app.

---

## 🛠️ Tecnologias Utilizadas

### Front-end (Mobile)
-   [React Native](https://reactnative.dev/) (Expo Framework)
-   [React Native Maps](https://github.com/react-native-maps/react-native-maps) (Google Maps)
-   [React Native Paper](https://callstack.github.io/react-native-paper/) (UI Library)
-   [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) & [Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)

### Back-end & Dados
-   [Firebase Firestore](https://firebase.google.com/) (Banco de Dados NoSQL em Tempo Real)
-   [Firebase Authentication](https://firebase.google.com/docs/auth) (Login e Registro)

---

## ⚙️ Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
* Aplicativo **Expo Go** no celular ou emulador Android (Android Studio).

---

## 🔐 Configuração das Variáveis de Ambiente

Este projeto utiliza chaves de API sensíveis (Firebase e Google Maps) que não são versionadas no repositório por questões de segurança. Para executar o projeto localmente, você precisará configurar um arquivo .env 

### Passo a Passo:
#### 1. Na raiz do projeto, crie um arquivo chamado .env.
#### 2. Copie o conteúdo abaixo e cole dentro deste arquivo.
#### 3. Substitua os valores sua_chave_aqui pelas credenciais do seu projeto no Firebase Console e Google Cloud Console.

```bash
# Configurações do Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key_do_firebase
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=id-do-seu-projeto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Configuração do Google Maps
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_api_google_maps
```
---

## 🔧 Instalação e Execução

### 1. Clonar o Repositório
```bash
git clone [https://github.com/seu-usuario/georisk-tcc.git](https://github.com/seu-usuario/georisk-tcc.git)
```
### 2. Instalar depêndencias
```bash
npm install
npm install firebase
npm audit fix --force
npx expo install expo-notifications
npx expo prebuild
```
### 3. Rodar aplicação
```bash
npx expo run:android
```
