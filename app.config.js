require('dotenv').config();

module.exports = {
  expo: {
    name: "GeoRisk",
    slug: "GeoRisk",
    version: "1.0.0",
    runtimeVersion: "1.0.0", 
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    updates: {
      url: "https://u.expo.dev/7c656417-3f80-4323-b927-1e943203c99b"
    },

    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Este app precisa da sua localização para mostrar sua posição no mapa."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ],
      package: "com.joaovevora.GeoRisk",
      versionCode: 1,
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "7c656417-3f80-4323-b927-1e943203c99b"
      }
    }
  }
};