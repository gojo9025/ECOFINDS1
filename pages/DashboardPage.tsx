
import React, { useContext, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons';
import type { AppContextType } from '../types';

export const DashboardPage: React.FC = () => {
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { user, updateUser, products, deleteProduct } = useContext(AppContext) as AppContextType;
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user?.username || '');
    const navigate = useNavigate();

    const userProducts = useMemo(() => {
        return products.filter(p => p.sellerId === user?.id);
    }, [products, user]);

    if (!user) return null;

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUser({ username });
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Dashboard</h1>

            {/* Profile Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Profile</h2>
                {!isEditing ? (
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg"><span className="font-medium">Username:</span> {user.username}</p>
                            <p className="text-lg"><span className="font-medium">Email:</span> {user.email}</p>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center space-x-2">
                           <PencilIcon/> <span>Edit Profile</span>
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleProfileUpdate}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Save</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        </div>
                    </form>
                )}
            </div>

            {/* My Listings Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-700">My Listings</h2>
                    <Link to="/add-product" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
                        <PlusIcon /> <span>Add New Product</span>
                    </Link>
                </div>
                <div className="space-y-4">
                    {userProducts.length > 0 ? (
                        userProducts.map(product => (
                            <div key={product.id} className="flex items-center justify-between p-4 border rounded-md">
                                <div className="flex items-center space-x-4">
                                    <img src={product.imageUrl} alt={product.title} className="w-16 h-16 object-cover rounded-md"/>
                                    <div>
                                        <h3 className="font-semibold">{product.title}</h3>
                                        <p className="text-gray-600">${product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => navigate(`/edit-product/${product.id}`)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon/></button>
                                    <button onClick={() => deleteProduct(product.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon/></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">You haven't listed any products yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
