import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, Order, ProductCategory, AppContextType } from '../types';

// Mock Data - used if localStorage is empty
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
    { id: '6', title: 'Yoga Mat', description: 'Eco-friendly yoga mat, non-slip surface. Barely used.', price: 30.00, category: ProductCategory.SPORTS, imageUrl: 'https://picsum.photos/seed/product6/400/300', sellerId: '1' },
    { id: '7', title: 'Antique Desk Lamp', description: 'A beautiful brass desk lamp from the 1920s. Fully functional.', price: 90.00, category: ProductCategory.HOME, imageUrl: 'https://picsum.photos/seed/product7/400/300', sellerId: '2' },
    { id: '8', title: 'Gourmet Coffee Maker', description: 'High-end coffee maker with multiple brewing options. Makes a perfect cup every time.', price: 150.00, category: ProductCategory.ELECTRONICS, imageUrl: 'https://picsum.photos/seed/product8/400/300', sellerId: '1' },
];

// LocalStorage helpers
// FIX: Add a trailing comma to the generic type parameter <T> to disambiguate from JSX syntax in a .tsx file.
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
};

// FIX: Add a trailing comma to the generic type parameter <T> to disambiguate from JSX syntax in a .tsx file.
const setInStorage = <T,>(key: string, value: T) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
    }
};

// Create Context
export const AppContext = createContext<AppContextType | null>(null);

// Provider Component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>(() => getFromStorage('ecofinds_users', initialUsers));
    const [products, setProducts] = useState<Product[]>(() => getFromStorage('ecofinds_products', initialProducts));
    const [user, setUser] = useState<User | null>(() => getFromStorage<User | null>('ecofinds_user', null));
    // FIX: Initialize cart and orders with empty arrays. The `user` variable is not available in the `useState` initializer
    // of another state variable. The useEffect below correctly loads this data when the user changes.
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    // Persist to localStorage
    useEffect(() => { setInStorage('ecofinds_users', users) }, [users]);
    useEffect(() => { setInStorage('ecofinds_products', products) }, [products]);
    useEffect(() => { setInStorage('ecofinds_user', user) }, [user]);
    
    // Per-user cart and orders
    useEffect(() => {
        if (user) {
            setInStorage(`ecofinds_cart_${user.id}`, cart);
        }
    }, [cart, user]);
    
    useEffect(() => {
        if (user) {
            setInStorage(`ecofinds_orders_${user.id}`, orders);
        }
    }, [orders, user]);

    // Load user-specific data on login
    useEffect(() => {
        if (user) {
            setCart(getFromStorage(`ecofinds_cart_${user.id}`, []));
            setOrders(getFromStorage(`ecofinds_orders_${user.id}`, []));
        } else {
            setCart([]);
            setOrders([]);
        }
    }, [user]);

    // --- Authentication ---
    const login = async (email: string, password: string): Promise<void> => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            const userToStore = { ...foundUser };
            delete userToStore.password;
            setUser(userToStore);
        } else {
            throw new Error('Invalid email or password.');
        }
    };
    
    const register = async (email: string, password: string, username: string): Promise<void> => {
        if (users.some(u => u.email === email)) {
            throw new Error('An account with this email already exists.');
        }
        const newUser: User = { id: String(Date.now()), email, password, username };
        setUsers(prev => [...prev, newUser]);
        const userToStore = { ...newUser };
        delete userToStore.password;
        setUser(userToStore);
    };

    const logout = () => {
        setUser(null);
    };
    
    const updateUser = async (userData: { username: string }): Promise<void> => {
        if (!user) return;
        setUser(prev => prev ? { ...prev, ...userData } : null);
        setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? { ...u, ...userData } : u));
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
        setProducts(prev => [newProduct, ...prev]);
    };
    
    const updateProduct = async (id: string, productData: Omit<Product, 'id' | 'sellerId'>): Promise<void> => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
    };
    
    const deleteProduct = async (id: string): Promise<void> => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    // --- Cart ---
    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Since it's a second-hand market, we'll assume quantity is always 1
                return prevCart;
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };
    
    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
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
        setOrders(prev => [newOrder, ...prev]);
        
        // Remove purchased items from the marketplace
        const cartProductIds = cart.map(item => item.id);
        setProducts(prev => prev.filter(p => !cartProductIds.includes(p.id)));

        setCart([]);
    };
    
    const contextValue: AppContextType = {
        user, products, cart, orders,
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