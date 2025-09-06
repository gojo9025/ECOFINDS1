
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory, type AppContextType } from '../types';

export const HomePage: React.FC = () => {
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { products } = useContext(AppContext) as AppContextType;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');

    const filteredProducts = useMemo(() => {
        return products
            .filter(product =>
                selectedCategory === 'All' || product.category === selectedCategory
            )
            .filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [products, searchTerm, selectedCategory]);

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Your Next Treasure</h1>
                <p className="text-gray-600">Browse thousands of second-hand items and contribute to a circular economy.</p>
                <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search by keyword..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                     <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value as ProductCategory | 'All')}
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                        <option value="All">All Categories</option>
                        {Object.values(ProductCategory).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-500">No products found. Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};
