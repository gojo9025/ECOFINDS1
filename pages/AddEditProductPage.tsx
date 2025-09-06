import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ProductCategory, Product, type AppContextType } from '../types';

export const AddEditProductPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { createProduct, updateProduct, getProductById, user } = useContext(AppContext) as AppContextType;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<ProductCategory>(ProductCategory.OTHER);
    const [imageUrl, setImageUrl] = useState('');

    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing && id) {
            const product = getProductById(id);
            if (product && product.sellerId === user?.id) {
                setTitle(product.title);
                setDescription(product.description);
                setPrice(String(product.price));
                setCategory(product.category);
                setImageUrl(product.imageUrl);
            } else {
                navigate('/dashboard');
            }
        } else {
             setImageUrl(`https://picsum.photos/seed/${Date.now()}/400/300`);
        }
    }, [id, isEditing, getProductById, navigate, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const productData: Omit<Product, 'id' | 'sellerId'> = {
            title,
            description,
            price: parseFloat(price),
            category,
            imageUrl,
        };

        try {
            if (isEditing && id) {
                await updateProduct(id, productData);
            } else {
                await createProduct(productData);
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to save product:', error);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-neutral-800 mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-neutral-700">Product Title</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                     <div>
                        <label htmlFor="category" className="block text-sm font-medium text-neutral-700">Category</label>
                        <select id="category" value={category} onChange={e => setCategory(e.target.value as ProductCategory)} required className="mt-1 block w-full px-4 py-3 border border-neutral-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none">
                            {Object.values(ProductCategory).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-neutral-700">Price ($)</label>
                        <input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" className="mt-1 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                     <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-neutral-700">Image URL (Placeholder)</label>
                        <input id="imageUrl" type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-200">
                        <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2 border border-neutral-300 rounded-full text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-full text-sm font-semibold hover:bg-primary-700 transition-colors">{isEditing ? 'Save Changes' : 'Submit Listing'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};