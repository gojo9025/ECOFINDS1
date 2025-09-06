
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
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Cart</h1>
            {cart.length > 0 ? (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-md space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center space-x-4">
                                    <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-md" />
                                    <div>
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-gray-600">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-500 hover:text-red-600">
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={handleCheckout} 
                            className="mt-6 w-full bg-green-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition duration-300">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center bg-white p-10 rounded-lg shadow-md">
                    <p className="text-xl text-gray-500">Your cart is empty.</p>
                </div>
            )}
        </div>
    );
};
