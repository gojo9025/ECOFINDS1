import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import type { Product, AppContextType } from '../types';
import { COLORS, SIZES, SPACING } from '../theme';

export const ProductDetailScreen: React.FC = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { getProductById, addToCart, user } = useContext(AppContext) as AppContextType;
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (route.params?.id) {
            const foundProduct = getProductById(route.params.id);
            if(foundProduct) {
                setProduct(foundProduct);
                navigation.setOptions({ title: foundProduct.title });
            } else {
               navigation.goBack();
            }
        }
    }, [route.params?.id, getProductById, navigation]);

    if (!product) {
        return (
            <View style={styles.loaderContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const handleAddToCart = () => {
        if (!user) {
            navigation.navigate('Login');
            return;
        }
        addToCart(product);
        Alert.alert("Success", `${product.title} has been added to your cart.`);
    };

    const isOwnListing = user?.id === product.sellerId;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView style={styles.container}>
                <Image source={{ uri: product.imageUrl }} style={styles.image} />
                <View style={styles.detailsContainer}>
                    <View style={styles.categoryContainer}>
                        <Text style={styles.categoryText}>{product.category}</Text>
                    </View>
                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    <View style={styles.divider} />
                    <Text style={styles.description}>{product.description}</Text>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    onPress={handleAddToCart}
                    style={[styles.button, isOwnListing && styles.disabledButton]}
                    disabled={isOwnListing}
                >
                    <Text style={styles.buttonText}>
                        {isOwnListing ? "This is your listing" : "Add to Cart"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
    },
    detailsContainer: {
        padding: SPACING[5],
    },
    categoryContainer: {
        backgroundColor: COLORS.primary[100],
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[1],
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    categoryText: {
        color: COLORS.primary[700],
        fontWeight: 'bold',
        fontSize: SIZES.sm,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: SIZES['3xl'],
        fontWeight: '800',
        color: COLORS.neutral[900],
        marginVertical: SPACING[3],
    },
    price: {
        fontSize: SIZES['2xl'],
        fontWeight: 'bold',
        color: COLORS.neutral[800],
        marginBottom: SPACING[4],
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.neutral[200],
        marginVertical: SPACING[4],
    },
    description: {
        fontSize: SIZES.base,
        color: COLORS.neutral[600],
        lineHeight: 24,
    },
    buttonContainer: {
        padding: SPACING[4],
        borderTopWidth: 1,
        borderTopColor: COLORS.neutral[200],
        backgroundColor: COLORS.white,
    },
    button: {
        backgroundColor: COLORS.primary[600],
        padding: SPACING[4],
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: COLORS.neutral[300],
    },
    buttonText: {
        color: COLORS.white,
        fontSize: SIZES.lg,
        fontWeight: '600',
    },
});
