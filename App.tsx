
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AddEditProductPage } from './pages/AddEditProductPage';
import { CartPage } from './pages/CartPage';
import { PurchasesPage } from './pages/PurchasesPage';

const App: React.FC = () => {
    return (
        <AppProvider>
            <HashRouter>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow bg-gray-100">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/product/:id" element={<ProductDetailPage />} />
                            <Route path="/login" element={<LoginPage />} />

                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/add-product" element={<AddEditProductPage />} />
                                <Route path="/edit-product/:id" element={<AddEditProductPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/purchases" element={<PurchasesPage />} />
                            </Route>
                        </Routes>
                    </main>
                    <footer className="bg-gray-800 text-white py-4 text-center">
                        <p>&copy; {new Date().getFullYear()} EcoFinds. All rights reserved.</p>
                    </footer>
                </div>
            </HashRouter>
        </AppProvider>
    );
};

export default App;
