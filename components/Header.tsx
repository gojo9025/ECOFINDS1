
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ShoppingCartIcon, UserCircleIcon, LogoutIcon } from './icons';
import type { AppContextType } from '../types';

export const Header: React.FC = () => {
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { user, logout, cart } = useContext(AppContext) as AppContextType;

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-green-600">
                    EcoFinds
                </Link>
                <nav className="flex items-center space-x-6">
                    {user ? (
                        <>
                            <Link to="/purchases" className="text-gray-600 hover:text-green-600">My Purchases</Link>
                            <Link to="/dashboard" className="text-gray-600 hover:text-green-600 flex items-center space-x-1">
                                <UserCircleIcon /> 
                                <span>Dashboard</span>
                            </Link>
                            <Link to="/cart" className="relative text-gray-600 hover:text-green-600">
                                <ShoppingCartIcon />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                    </span>
                                )}
                            </Link>
                            <button onClick={logout} className="text-gray-600 hover:text-green-600 flex items-center space-x-1">
                                <LogoutIcon />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Login / Sign Up
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};
