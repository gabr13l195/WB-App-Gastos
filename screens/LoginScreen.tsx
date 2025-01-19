import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image } from 'react-native';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/Config';
import { ref, get } from 'firebase/database';

export default function LoginScreen({ navigation }: any) {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');

    function login() {
        if (!correo || !contraseña) {
            Alert.alert('Error', 'Por favor, llena todos los campos.');
            return;
        }

        signInWithEmailAndPassword(auth, correo, contraseña)
            .then(() => {
                const usuariosRef = ref(db, 'usuarios');
                get(usuariosRef)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const usuarios = snapshot.val();
                            const cedulaUsuario = Object.keys(usuarios).find(
                                (cedula) => usuarios[cedula].correo === correo
                            );

                            if (cedulaUsuario) {
                                navigation.navigate('Welcome', { cedula: cedulaUsuario });
                            } else {
                                Alert.alert('Error', 'No se encontró la cédula del usuario.');
                            }
                        } else {
                            Alert.alert('Error', 'No hay usuarios registrados.');
                        }
                    })
                    .catch((error) => {
                        Alert.alert('Error', error.message);
                    });
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-email') {
                    Alert.alert('Error', 'Correo electrónico inválido.');
                } else if (error.code === 'auth/wrong-password') {
                    Alert.alert('Error', 'Contraseña incorrecta.');
                } else {
                    Alert.alert('Error', 'Hubo un problema al iniciar sesión. Intenta de nuevo.');
                }
            });
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Iniciar Sesión</Text>

                {/* Imagen añadida */}
                <Image
                    source={require('../assets/huella.png')} // Asegúrate de que la ruta sea correcta
                    style={styles.image}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    onChangeText={(texto) => setCorreo(texto)}
                    value={correo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#555"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    onChangeText={(texto) => setContraseña(texto)}
                    value={contraseña}
                    secureTextEntry
                    placeholderTextColor="#555"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={login}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                    <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    image: {
        width: 100, // Ajusta el tamaño de la imagen
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
    },
    input: {
        fontSize: 18,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#153E90',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#153E90',
        textAlign: 'center',
        marginTop: 20,
    },
});


