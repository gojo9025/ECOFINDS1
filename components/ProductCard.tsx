import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group border border-neutral-200/80 hover:shadow-xl">
            <Link to={`/product/${product.id}`} className="block">
                <div className="overflow-hidden">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                    <p className="text-xs font-medium text-primary-600 uppercase tracking-wider">{product.category}</p>
                    <h3 className="text-lg font-bold text-neutral-800 truncate mt-1">{product.title}</h3>
                    <p className="text-xl font-extrabold text-neutral-900 mt-2">${product.price.toFixed(2)}</p>
                </div>
            </Link>
        </div>
    );
};