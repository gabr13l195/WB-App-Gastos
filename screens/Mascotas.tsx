import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native';
import { auth, db } from '../config/Config';
import { ref, get } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

export default function Mascotas() {
    const [mascotas, setMascotas] = useState<any[]>([]);

    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userId) return;

        const mascotasRef = ref(db, `usuarios/${userId}/mascotas`);
        get(mascotasRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const mascotasData = snapshot.val();
                    const mascotasArray = Object.keys(mascotasData).map((key) => ({
                        id: key,
                        ...mascotasData[key],
                    }));
                    setMascotas(mascotasArray);
                } else {
                    setMascotas([]);
                }
            })
            .catch((error) => {
                Alert.alert('Error', `No se pudo cargar las mascotas: ${error.message}`);
            });
    }, [userId]);

    const renderMascota = ({ item }: { item: any }) => (
        <View style={styles.mascotaItem}>
            <Ionicons name="paw" size={40} color="#333" style={styles.icon} />
            <View>
                <Text style={styles.mascotaNombre}>{item.nombre}</Text>
                <Text style={styles.mascotaRaza}>Raza: {item.raza}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Mascotas</Text>
            {mascotas.length > 0 ? (
                <FlatList
                    data={mascotas}
                    renderItem={renderMascota}
                    keyExtractor={(item) => item.id}
                />
            ) : (
                <Text style={styles.noMascotasText}>No tienes mascotas registradas.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    mascotaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    icon: {
        marginRight: 15,
    },
    mascotaNombre: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mascotaRaza: {
        fontSize: 16,
        color: '#555',
    },
    noMascotasText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
});
