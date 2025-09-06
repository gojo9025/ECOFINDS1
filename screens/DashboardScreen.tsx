import React, { useContext, useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons';
import type { AppContextType, Product } from '../types';
import { COLORS, SIZES, SPACING } from '../theme';

export const DashboardScreen: React.FC = () => {
    const { user, updateUser, products, deleteProduct } = useContext(AppContext) as AppContextType;
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user?.username || '');
    const navigation = useNavigation<any>();

    const userProducts = useMemo(() => {
        return products.filter(p => p.sellerId === user?.id);
    }, [products, user]);

    if (!user) return null;

    const handleProfileUpdate = async () => {
        await updateUser({ username });
        setIsEditing(false);
        Alert.alert("Success", "Your profile has been updated.");
    };
    
    const confirmDelete = (id: string, title: string) => {
        Alert.alert(
            "Delete Product",
            `Are you sure you want to delete "${title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteProduct(id) }
            ]
        );
    }

    const renderListingItem = ({item}: {item: Product}) => (
        <View style={styles.listingItem}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                {/* <Image source={{uri: item.imageUrl}} style={styles.listingImage} /> */}
                <View>
                    <Text style={styles.listingTitle}>{item.title}</Text>
                    <Text style={styles.listingPrice}>${item.price.toFixed(2)}</Text>
                </View>
            </View>
            <View style={styles.listingActions}>
                <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { id: item.id })} style={styles.actionButton}>
                    <PencilIcon size={22} color={COLORS.blue} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item.id, item.title)} style={styles.actionButton}>
                    <TrashIcon size={22} color={COLORS.red}/>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ListHeaderComponent={
                    <>
                        <Text style={styles.headerTitle}>My Dashboard</Text>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>My Profile</Text>
                            {isEditing ? (
                                <>
                                    <TextInput
                                        value={username}
                                        onChangeText={setUsername}
                                        style={styles.input}
                                    />
                                    <View style={styles.profileActions}>
                                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleProfileUpdate}>
                                            <Text style={styles.saveButtonText}>Save</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsEditing(false)}>
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <View style={styles.profileDisplay}>
                                    <View>
                                        <Text style={styles.profileText}><Text style={{fontWeight: 'bold'}}>Username:</Text> {user.username}</Text>
                                        <Text style={styles.profileText}><Text style={{fontWeight: 'bold'}}>Email:</Text> {user.email}</Text>
                                    </View>
                                    <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => setIsEditing(true)}>
                                        <PencilIcon size={16} color={COLORS.neutral[700]}/>
                                        <Text style={styles.editButtonText}>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        <View style={styles.listingsHeader}>
                             <Text style={styles.cardTitle}>My Listings</Text>
                            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => navigation.navigate('AddProduct')}>
                                <PlusIcon size={18} color={COLORS.white} />
                                <Text style={styles.addButtonText}>Add New</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                data={userProducts}
                renderItem={renderListingItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={<View style={styles.card}><Text style={styles.emptyText}>You haven't listed any products yet.</Text></View>}
                contentContainerStyle={{ paddingHorizontal: SPACING[4] }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.neutral[100] },
    headerTitle: { fontSize: SIZES['3xl'], fontWeight: '800', color: COLORS.neutral[800], margin: SPACING[4], marginBottom: SPACING[2] },
    card: { backgroundColor: COLORS.white, borderRadius: 12, padding: SPACING[5], marginBottom: SPACING[5] },
    cardTitle: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.neutral[700], marginBottom: SPACING[4] },
    profileDisplay: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    profileText: { fontSize: SIZES.base, color: COLORS.neutral[600], lineHeight: 24 },
    profileActions: { flexDirection: 'row', marginTop: SPACING[2] },
    input: { backgroundColor: COLORS.neutral[100], borderWidth: 1, borderColor: COLORS.neutral[300], borderRadius: 8, padding: SPACING[3], fontSize: SIZES.base, marginBottom: SPACING[3] },
    button: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING[2], paddingHorizontal: SPACING[4], borderRadius: 20 },
    editButton: { backgroundColor: COLORS.neutral[200] },
    editButtonText: { color: COLORS.neutral[700], fontWeight: '600', marginLeft: SPACING[2] },
    saveButton: { backgroundColor: COLORS.primary[600], marginRight: SPACING[2] },
    saveButtonText: { color: COLORS.white, fontWeight: '600' },
    cancelButton: { backgroundColor: COLORS.neutral[200] },
    cancelButtonText: { color: COLORS.neutral[700], fontWeight: '600' },
    listingsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING[3] },
    addButton: { backgroundColor: COLORS.primary[600] },
    addButtonText: { color: COLORS.white, fontWeight: '600', marginLeft: SPACING[2] },
    listingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: SPACING[3], borderRadius: 12, marginBottom: SPACING[3], justifyContent: 'space-between' },
    listingImage: { width: 60, height: 60, borderRadius: 8, marginRight: SPACING[3] },
    listingTitle: { fontSize: SIZES.base, fontWeight: '600', color: COLORS.neutral[800] },
    listingPrice: { fontSize: SIZES.sm, color: COLORS.neutral[600], marginTop: SPACING[1] },
    listingActions: { flexDirection: 'row' },
    actionButton: { padding: SPACING[2] },
    emptyText: { textAlign: 'center', color: COLORS.neutral[500], paddingVertical: SPACING[6] },
});
