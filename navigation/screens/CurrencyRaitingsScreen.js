import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';

export default function CurrencyRaitingsScreen({ navigation }) {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await axios.get(
                    "http://api.exchangeratesapi.io/v1/latest?access_key=f73ef10cb7fb88cdb7675f862cf4030d&symbols=TRY,USD,EUR,GBP,CNY,JPY,AED,RUB"
                );
                const data = response.data;

                const tryRate = data.rates.TRY;

                // TRY oranını kullanarak diğer para birimlerinin TRY karşılığını hesaplayın
                const ratesInTRY = Object.entries(data.rates).map(([currency, rate]) => ({
                    currency,
                    rateInTRY: (tryRate / rate).toFixed(4), // TRY'ye göre karşılık
                }));

                setRates(ratesInTRY);
            } catch (error) {
                console.error("Error fetching exchange rates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <Text style={styles.currency}> {item.currency}</Text>
                <Text style={styles.rate}>{item.rateInTRY} TRY</Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={rates?.slice(1)}
                renderItem={renderItem}
                keyExtractor={(item) => item.currency}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 16,
        paddingTop: 32,
    },
    list: {
        paddingBottom: 16,
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    currency: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    rate: {
        fontSize: 18,
        fontWeight: "400",
        color: "#666",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
