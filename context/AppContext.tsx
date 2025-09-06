import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Product, CartItem, Order, ProductCategory, AppContextType } from '../types';

// Mock Data - used if AsyncStorage is empty
const initialUsers: User[] = [
    { id: '1', email: 'test@example.com', username: 'testuser', password: 'password123' },
    { id: '2', email: 'seller@example.com', username: 'selleruser', password: 'password123' },
];

const initialProducts: Product[] = [
    { id: '1', title: 'Vintage Leather Jacket', description: 'A stylish vintage leather jacket from the 80s. Well-preserved and comfortable. Perfect for a classic look.', price: 75.00, category: ProductCategory.FASHION, imageUrl: 'https://picsum.photos/seed/product1/400/300', sellerId: '2' },
    { id: '2', title: 'Old Classic Novels Set', description: 'A collection of 5 classic novels in hardcover. Includes works by famous authors. Great condition.', price: 40.00, category: ProductCategory.BOOKS, imageUrl: 'https://picsum.photos/seed/product2/400/300', sellerId: '1' },
    { id: '3', title: 'Retro Bluetooth Speaker', description: 'A speaker with a cool retro design and modern bluetooth technology. Excellent sound quality.', price: 55.00, category: ProductCategory.ELECTRONICS, imageUrl: 'https://picsum.photos/seed/product3/400/300', sellerId: '2' },
    { id: '4', title: 'Handmade Ceramic Pot', description: 'A beautiful handmade pot for your plants. Unique design that will brighten any room.', price: 25.00, category: ProductCategory.HOME, imageUrl: 'https://picsum.photos/seed/product4/400/300', sellerId: '1' },
    { id: '5', title: 'Professional Tennis Racket', description: 'Lightweight and powerful tennis racket for advanced players. Used but in great shape.', price: 120.00, category: ProductCategory.SPORTS, imageUrl: 'https://picsum.photos/seed/product5/400/300', sellerId: '2' },
];

// AsyncStorage helpers
const getFromStorage = async <T,>(key: string, defaultValue: T): Promise<T> => {
    try {
        const item = await AsyncStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading AsyncStorage key "${key}":`, error);
        return defaultValue;
    }
};

const setInStorage = async <T,>(key: string, value: T) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error setting AsyncStorage key "${key}":`, error);
    }
};

// Create Context
export const AppContext = createContext<AppContextType | null>(null);

// Provider Component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    // Load initial data from storage
    useEffect(() => {
        const loadData = async () => {
            const storedUsers = await getFromStorage('ecofinds_users', initialUsers);
            const storedProducts = await getFromStorage('ecofinds_products', initialProducts);
            const storedUser = await getFromStorage<User | null>('ecofinds_user', null);
            
            setUsers(storedUsers);
            setProducts(storedProducts);
            setUser(storedUser);

            if (storedUser) {
                const userCart = await getFromStorage(`ecofinds_cart_${storedUser.id}`, []);
                const userOrders = await getFromStorage(`ecofinds_orders_${storedUser.id}`, []);
                setCart(userCart);
                setOrders(userOrders);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);


    // --- Authentication ---
    const login = async (email: string, password: string): Promise<void> => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            const userToStore = { ...foundUser };
            delete userToStore.password;
            setUser(userToStore);
            await setInStorage('ecofinds_user', userToStore);
             // Load user-specific data
            setCart(await getFromStorage(`ecofinds_cart_${userToStore.id}`, []));
            setOrders(await getFromStorage(`ecofinds_orders_${userToStore.id}`, []));
        } else {
            throw new Error('Invalid email or password.');
        }
    };
    
    const register = async (email: string, password: string, username: string): Promise<void> => {
        if (users.some(u => u.email === email)) {
            throw new Error('An account with this email already exists.');
        }
        const newUser: User = { id: String(Date.now()), email, password, username };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        await setInStorage('ecofinds_users', updatedUsers);

        const userToStore = { ...newUser };
        delete userToStore.password;
        setUser(userToStore);
        await setInStorage('ecofinds_user', userToStore);
        // New user starts with empty cart/orders
        setCart([]);
        setOrders([]);
    };

    const logout = async () => {
        setUser(null);
        setCart([]);
        setOrders([]);
        await AsyncStorage.removeItem('ecofinds_user');
    };
    
    const updateUser = async (userData: { username: string }): Promise<void> => {
        if (!user) return;
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        await setInStorage('ecofinds_user', updatedUser);

        const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...userData } : u);
        setUsers(updatedUsers);
        await setInStorage('ecofinds_users', updatedUsers);
    };

    // --- Products ---
    const getProductById = (id: string): Product | undefined => {
        return products.find(p => p.id === id);
    };

    const createProduct = async (productData: Omit<Product, 'id' | 'sellerId'>): Promise<void> => {
        if (!user) throw new Error("You must be logged in to create a product.");
        const newProduct: Product = {
            ...productData,
            id: String(Date.now()),
            sellerId: user.id
        };
        const updatedProducts = [newProduct, ...products];
        setProducts(updatedProducts);
        await setInStorage('ecofinds_products', updatedProducts);
    };
    
    const updateProduct = async (id: string, productData: Omit<Product, 'id' | 'sellerId'>): Promise<void> => {
        const updatedProducts = products.map(p => p.id === id ? { ...p, ...productData } : p);
        setProducts(updatedProducts);
        await setInStorage('ecofinds_products', updatedProducts);
    };
    
    const deleteProduct = async (id: string): Promise<void> => {
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        await setInStorage('ecofinds_products', updatedProducts);
    };

    // --- Cart & Orders ---
    const addToCart = async (product: Product) => {
        if (!user) return;
        const newCart = [...cart, { ...product, quantity: 1 }];
        setCart(newCart);
        await setInStorage(`ecofinds_cart_${user.id}`, newCart);
    };
    
    const removeFromCart = async (productId: string) => {
        if (!user) return;
        const newCart = cart.filter(item => item.id !== productId);
        setCart(newCart);
        await setInStorage(`ecofinds_cart_${user.id}`, newCart);
    };
    
    const checkout = async (): Promise<void> => {
        if (!user || cart.length === 0) throw new Error("Cannot checkout.");
        const newOrder: Order = {
            id: String(Date.now()),
            userId: user.id,
            items: [...cart],
            orderDate: new Date().toISOString(),
            total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
        };
        const newOrders = [newOrder, ...orders];
        setOrders(newOrders);
        await setInStorage(`ecofinds_orders_${user.id}`, newOrders);
        
        const cartProductIds = cart.map(item => item.id);
        const updatedProducts = products.filter(p => !cartProductIds.includes(p.id));
        setProducts(updatedProducts);
        await setInStorage('ecofinds_products', updatedProducts);

        setCart([]);
        await setInStorage(`ecofinds_cart_${user.id}`, []);
    };
    
    const contextValue: AppContextType = {
        user, products, cart, orders, isLoading,
        login, register, logout, updateUser,
        getProductById, createProduct, updateProduct, deleteProduct,
        addToCart, removeFromCart, checkout
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
