import React, { useState, useContext, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { AppContext } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory, type AppContextType } from '../types';
import { SearchIcon } from '../components/icons';
import { COLORS, SIZES, SPACING } from '../theme';

export const HomeScreen: React.FC = () => {
    const { products } = useContext(AppContext) as AppContextType;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
    
    const filteredProducts = useMemo(() => {
        return products
            .filter(product =>
                selectedCategory === 'All' || product.category === selectedCategory
            )
            .filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [products, searchTerm, selectedCategory]);

    const renderHeader = () => (
        <>
            <View style={styles.heroContainer}>
                <Text style={styles.heroTitle}>Find Your Next Treasure</Text>
                <Text style={styles.heroSubtitle}>Browse second-hand items and support a circular economy.</Text>
            </View>
            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <View style={styles.searchIcon}>
                         <SearchIcon />
                    </View>
                    <TextInput
                        placeholder="Search by keyword..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        style={styles.searchInput}
                        placeholderTextColor={COLORS.neutral[400]}
                    />
                </View>
            </View>
            <View style={styles.filterContainer}>
                <FlatList
                    data={['All', ...Object.values(ProductCategory)]}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                         <TouchableOpacity
                            style={[styles.filterButton, selectedCategory === item && styles.filterButtonActive]}
                            onPress={() => setSelectedCategory(item as ProductCategory | 'All')}
                        >
                            <Text style={[styles.filterButtonText, selectedCategory === item && styles.filterButtonTextActive]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingHorizontal: SPACING[4] }}
                />
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredProducts}
                renderItem={({ item }) => <ProductCard product={item} />}
                keyExtractor={item => item.id}
                numColumns={2}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No products found.</Text>
                        <Text style={styles.emptySubtext}>Try adjusting your search or filters.</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContentContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[100],
    },
    heroContainer: {
        backgroundColor: COLORS.white,
        padding: SPACING[6],
        paddingTop: SPACING[2],
    },
    heroTitle: {
        fontSize: SIZES['3xl'],
        fontWeight: '800',
        color: COLORS.neutral[800],
        marginBottom: SPACING[2],
    },
    heroSubtitle: {
        fontSize: SIZES.base,
        color: COLORS.neutral[600],
    },
    searchContainer: {
        paddingHorizontal: SPACING[4],
        paddingBottom: SPACING[4],
        backgroundColor: COLORS.white,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.neutral[50],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.neutral[300],
    },
    searchIcon: {
        paddingLeft: SPACING[3],
    },
    searchInput: {
        flex: 1,
        padding: SPACING[3],
        fontSize: SIZES.base,
        color: COLORS.neutral[800],
    },
    filterContainer: {
        paddingVertical: SPACING[3],
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral[200],
    },
    filterButton: {
        paddingVertical: SPACING[2],
        paddingHorizontal: SPACING[4],
        backgroundColor: COLORS.neutral[100],
        borderRadius: 20,
        marginRight: SPACING[2],
        borderWidth: 1,
        borderColor: COLORS.neutral[200],
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary[600],
        borderColor: COLORS.primary[600],
    },
    filterButtonText: {
        fontSize: SIZES.sm,
        color: COLORS.neutral[700],
        fontWeight: '600',
    },
    filterButtonTextActive: {
        color: COLORS.white,
    },
    listContentContainer: {
        paddingHorizontal: SPACING[3],
        paddingBottom: SPACING[4],
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING[8],
        marginTop: SPACING[8],
        backgroundColor: COLORS.white,
        borderRadius: 12,
    },
    emptyText: {
        fontSize: SIZES.xl,
        fontWeight: '600',
        color: COLORS.neutral[600],
    },
    emptySubtext: {
        fontSize: SIZES.base,
        color: COLORS.neutral[500],
        marginTop: SPACING[2],
    }
});
