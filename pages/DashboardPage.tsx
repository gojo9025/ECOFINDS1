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
            <h1 className="text-4xl font-extrabold text-neutral-800 mb-8">My Dashboard</h1>

            {/* Profile Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-neutral-700 mb-4">My Profile</h2>
                {!isEditing ? (
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg text-neutral-600"><span className="font-semibold text-neutral-800">Username:</span> {user.username}</p>
                            <p className="text-lg text-neutral-600"><span className="font-semibold text-neutral-800">Email:</span> {user.email}</p>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-full font-semibold text-sm hover:bg-neutral-300 transition-colors flex items-center space-x-2">
                           <PencilIcon/> <span>Edit Profile</span>
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleProfileUpdate}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-neutral-700">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="mt-1 block w-full md:w-1/2 px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button type="submit" className="px-5 py-2 bg-primary-600 text-white rounded-full font-semibold text-sm hover:bg-primary-700 transition-colors">Save</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2 bg-neutral-200 text-neutral-800 rounded-full font-semibold text-sm hover:bg-neutral-300 transition-colors">Cancel</button>
                        </div>
                    </form>
                )}
            </div>

            {/* My Listings Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-neutral-700">My Listings</h2>
                    <Link to="/add-product" className="px-4 py-2 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md transform hover:-translate-y-px">
                        <PlusIcon /> <span>Add New Product</span>
                    </Link>
                </div>
                <div className="space-y-4">
                    {userProducts.length > 0 ? (
                        userProducts.map(product => (
                            <div key={product.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:shadow-md hover:border-primary-300 transition-all">
                                <div className="flex items-center space-x-4">
                                    <img src={product.imageUrl} alt={product.title} className="w-20 h-20 object-cover rounded-md"/>
                                    <div>
                                        <h3 className="font-semibold text-neutral-800">{product.title}</h3>
                                        <p className="text-neutral-600">${product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => navigate(`/edit-product/${product.id}`)} className="p-2 text-neutral-500 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors"><PencilIcon/></button>
                                    <button onClick={() => deleteProduct(product.id)} className="p-2 text-neutral-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"><TrashIcon/></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-neutral-500 text-center py-8">You haven't listed any products yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};