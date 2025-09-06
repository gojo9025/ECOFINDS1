import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider, AppContext } from './context/AppContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { HomeScreen } from './screens/HomeScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { AddEditProductScreen } from './screens/AddEditProductScreen';
import { CartScreen } from './screens/CartScreen';
import { PurchasesScreen } from './screens/PurchasesScreen';
import { COLORS } from './theme';
// FIX: Import RootStackParamList for typed navigation to resolve Stack.Navigator type error.
import { AppContextType, RootStackParamList } from './types';

// FIX: Create a typed stack navigator to resolve type errors with screen definitions.
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const context = useContext(AppContext);

    if (!context) {
        return null; 
    }
    const { user, isLoading } = context as AppContextType;

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary[600]} />
            </View>
        );
    }
    
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerStyle: { backgroundColor: COLORS.white },
                headerTintColor: COLORS.neutral[800],
                headerTitleStyle: { fontWeight: 'bold' },
            }}>
                {user ? (
                    // FIX: Replaced React.Fragment with Stack.Group to resolve a TypeScript overload error.
                    // Using Stack.Group is the standard pattern for grouping screens.
                    <Stack.Group>
                        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'EcoFinds' }} />
                        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
                        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
                        <Stack.Screen name="AddProduct" component={AddEditProductScreen} options={{ title: 'Add Product' }} />
                        <Stack.Screen name="EditProduct" component={AddEditProductScreen} options={{ title: 'Edit Product' }} />
                        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'My Cart' }} />
                        <Stack.Screen name="Purchases" component={PurchasesScreen} options={{ title: 'My Purchases' }} />
                    </Stack.Group>
                ) : (
                    // When not authenticated, only the Login screen is available.
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const App = () => {
    return (
        <AppProvider>
            <StatusBar style="dark" />
            <AppNavigator />
        </AppProvider>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.neutral[50],
    },
});

export default App;
