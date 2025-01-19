import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen} 
                options={{headerShown:false}}/>
            <Stack.Screen
                name="Login"
                component={LoginScreen} 
                options={{headerShown:false}}/>
            <Stack.Screen
                name="Registro"
                component={RegisterScreen}
                options={{headerShown:false}}/>
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen} 
                options={{headerShown:false}}/>
        </Stack.Navigator>
    );
}

export default function Navegador() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}


