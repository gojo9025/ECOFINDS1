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
                    <main className="flex-grow bg-neutral-100">
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
                    <footer className="bg-neutral-800 text-neutral-300 py-6">
                        <div className="container mx-auto text-center">
                            <p>&copy; {new Date().getFullYear()} EcoFinds. All rights reserved.</p>
                            <p className="text-sm text-neutral-400 mt-1">Promoting a sustainable future, one pre-loved item at a time.</p>
                        </div>
                    </footer>
                </div>
            </HashRouter>
        </AppProvider>
    );
};

export default App;