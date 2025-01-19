import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/Config';
import { ref, set } from 'firebase/database';

export default function RegisterScreen({ navigation }: any) {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [cedula, setCedula] = useState('');

    function register() {
        if (!correo || !contraseña || !nombre || !edad || !ciudad || !cedula) {
            Alert.alert('Error', 'Por favor, llena todos los campos.');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(correo)) {
            Alert.alert('Error', 'Correo electrónico inválido.');
            return;
        }

        const edadNum = parseInt(edad, 10);
        if (isNaN(edadNum) || edadNum < 1 || edadNum > 100) {
            Alert.alert('Error', 'La edad debe ser un número entre 1 y 100.');
            return;
        }

        createUserWithEmailAndPassword(auth, correo, contraseña)
            .then((userCredential) => {
                const user = userCredential.user;
                const usuariosRef = ref(db, 'usuarios/' + cedula);
                set(usuariosRef, {
                    nombre,
                    edad: edadNum,
                    ciudad,
                    correo,
                })
                    .then(() => {
                        Alert.alert('Éxito', 'Usuario registrado exitosamente');
                        navigation.navigate('Login');
                    })
                    .catch((error) => {
                        Alert.alert('Error', 'Hubo un problema al registrar al usuario: ' + error.message);
                    });
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    Alert.alert('Error', 'El correo electrónico ya está en uso.');
                } else {
                    Alert.alert('Error', 'Hubo un problema al registrar al usuario: ' + error.message);
                }
            });
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Registro</Text>
                <Image
                    source={require('../assets/dinero.png')} 
                    style={styles.image}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    onChangeText={(texto) => setNombre(texto)}
                    value={nombre}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Cédula"
                    onChangeText={(texto) => setCedula(texto)}
                    value={cedula}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Edad"
                    onChangeText={(texto) => setEdad(texto)}
                    value={edad}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ciudad"
                    onChangeText={(texto) => setCiudad(texto)}
                    value={ciudad}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    onChangeText={(texto) => setCorreo(texto)}
                    value={correo}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    onChangeText={(texto) => setContraseña(texto)}
                    value={contraseña}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={register}
                >
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>Ya tienes cuenta? Inicia sesión aquí</Text>
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
    image: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
    }
});


