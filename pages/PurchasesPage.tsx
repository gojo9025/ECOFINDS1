
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../types';

export const PurchasesPage: React.FC = () => {
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { orders } = useContext(AppContext) as AppContextType;

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Previous Purchases</h1>
            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                                <div>
                                    <h2 className="text-xl font-semibold">Order #{order.id.slice(0,8)}</h2>
                                    <p className="text-sm text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <p className="text-lg font-bold">Total: ${order.total.toFixed(2)}</p>
                            </div>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center space-x-4">
                                        <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                                        <div>
                                            <h3 className="font-semibold">{item.title}</h3>
                                            <p className="text-gray-600">${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white p-10 rounded-lg shadow-md">
                    <p className="text-xl text-gray-500">You have no previous purchases.</p>
                </div>
            )}
        </div>
    );
};
