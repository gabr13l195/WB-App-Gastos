import { Alert, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';

export default function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>

            <Image
                source={require('../assets/tienda-animales.png')} // Cambia la URL por la ubicación local de tu imagen
                style={styles.logo}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Registro')}
            >
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>Desarrollado por Wilmer Betancourt</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 40,
    },
    button: {
        width: '80%',
        padding: 10,
        backgroundColor: '#153E90',
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        fontSize: 14,
        color: '#888',
        position: 'absolute',
        bottom: 20,
    },
});

