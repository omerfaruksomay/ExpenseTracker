import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IncomeScreen() {
    const [incomes, setIncomes] = useState([]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // AsyncStorage'den gelirleri yükle
    useEffect(() => {
        const loadIncomes = async () => {
            try {
                const storedIncomes = await AsyncStorage.getItem('incomes');
                if (storedIncomes) {
                    setIncomes(JSON.parse(storedIncomes));
                }
            } catch (error) {
                console.error('Error loading incomes:', error);
            }
        };
        loadIncomes();
    }, []);

    // Gelir ekleme
    const addIncome = async () => {
        if (title && amount) {
            const newIncome = { id: Date.now().toString(), title, amount: parseFloat(amount) };
            const updatedIncomes = [...incomes, newIncome];

            try {
                await AsyncStorage.setItem('incomes', JSON.stringify(updatedIncomes));
                setIncomes(updatedIncomes);
                setTitle('');
                setAmount('');
            } catch (error) {
                console.error('Error saving income:', error);
            }
        }
    };

    // Gelir silme
    const deleteIncome = async (id) => {
        const updatedIncomes = incomes.filter(income => income.id !== id);

        try {
            await AsyncStorage.setItem('incomes', JSON.stringify(updatedIncomes));
            setIncomes(updatedIncomes);
        } catch (error) {
            console.error('Error deleting income:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.scrollContainer}>
            <View style={styles.calculatorContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Income Name"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
                <Button title="Add Income" onPress={addIncome} />
            </View>

            {incomes.length > 0 ? (
                <FlatList
                    data={incomes}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardText}>
                                <Text style={styles.currency}>{item.title}</Text>
                                <Text style={styles.rate}>{item.amount} TL</Text>
                            </View>
                            <TouchableOpacity onPress={() => deleteIncome(item.id)}>
                                <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={styles.noIncomes}>You haven't added any Incomes yet.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingTop: 32,
    },
    list: {
        paddingBottom: 16,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardText: {
        flex: 1,
    },
    currency: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    rate: {
        fontSize: 18,
        fontWeight: '400',
        color: '#666',
    },
    deleteText: {
        color: 'red',
        fontSize: 16,
        fontWeight: '500',
    },
    calculatorContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 10,
        fontSize: 18,
        marginBottom: 16,
    },
    result: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noIncomes: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
});
