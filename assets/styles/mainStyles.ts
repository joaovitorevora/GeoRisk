// assets/styles/mainStyles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    map: { flex: 1, width: '100%' },
    infoBox: { position: 'absolute', top: 120, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 8, zIndex: 10 },
    adminIconContainer: { position: 'absolute', top: 130, right: 20, zIndex: 10 },
    bottomLeftContainer: { position: 'absolute', bottom: 20, left: 20, zIndex: 10 },
    bottomRightContainer: { position: 'absolute', bottom: 20, right: 20, zIndex: 10, flexDirection: 'row-reverse', alignItems: 'center' },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 80, backgroundColor: '#6200ee' },
    iconButton: { backgroundColor: '#6200ee', marginLeft: 8 },
});

export default styles;