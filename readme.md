# 🛡️ GeoRisk - Aplicativo de Mapeamento de Zonas de Risco

> **Trabalho de Conclusão de Curso (TCC)**
> **Tema:** Aplicativo de Mapeamento de Zonas de Risco Utilizando Geolocalização para Otimização da Segurança Urbana.

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)
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

### 🕷️ Web Scraper (Golang)
* **Coleta Automatizada:** Robô que lê portais de notícias locais (ex: Gazeta de Limeira).
* **NLP Simples:** Classificação automática do tipo de crime baseada em palavras-chave.
* **Geocodificação:** Conversão de endereços textuais em coordenadas (Lat/Long) via API Nominatim.
* **Integração Firebase:** Inserção automática de novas zonas de risco no banco de dados.

---

## 🛠️ Tecnologias Utilizadas

### Front-end (Mobile)
-   [React Native](https://reactnative.dev/) (Expo Framework)
-   [TypeScript](https://www.typescriptlang.org/)
-   [React Native Maps](https://github.com/react-native-maps/react-native-maps) (Google Maps)
-   [React Native Paper](https://callstack.github.io/react-native-paper/) (UI Library)
-   [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) & [Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)

### Back-end & Dados
-   [Firebase Firestore](https://firebase.google.com/) (Banco de Dados NoSQL em Tempo Real)
-   [Firebase Authentication](https://firebase.google.com/docs/auth) (Login e Registro)

### Data Science / Scraping
-   [Go (Golang)](https://go.dev/)
-   [GoQuery](https://github.com/PuerkitoBio/goquery) (Parser HTML)

---

## ⚙️ Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
* [Go](https://go.dev/dl/) (apenas para rodar o scraper)
* Aplicativo **Expo Go** no celular ou emulador Android/iOS.

---

## 🔧 Instalação e Execução

### 1. Clonar o Repositório
```bash
git clone [https://github.com/seu-usuario/georisk-tcc.git](https://github.com/seu-usuario/georisk-tcc.git)