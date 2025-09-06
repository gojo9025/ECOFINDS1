
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import type { Product, AppContextType } from '../types';

export const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { getProductById, addToCart, user } = useContext(AppContext) as AppContextType;
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (id) {
            const foundProduct = getProductById(id);
            if(foundProduct) {
                setProduct(foundProduct);
            } else {
               navigate('/'); 
            }
        }
    }, [id, getProductById, navigate]);

    if (!product) {
        return <div className="text-center py-10">Loading product details...</div>;
    }

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        addToCart(product);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-auto max-h-96 object-cover rounded-lg" />
                </div>
                <div className="md:w-1/2 flex flex-col">
                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full self-start">{product.category}</span>
                    <h1 className="text-4xl font-bold text-gray-800 mt-4">{product.title}</h1>
                    <p className="text-3xl font-light text-gray-900 my-4">${product.price.toFixed(2)}</p>
                    <p className="text-gray-600 leading-relaxed flex-grow">{product.description}</p>
                    <button 
                        onClick={handleAddToCart}
                        className="mt-6 w-full bg-green-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition duration-300 disabled:bg-gray-400"
                        disabled={user?.id === product.sellerId}
                    >
                       {user?.id === product.sellerId ? "This is your listing" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
};
