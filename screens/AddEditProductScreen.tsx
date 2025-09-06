import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { ProductCategory, Product, type AppContextType } from '../types';
import { COLORS, SIZES, SPACING } from '../theme';

export const AddEditProductScreen: React.FC = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { createProduct, updateProduct, getProductById, user } = useContext(AppContext) as AppContextType;

    const id = route.params?.id;
    const isEditing = Boolean(id);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<ProductCategory>(ProductCategory.OTHER);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (isEditing && id) {
            const product = getProductById(id);
            if (product && product.sellerId === user?.id) {
                setTitle(product.title);
                setDescription(product.description);
                setPrice(String(product.price));
                setCategory(product.category);
                setImageUrl(product.imageUrl);
            } else {
                navigation.navigate('Dashboard');
            }
        } else {
             setImageUrl(`https://picsum.photos/seed/${Date.now()}/400/300`);
        }
    }, [id, isEditing, getProductById, navigation, user]);

    const handleSubmit = async () => {
        if (!user || !title || !description || !price) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        const productData: Omit<Product, 'id' | 'sellerId'> = {
            title,
            description,
            price: parseFloat(price),
            category,
            imageUrl,
        };

        try {
            if (isEditing && id) {
                await updateProduct(id, productData);
            } else {
                await createProduct(productData);
            }
            navigation.navigate('Dashboard');
        } catch (error) {
            console.error('Failed to save product:', error);
            Alert.alert("Error", "Failed to save product.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Title</Text>
                    <TextInput value={title} onChangeText={setTitle} style={styles.input} />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput value={description} onChangeText={setDescription} style={[styles.input, styles.textarea]} multiline />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                     <View style={styles.categoryContainer}>
                        {Object.values(ProductCategory).map(cat => (
                            <TouchableOpacity 
                                key={cat} 
                                style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                                onPress={() => setCategory(cat)}
                            >
                                <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextActive]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                 <View style={styles.inputGroup}>
                    <Text style={styles.label}>Price ($)</Text>
                    <TextInput value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
                </View>
                 <View style={styles.inputGroup}>
                    <Text style={styles.label}>Image URL (Placeholder)</Text>
                    <TextInput value={imageUrl} onChangeText={setImageUrl} style={styles.input} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>{isEditing ? 'Save Changes' : 'Submit Listing'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[100],
    },
    form: {
        padding: SPACING[5],
    },
    inputGroup: {
        marginBottom: SPACING[5],
    },
    label: {
        fontSize: SIZES.sm,
        color: COLORS.neutral[700],
        fontWeight: '600',
        marginBottom: SPACING[2],
    },
    input: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[3],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.neutral[300],
        fontSize: SIZES.base,
        color: COLORS.neutral[800],
    },
    textarea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING[2],
    },
    categoryChip: {
        backgroundColor: COLORS.neutral[200],
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[2],
        borderRadius: 20,
    },
    categoryChipActive: {
        backgroundColor: COLORS.primary[600],
    },
    categoryChipText: {
        color: COLORS.neutral[800],
        fontWeight: '500',
    },
    categoryChipTextActive: {
        color: COLORS.white,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: SPACING[6],
        borderTopWidth: 1,
        borderTopColor: COLORS.neutral[200],
        paddingTop: SPACING[5],
    },
    button: {
        paddingVertical: SPACING[3],
        paddingHorizontal: SPACING[6],
        borderRadius: 25,
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.neutral[300],
        marginRight: SPACING[3],
    },
    cancelButtonText: {
        color: COLORS.neutral[700],
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: COLORS.primary[600],
    },
    submitButtonText: {
        color: COLORS.white,
        fontWeight: '600',
    },
});
