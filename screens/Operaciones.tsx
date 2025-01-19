import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { auth, db } from '../config/Config';
import { ref, push } from 'firebase/database';
import { Picker } from '@react-native-picker/picker';

export default function Operaciones() {
    const [form, setForm] = useState({
        precio: '',
        tipoGasto: 'Transporte',
        descripcion: '',
        cantidad: '',
    });

    const userId = auth.currentUser?.uid;

    const formatPrecio = (value: string) => {
        // Reemplazar comas por puntos y eliminar caracteres no numéricos (excepto el punto)
        const cleanedValue = value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
        // Convertir a número y limitar a dos decimales
        const formattedValue = parseFloat(cleanedValue).toFixed(2);
        return isNaN(Number(formattedValue)) ? '' : `$${formattedValue}`;
    };


    const handleAddOperacion = () => {
        if (!userId) {
            Alert.alert('Error', 'Usuario no autenticado.');
            return;
        }

        if (!form.precio || !form.descripcion || !form.cantidad) {
            Alert.alert('Error', 'Por favor, llena todos los campos.');
            return;
        }

        // Validar que precio y cantidad sean valores numéricos positivos
        const precioNumerico = parseFloat(form.precio.replace('$', ''));
        const cantidadNumerica = parseInt(form.cantidad, 10);

        if (isNaN(precioNumerico) || precioNumerico <= 0) {
            Alert.alert('Error', 'El precio debe ser un número válido y mayor que 0.');
            return;
        }

        if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
            Alert.alert('Error', 'La cantidad debe ser un número entero mayor que 0.');
            return;
        }

        // Validar montos menores a $1 o mayores a $20
        if (precioNumerico < 1 || precioNumerico > 20) {
            Alert.alert(
                'Advertencia',
                `El monto es ${precioNumerico < 1 ? 'menor a $1' : 'mayor a $20'}. ¿Deseas continuar?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Continuar', onPress: () => saveOperacion(precioNumerico, cantidadNumerica) },
                ]
            );
            return;
        }

        saveOperacion(precioNumerico, cantidadNumerica);
    };

    const saveOperacion = (precio: number, cantidad: number) => {
        const operacionesRef = ref(db, `usuarios/${userId}/operaciones`);
        push(operacionesRef, {
            ...form,
            precio: precio.toFixed(2), // Guardar el precio con dos decimales
            cantidad: cantidad,
        })
            .then(() => {
                Alert.alert('Éxito', 'Operación añadida correctamente.');
                setForm({ precio: '', tipoGasto: 'Transporte', descripcion: '', cantidad: '' });
            })
            .catch((error) => {
                Alert.alert('Error', `No se pudo añadir la operación: ${error.message}`);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Operaciones</Text>
            <TextInput
                style={styles.input}
                placeholder="Precio"
                placeholderTextColor="#555"
                keyboardType="decimal-pad"
                value={form.precio}
                onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, precio: text.replace(',', '.') })) // Reemplazar coma por punto
                }
                onBlur={() =>
                    setForm((prev) => ({ ...prev, precio: formatPrecio(prev.precio) }))
                }
            />

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={form.tipoGasto}
                    onValueChange={(itemValue) =>
                        setForm((prev) => ({ ...prev, tipoGasto: itemValue }))
                    }
                >
                    <Picker.Item label="Transporte" value="Transporte" />
                    <Picker.Item label="Alimentación" value="Alimentación" />
                    <Picker.Item label="Compras" value="Compras" />
                    <Picker.Item label="Salud" value="Salud" />
                    <Picker.Item label="Varios" value="Varios" />
                </Picker>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Descripción"
                placeholderTextColor="#555"
                value={form.descripcion}
                onChangeText={(text) => setForm((prev) => ({ ...prev, descripcion: text }))}
            />
            <TextInput
                style={styles.input}
                placeholder="Cantidad"
                placeholderTextColor="#555"
                keyboardType="numeric"
                value={form.cantidad}
                onChangeText={(text) => setForm((prev) => ({ ...prev, cantidad: text }))}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddOperacion}>
                <Text style={styles.addButtonText}>Añadir</Text>
            </TouchableOpacity>
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
    input: {
        fontSize: 18,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    pickerContainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        overflow: 'hidden',
    },
    addButton: {
        backgroundColor: '#153E90',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
