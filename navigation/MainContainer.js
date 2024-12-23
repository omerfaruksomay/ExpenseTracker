import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import ExpensesScreen from './screens/ExpensesScreen';
import CurrencyRaitingsScreen from './screens/CurrencyRaitingsScreen';
import IncomeScreen from './screens/IncomeScreen';
import ChartScreen from './screens/ChartScreen';

const Tab = createBottomTabNavigator();



export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Expenses') { //expense icon
                            iconName = focused ? 'wallet' : 'wallet-outline';
                        } else if (route.name === 'Currency Exchange') { //currency icon
                            iconName = focused ? 'cash' : 'cash-outline';
                        } else if (route.name === 'Incomes') { // Income icon
                            iconName = focused ? 'trending-up' : 'trending-up-outline';
                        } else if (route.name === 'Chart') { //chart icon
                            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
                        }

                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name="Expenses" component={ExpensesScreen} />
                <Tab.Screen name="Incomes" component={IncomeScreen} />
                <Tab.Screen name="Chart" component={ChartScreen} />
                <Tab.Screen name="Currency Exchange" component={CurrencyRaitingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}


