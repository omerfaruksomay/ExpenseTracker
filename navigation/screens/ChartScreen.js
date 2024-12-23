import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const ChartScreen = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const storedExpenses = await AsyncStorage.getItem('expenses');
            const storedIncomes = await AsyncStorage.getItem('incomes');

            const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
            const incomes = storedIncomes ? JSON.parse(storedIncomes) : [];

            const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
            const totalIncomes = incomes.reduce((sum, item) => sum + item.amount, 0);

            setData([
                {
                    name: 'Gelirler',
                    amount: totalIncomes,
                    color: '#4CAF50',
                    legendFontColor: '#333',
                    legendFontSize: 15,
                },
                {
                    name: 'Giderler',
                    amount: totalExpenses,
                    color: '#F44336',
                    legendFontColor: '#333',
                    legendFontSize: 15,
                },
            ]);
        } catch (error) {
            console.error('Error loading chart data:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Gelir ve Gider Grafiği</Text>
            <PieChart
                data={data}
                width={Dimensions.get('window').width - 32}
                height={220}
                chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={'amount'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                absolute
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChartScreen;
