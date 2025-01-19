import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../config/Config';
import { ref, get } from 'firebase/database';

export default function Historial() {
    const [operaciones, setOperaciones] = useState<any[]>([]);

    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userId) return;

        const operacionesRef = ref(db, `usuarios/${userId}/operaciones`);
        get(operacionesRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const operacionesData = snapshot.val();
                    const operacionesArray = Object.keys(operacionesData).map((key) => ({
                        id: key,
                        ...operacionesData[key],
                    }));
                    setOperaciones(operacionesArray);
                } else {
                    setOperaciones([]);
                }
            })
            .catch((error) => {
                Alert.alert('Error', `No se pudo cargar el historial: ${error.message}`);
            });
    }, [userId]);

    const renderOperacion = ({ item }: { item: any }) => (
        <View style={styles.operacionItem}>
            <Text style={styles.operacionText}>
                <Text style={styles.label}>Precio: </Text>${item.precio}
            </Text>
            <Text style={styles.operacionText}>
                <Text style={styles.label}>Tipo: </Text>{item.tipoGasto}
            </Text>
            <Text style={styles.operacionText}>
                <Text style={styles.label}>Descripción: </Text>{item.descripcion}
            </Text>
            <Text style={styles.operacionText}>
                <Text style={styles.label}>Cantidad: </Text>{item.cantidad}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial de Operaciones</Text>
            <FlatList
                data={operaciones}
                renderItem={renderOperacion}
                keyExtractor={(item) => item.id}
            />
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
    operacionItem: {
        padding: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    operacionText: {
        fontSize: 18,
        marginBottom: 5,
        color: '#555',
    },
    label: {
        fontWeight: 'bold',
        color: '#000',
    },
});
