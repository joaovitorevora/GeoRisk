//botões que ficam sobre o mapa
import React from 'react';
import { View } from 'react-native';
import { Menu, Button, IconButton, FAB } from 'react-native-paper';
import styles from '../assets/styles/mainStyles';

// Definimos as propriedades que este componente espera receber
interface MapControlsProps {
  userRole: string | null;
  isReporting: boolean;
  onReportPress: () => void;
  menuVisible: boolean;
  onMenuDismiss: () => void;
  onMenuOpen: () => void;
  tipoSelecionado: string | null;
  tiposUnicos: string[];
  onFilterChange: (tipo: string | null) => void;
  onLogout: () => void;
  toggleModoWaze: () => void;
  modoWaze: boolean;
  toggleModoNoturno: () => void;
  modoNoturno: boolean;
}

export default function MapControls({
  userRole,
  isReporting,
  onReportPress,
  menuVisible,
  onMenuDismiss,
  onMenuOpen,
  tipoSelecionado,
  tiposUnicos,
  onFilterChange,
  onLogout,
  toggleModoWaze,
  modoWaze,
  toggleModoNoturno,
  modoNoturno
}: MapControlsProps) {
  return (
    <>
      <View style={styles.bottomLeftContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={onMenuDismiss}
          anchor={
            <Button mode="contained" icon="filter-variant" onPress={onMenuOpen} style={{ borderRadius: 30 }} compact>
              {tipoSelecionado ? tipoSelecionado.charAt(0).toUpperCase() + tipoSelecionado.slice(1) : 'Todos'}
            </Button>
          }
        >
          <Menu.Item onPress={() => onFilterChange(null)} title="Todos" />
          {tiposUnicos.map((tipo) => (
            <Menu.Item key={tipo} onPress={() => onFilterChange(tipo)} title={tipo.charAt(0).toUpperCase() + tipo.slice(1)} />
          ))}
        </Menu>
      </View>

      {userRole === 'user' && (
        <FAB
          style={styles.fab}
          icon={isReporting ? "cancel" : "plus"}
          label={isReporting ? "Cancelar" : "Denunciar"}
          color="white"
          onPress={onReportPress}
        />
      )}

      <View style={styles.bottomRightContainer}>
        <IconButton icon="logout" size={28} onPress={onLogout} mode="contained" style={styles.iconButton} iconColor="#fff" />
        <IconButton icon={modoWaze ? 'satellite-variant' : 'car'} size={28} onPress={toggleModoWaze} mode="contained" style={styles.iconButton} iconColor="#fff" />
        <IconButton icon={modoNoturno ? 'weather-night' : 'white-balance-sunny'} size={28} onPress={toggleModoNoturno} mode="contained" style={styles.iconButton} iconColor="#fff" />
      </View>
    </>
  );
}