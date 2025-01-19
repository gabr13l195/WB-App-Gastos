import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    Modal,
    ScrollView,
} from 'react-native';
import { auth, db } from '../config/Config';
import { ref, push, get, remove, update } from 'firebase/database';

export default function AñadirMascota() {
    const [mascotas, setMascotas] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedMascota, setSelectedMascota] = useState<any>(null);
    const [form, setForm] = useState({
        nombre: '',
        especie: '',
        raza: '',
        edad: '',
        dueño: '',
        contacto: '',
        historial: '',
    });

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
                }
            })
            .catch((error) => {
                Alert.alert('Error', `No se pudo cargar las mascotas: ${error.message}`);
            });
    }, [userId]);

    const handleAddOrEdit = () => {
        if (!form.nombre || !form.especie || !form.raza || !form.edad || !form.dueño || !form.contacto) {
            Alert.alert('Error', 'Por favor, llena todos los campos obligatorios.');
            return;
        }

        if (selectedMascota) {
            const mascotaRef = ref(db, `usuarios/${userId}/mascotas/${selectedMascota.id}`);
            update(mascotaRef, form)
                .then(() => {
                    Alert.alert('Éxito', 'Mascota actualizada correctamente.');
                    setMascotas((prev) =>
                        prev.map((m) => (m.id === selectedMascota.id ? { id: m.id, ...form } : m))
                    );
                    resetForm();
                })
                .catch((error) => {
                    Alert.alert('Error', `No se pudo actualizar la mascota: ${error.message}`);
                });
        } else {
            const mascotasRef = ref(db, `usuarios/${userId}/mascotas`);
            push(mascotasRef, form)
                .then(() => {
                    Alert.alert('Éxito', 'Mascota añadida correctamente.');
                    setMascotas((prev) => [...prev, { id: Date.now().toString(), ...form }]);
                    resetForm();
                })
                .catch((error) => {
                    Alert.alert('Error', `No se pudo añadir la mascota: ${error.message}`);
                });
        }
    };

    const handleDelete = (id: string) => {
        if (!userId) {
            Alert.alert('Error', 'Usuario no identificado.');
            return;
        }

        const mascotaRef = ref(db, `usuarios/${userId}/mascotas/${id}`);
        remove(mascotaRef)
            .then(() => {
                Alert.alert('Éxito', 'Mascota eliminada correctamente.');
                setMascotas((prev) => prev.filter((mascota) => mascota.id !== id));
            })
            .catch((error) => {
                Alert.alert('Error', `No se pudo eliminar la mascota: ${error.message}`);
            });
    };

    const resetForm = () => {
        setForm({
            nombre: '',
            especie: '',
            raza: '',
            edad: '',
            dueño: '',
            contacto: '',
            historial: '',
        });
        setSelectedMascota(null);
        setIsEditing(false);
    };

    const renderMascota = ({ item }: { item: any }) => (
        <View style={styles.mascotaItem}>
            <Text style={styles.mascotaNombre}>{item.nombre}</Text>
            <Text style={styles.mascotaDetalle}>Especie: {item.especie}</Text>
            <Text style={styles.mascotaDetalle}>Raza: {item.raza}</Text>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                    setSelectedMascota(item);
                    setForm(item);
                    setIsEditing(true);
                }}
            >
                <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
            >
                <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Añadir o Editar Mascotas</Text>
            <FlatList
                data={mascotas}
                renderItem={renderMascota}
                keyExtractor={(item) => item.id}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    resetForm();
                    setIsEditing(true);
                }}
            >
                <Text style={styles.addButtonText}>Añadir nueva mascota</Text>
            </TouchableOpacity>

            <Modal visible={isEditing} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {selectedMascota ? 'Editar Mascota' : 'Añadir Mascota'}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de la mascota"
                            placeholderTextColor="#555" // Cambia el color del texto del placeholder
                            value={form.nombre}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, nombre: text }))}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Especie (ej. Perro, Gato)"
                            placeholderTextColor="#555" // Cambia el color del texto del placeholder
                            value={form.especie}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, especie: text }))}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Raza (ej. Labrador, Siames)"
                            placeholderTextColor="#555" // Cambia el color del texto del placeholder
                            value={form.raza}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, raza: text }))}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Edad en años"
                            placeholderTextColor="#555" // Cambia el color del texto del placeholder
                            value={form.edad}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, edad: text }))}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del dueño"
                            placeholderTextColor="#555" // Cambia el color del texto del placeholder
                            value={form.dueño}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, dueño: text }))}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Contacto del dueño"
                            placeholderTextColor="#555" // Cambia el color del texto del placeholder
                            value={form.contacto}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, contacto: text }))}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            style={[styles.input, styles.historialInput]}
                            placeholder="Historial médico (opcional)"
                            placeholderTextColor="#555" // Cambia el color del texto del placeholder
                            value={form.historial}
                            onChangeText={(text) => setForm((prev) => ({ ...prev, historial: text }))}
                            multiline
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleAddOrEdit}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
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
        padding: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    mascotaNombre: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mascotaDetalle: {
        fontSize: 16,
        color: '#555',
    },
    editButton: {
        backgroundColor: '#153E90',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
    },
    deleteButton: {
        backgroundColor: '#FF5C5C',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
    },
    addButton: {
        backgroundColor: '#153E90',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        fontSize: 18,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    historialInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#54E346',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: '#FF5C5C',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});



