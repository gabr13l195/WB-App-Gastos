import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Historial from './Historial';
import Perfil from './Perfil';
import Operaciones from './Operaciones';

const Tab = createBottomTabNavigator();

export default function WelcomeScreen({ route }: any) {
    const { cedula } = route.params;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false, 
            }}
        >
            <Tab.Screen
                name="Operaciones"
                component={Operaciones}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cash-sharp" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Historial"
                component={Historial}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="podium-sharp" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="Perfil"
                component={Perfil}
                initialParams={{ cedula }}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-sharp" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
