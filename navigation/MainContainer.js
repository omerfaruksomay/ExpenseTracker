import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import ExpensesScreen from './screens/ExpensesScreen';
import CurrencyRaitingsScreen from './screens/CurrencyRaitingsScreen';

const Tab = createBottomTabNavigator();

const ExpenseTrackerScreen = () => (
    <ExpensesScreen />
);

const CurrencyExchangeScreen = () => (
    <CurrencyRaitingsScreen />
);

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Expenses') {
                            iconName = focused ? 'wallet' : 'wallet-outline';
                        } else if (route.name === 'Currency Exchange') {
                            iconName = focused ? 'cash' : 'cash-outline';
                        }

                        // İkonu döndür
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'tomato', // Aktif sekmenin rengi
                    tabBarInactiveTintColor: 'gray', // Pasif sekmenin rengi
                })}
            >
                <Tab.Screen name="Expenses" component={ExpenseTrackerScreen} />
                <Tab.Screen name="Currency Exchange" component={CurrencyExchangeScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}


