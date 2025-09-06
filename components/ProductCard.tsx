import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { Product } from '../types';
import { COLORS, SIZES, SPACING, FONTS } from '../theme';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigation = useNavigation<any>();

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
        >
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.category}>{product.category}</Text>
                <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.neutral[200],
        margin: SPACING[1],
    },
    image: {
        width: '100%',
        height: 140,
    },
    infoContainer: {
        padding: SPACING[3],
    },
    category: {
        fontSize: SIZES.xs,
        color: COLORS.primary[600],
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: SPACING[1],
    },
    title: {
        fontSize: SIZES.base,
        fontWeight: 'bold',
        color: COLORS.neutral[800],
        marginBottom: SPACING[1],
    },
    price: {
        fontSize: SIZES.lg,
        fontWeight: '800',
        color: COLORS.neutral[900],
    },
});
