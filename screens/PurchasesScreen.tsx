import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Image } from 'react-native';
import { AppContext } from '../context/AppContext';
import type { AppContextType, Order } from '../types';
import { COLORS, SIZES, SPACING } from '../theme';

export const PurchasesScreen: React.FC = () => {
    const { orders } = useContext(AppContext) as AppContextType;

    const renderOrderItem = ({ item }: { item: Order }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <View>
                    <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
                    <Text style={styles.orderDate}>Date: {new Date(item.orderDate).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
            </View>
            <View>
                {item.items.map(product => (
                    <View key={product.id} style={styles.productItem}>
                        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                        <View style={styles.productDetails}>
                             <Text style={styles.productTitle}>{product.title}</Text>
                             <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {orders.length > 0 ? (
                <FlatList
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>You have no previous purchases.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[100],
    },
    listContainer: {
        padding: SPACING[4],
    },
    orderCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: SPACING[4],
        marginBottom: SPACING[4],
        borderLeftWidth: 5,
        borderLeftColor: COLORS.primary[500],
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral[200],
        paddingBottom: SPACING[3],
        marginBottom: SPACING[3],
    },
    orderId: {
        fontSize: SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.neutral[800],
    },
    orderDate: {
        fontSize: SIZES.sm,
        color: COLORS.neutral[500],
        marginTop: SPACING[1],
    },
    orderTotal: {
        fontSize: SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.neutral[900],
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING[3],
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    productDetails: {
        marginLeft: SPACING[3],
    },
    productTitle: {
        fontSize: SIZES.base,
        fontWeight: '600',
        color: COLORS.neutral[700],
    },
    productPrice: {
        fontSize: SIZES.sm,
        color: COLORS.neutral[600],
        marginTop: SPACING[1],
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING[5],
    },
    emptyText: {
        fontSize: SIZES.xl,
        fontWeight: '600',
        color: COLORS.neutral[600],
    },
});
