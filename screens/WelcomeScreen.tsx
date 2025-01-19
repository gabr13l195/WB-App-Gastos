import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HistorialScreen from './AñadirMascota';
import Perfil from './Perfil';
import Mascotas from './Mascotas';

const Tab = createBottomTabNavigator();

export default function WelcomeScreen({ route }: any) {
    const { cedula } = route.params;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false, // Oculta la barra superior para todas las pestañas
            }}
        >
            <Tab.Screen
                name="Mascotas"
                component={Mascotas}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="paw-sharp" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Añadir"
                component={HistorialScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Perfil"
                component={Perfil}
                initialParams={{ cedula }}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
