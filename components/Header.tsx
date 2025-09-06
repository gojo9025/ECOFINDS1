import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ShoppingCartIcon, UserCircleIcon, LogoutIcon } from './icons';
import type { AppContextType } from '../types';

export const Header: React.FC = () => {
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { user, logout, cart } = useContext(AppContext) as AppContextType;

    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 border-b border-neutral-200">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-3xl font-extrabold text-primary-600">
                    EcoFinds
                </Link>
                <nav className="flex items-center space-x-6">
                    {user ? (
                        <>
                            <Link to="/purchases" className="text-neutral-600 hover:text-primary-600 transition-colors">My Purchases</Link>
                            <Link to="/dashboard" className="text-neutral-600 hover:text-primary-600 transition-colors flex items-center space-x-2">
                                <UserCircleIcon /> 
                                <span className='hidden sm:inline'>Dashboard</span>
                            </Link>
                            <Link to="/cart" className="relative text-neutral-600 hover:text-primary-600 transition-colors">
                                <ShoppingCartIcon />
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                    </span>
                                )}
                            </Link>
                            <button onClick={logout} className="text-neutral-600 hover:text-primary-600 transition-colors flex items-center space-x-2">
                                <LogoutIcon />
                                <span className='hidden sm:inline'>Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="px-5 py-2 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-px">
                            Login / Sign Up
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};