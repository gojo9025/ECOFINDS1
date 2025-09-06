
import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <Link to={`/product/${product.id}`} className="block">
                <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                    <p className="text-xl font-bold text-green-600 mt-2">${product.price.toFixed(2)}</p>
                </div>
            </Link>
        </div>
    );
};
