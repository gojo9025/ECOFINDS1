import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { TrashIcon } from '../components/icons';
import type { AppContextType, CartItem } from '../types';
import { COLORS, SIZES, SPACING } from '../theme';

export const CartScreen: React.FC = () => {
    const { cart, removeFromCart, checkout } = useContext(AppContext) as AppContextType;
    const navigation = useNavigation<any>();

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);

    const handleCheckout = async () => {
        try {
            await checkout();
            Alert.alert(
                'Purchase Successful!',
                'Your order has been placed.',
                [{ text: 'OK', onPress: () => navigation.navigate('Purchases') }]
            );
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'There was an issue with your purchase.');
        }
    };

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
                <TrashIcon color={COLORS.red} />
            </TouchableOpacity>
        </View>
    );

    if (cart.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your cart is empty.</Text>
                <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.shopButtonText}>Continue Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={cart}
                renderItem={renderCartItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                ListHeaderComponent={<Text style={styles.headerTitle}>My Cart</Text>}
            />
            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>Subtotal</Text>
                    <Text style={styles.summaryText}>${cartTotal.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalText}>${cartTotal.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.neutral[100] },
    listContainer: { padding: SPACING[4] },
    headerTitle: { fontSize: SIZES['3xl'], fontWeight: '800', color: COLORS.neutral[800], marginBottom: SPACING[4] },
    itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: SPACING[3], borderRadius: 12, marginBottom: SPACING[3] },
    itemImage: { width: 80, height: 80, borderRadius: 8 },
    itemDetails: { flex: 1, marginLeft: SPACING[3] },
    itemTitle: { fontSize: SIZES.lg, fontWeight: '600', color: COLORS.neutral[800] },
    itemPrice: { fontSize: SIZES.base, color: COLORS.neutral[600], marginTop: SPACING[1] },
    deleteButton: { padding: SPACING[2] },
    summaryContainer: { backgroundColor: COLORS.white, padding: SPACING[5], borderTopWidth: 1, borderTopColor: COLORS.neutral[200] },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING[2] },
    summaryText: { fontSize: SIZES.base, color: COLORS.neutral[600] },
    totalRow: { paddingTop: SPACING[3], marginTop: SPACING[3], borderTopWidth: 1, borderTopColor: COLORS.neutral[200] },
    totalText: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.neutral[800] },
    checkoutButton: { backgroundColor: COLORS.primary[600], padding: SPACING[4], borderRadius: 12, alignItems: 'center', marginTop: SPACING[4] },
    checkoutButtonText: { color: COLORS.white, fontSize: SIZES.lg, fontWeight: '600' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING[5], backgroundColor: COLORS.neutral[100] },
    emptyText: { fontSize: SIZES.xl, fontWeight: '600', color: COLORS.neutral[600], marginBottom: SPACING[5] },
    shopButton: { backgroundColor: COLORS.primary[600], paddingVertical: SPACING[3], paddingHorizontal: SPACING[6], borderRadius: 25 },
    shopButtonText: { color: COLORS.white, fontWeight: '600', fontSize: SIZES.base },
});
