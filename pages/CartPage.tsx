import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { TrashIcon } from '../components/icons';
import type { AppContextType } from '../types';

export const CartPage: React.FC = () => {
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { cart, removeFromCart, checkout } = useContext(AppContext) as AppContextType;
    const navigate = useNavigate();

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);

    const handleCheckout = async () => {
        try {
            await checkout();
            alert('Purchase successful!');
            navigate('/purchases');
        } catch (error) {
            console.error(error);
            alert('There was an issue with your purchase.');
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-extrabold text-neutral-800 mb-8">My Cart</h1>
            {cart.length > 0 ? (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-lg space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 border-b border-neutral-200 last:border-b-0">
                                <div className="flex items-center space-x-4">
                                    <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
                                    <div>
                                        <h3 className="font-semibold text-lg text-neutral-800">{item.title}</h3>
                                        <p className="text-neutral-600 text-lg font-bold">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="p-2 text-neutral-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors">
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="lg:w-1/3 bg-white p-8 rounded-xl shadow-lg h-fit">
                        <h2 className="text-2xl font-bold mb-4 border-b border-neutral-200 pb-4">Order Summary</h2>
                        <div className="flex justify-between items-center text-neutral-600 mb-2">
                            <span>Subtotal</span>
                            <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-xl mt-4 pt-4 border-t border-neutral-200">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={handleCheckout} 
                            className="mt-6 w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-lg text-lg font-semibold hover:shadow-lg hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-300">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center bg-white p-16 rounded-xl shadow-lg">
                    <p className="text-2xl font-semibold text-neutral-600">Your cart is empty.</p>
                     <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors">
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    );
};