import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';

export default function CurrencyRaitingsScreen({ navigation }) {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [amountInTRY, setAmountInTRY] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const [convertedAmount, setConvertedAmount] = useState(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await axios.get(
                    'http://api.exchangeratesapi.io/v1/latest?access_key=f73ef10cb7fb88cdb7675f862cf4030d&symbols=TRY,USD,EUR,GBP,CNY,JPY,AED,RUB'
                );
                const data = response.data;

                const tryRate = data.rates.TRY;

                const ratesInTRY = Object.entries(data.rates)
                    .filter(([currency]) => currency !== 'TRY') // TRY'yi çıkarıyoruz
                    .map(([currency, rate]) => ({
                        currency,
                        rateInTRY: (tryRate / rate).toFixed(4),
                        rate,
                    }));

                setRates(ratesInTRY);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
    }, []);

    const handleConvert = () => {
        if (!amountInTRY || isNaN(amountInTRY)) {
            alert('Lütfen geçerli bir TL tutarı giriniz.');
            return;
        }

        // Seçilen para biriminin TL karşılığını al
        const selectedCurrencyRateInTRY = rates.find(
            (rate) => rate.currency === selectedCurrency
        )?.rateInTRY;

        if (!selectedCurrencyRateInTRY) {
            alert(`Seçilen para birimi (${selectedCurrency}) için döviz kuru bulunamadı.`);
            return;
        }

        // Hesaplama
        const amountInTargetCurrency = amountInTRY / selectedCurrencyRateInTRY;
        setConvertedAmount(amountInTargetCurrency.toFixed(2));
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
                    placeholder="TL Tutarını Giriniz"
                    keyboardType="numeric"
                    value={amountInTRY}
                    onChangeText={(text) => setAmountInTRY(text)}
                />
                <Dropdown
                    style={styles.dropdown}
                    data={rates.map((rate) => ({
                        label: rate.currency,
                        value: rate.currency,
                    }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Para Birimi Seçin"
                    value={selectedCurrency}
                    onChange={(item) => setSelectedCurrency(item.value)}
                />
                <Button title="Hesapla" onPress={handleConvert} />
                {convertedAmount && (
                    <Text style={styles.result}>
                        {amountInTRY} TL ≈ {convertedAmount} {selectedCurrency}
                    </Text>
                )}
            </View>
            <FlatList
                data={rates}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.currency}>{item.currency}</Text>
                        <Text style={styles.rate}>{item.rateInTRY} TRY</Text>
                    </View>
                )}
                keyExtractor={(item) => item.currency}
                contentContainerStyle={styles.list}
            />
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
    dropdown: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 10,
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
});
