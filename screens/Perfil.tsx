import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { ref, get, update } from 'firebase/database';
import { auth, db } from '../config/Config';

export default function PerfilScreen({ navigation }: any) {
    const [userData, setUserData] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [ciudad, setCiudad] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;

                if (user && user.email) {
                    const usuariosRef = ref(db, 'usuarios');
                    const snapshot = await get(usuariosRef);

                    if (snapshot.exists()) {
                        const usuarios = snapshot.val();
                        const userCedula = Object.keys(usuarios).find(
                            (cedula) => usuarios[cedula].correo === user.email
                        );

                        if (userCedula) {
                            const data = {
                                ...usuarios[userCedula],
                                cedula: userCedula,
                            };
                            setUserData(data);
                            setNombre(data.nombre);
                            setEdad(data.edad.toString());
                            setCiudad(data.ciudad);
                        } else {
                            Alert.alert('Error', 'No se encontró información del usuario.');
                        }
                    } else {
                        Alert.alert('Error', 'No hay usuarios registrados en la base de datos.');
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Hubo un problema al obtener los datos del usuario.');
            }
        };

        fetchUserData();
    }, []);

    const handleUpdate = async () => {
        if (!nombre || !edad || !ciudad) {
            Alert.alert('Error', 'Por favor, llena todos los campos.');
            return;
        }

        const edadNumerica = parseInt(edad, 10);
        if (isNaN(edadNumerica) || edadNumerica < 1 || edadNumerica > 100) {
            Alert.alert('Error', 'La edad debe ser un número entre 1 y 100.');
            return;
        }

        try {
            const userRef = ref(db, `usuarios/${userData.cedula}`);
            await update(userRef, {
                nombre,
                edad: edadNumerica,
                ciudad,
            });
            Alert.alert('Éxito', 'Perfil actualizado correctamente.');
            setUserData((prev: any) => ({ ...prev, nombre, edad: edadNumerica, ciudad }));
            setIsEditing(false);
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al actualizar el perfil.');
        }
    };

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                navigation.replace('Login');
            })
            .catch((error) => {
                Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
            });
    };

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando información del usuario...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Nombre: </Text>
                    {userData.nombre}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Correo: </Text>
                    {userData.correo}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Edad: </Text>
                    {userData.edad}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Ciudad: </Text>
                    {userData.ciudad}
                </Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Cédula: </Text>
                    {userData.cedula}
                </Text>
            </View>

            {/* Botón para editar perfil */}
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Editar perfil</Text>
            </TouchableOpacity>

            {/* Botón para cerrar sesión */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>

            {/* Modal para editar perfil */}
            <Modal visible={isEditing} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Perfil</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            value={nombre}
                            onChangeText={setNombre}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Edad"
                            value={edad}
                            onChangeText={setEdad}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Ciudad"
                            value={ciudad}
                            onChangeText={setCiudad}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                            <Text style={styles.buttonText}>Guardar cambios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    infoContainer: {
        backgroundColor: '#AAD3DF',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        width: '100%',
        marginBottom: 20,
    },
    infoText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#555',
    },
    label: {
        fontWeight: 'bold',
        color: '#000',
    },
    loadingText: {
        fontSize: 18,
        color: '#777',
    },
    logoutButton: {
        backgroundColor: '#FF5C5C',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    editButton: {
        backgroundColor: '#153E90',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    buttonText: {
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
});
