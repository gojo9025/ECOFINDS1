import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../types';

export const PurchasesPage: React.FC = () => {
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { orders } = useContext(AppContext) as AppContextType;

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-extrabold text-neutral-800 mb-8">My Previous Purchases</h1>
            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary-500">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-neutral-200 pb-4 mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-neutral-800">Order #{order.id.slice(0,8)}</h2>
                                    <p className="text-sm text-neutral-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <p className="text-lg font-bold text-neutral-900 mt-2 sm:mt-0">Total: ${order.total.toFixed(2)}</p>
                            </div>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                                        <div>
                                            <h3 className="font-semibold text-neutral-700">{item.title}</h3>
                                            <p className="text-neutral-600">${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white p-16 rounded-xl shadow-lg">
                    <p className="text-2xl font-semibold text-neutral-600">You have no previous purchases.</p>
                </div>
            )}
        </div>
    );
};