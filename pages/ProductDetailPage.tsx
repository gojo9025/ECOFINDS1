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
        return <div className="text-center py-10 text-neutral-500">Loading product details...</div>;
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
            <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col md:flex-row gap-10">
                <div className="md:w-1/2">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg" />
                </div>
                <div className="md:w-1/2 flex flex-col">
                    <span className="text-sm font-bold text-primary-700 bg-primary-100 px-3 py-1 rounded-full self-start uppercase tracking-wider">{product.category}</span>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 mt-4">{product.title}</h1>
                    <p className="text-4xl font-bold text-neutral-800 my-4">${product.price.toFixed(2)}</p>
                    <div className="border-t border-neutral-200 pt-4 flex-grow">
                        <p className="text-neutral-600 leading-relaxed">{product.description}</p>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="mt-6 w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-lg text-lg font-semibold hover:shadow-lg hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-300 disabled:from-neutral-300 disabled:to-neutral-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        disabled={user?.id === product.sellerId}
                    >
                       {user?.id === product.sellerId ? "This is your listing" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
};