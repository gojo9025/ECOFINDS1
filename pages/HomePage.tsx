import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory, type AppContextType } from '../types';
import { SearchIcon } from '../components/icons';

export const HomePage: React.FC = () => {
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { products } = useContext(AppContext) as AppContextType;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
    const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const filteredProducts = useMemo(() => {
        return products
            .filter(product =>
                selectedCategory === 'All' || product.category === selectedCategory
            )
            .filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [products, searchTerm, selectedCategory]);

    const autocompleteSuggestions = useMemo(() => {
        if (searchTerm.length === 0) {
            return [];
        }
        return products
            .filter(product =>
                product.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5); // Limit to 5 suggestions
    }, [products, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsAutocompleteOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSuggestionClick = (title: string) => {
        setSearchTerm(title);
        setIsAutocompleteOpen(false);
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-4xl font-extrabold text-neutral-800 mb-2">Find Your Next Treasure</h1>
                <p className="text-neutral-600">Browse thousands of second-hand items and contribute to a circular economy.</p>
                <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full" ref={searchContainerRef}>
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by keyword..."
                            value={searchTerm}
                            onChange={e => {
                                setSearchTerm(e.target.value)
                                setIsAutocompleteOpen(true);
                            }}
                            onFocus={() => setIsAutocompleteOpen(true)}
                            autoComplete="off"
                            className="w-full p-3 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                        />
                        {isAutocompleteOpen && autocompleteSuggestions.length > 0 && (
                            <div className="absolute top-full mt-2 w-full bg-white border border-neutral-200 rounded-lg shadow-xl z-10">
                                <ul className="py-1">
                                    {autocompleteSuggestions.map(suggestion => (
                                        <li
                                            key={suggestion.id}
                                            onClick={() => handleSuggestionClick(suggestion.title)}
                                            className="px-4 py-2 hover:bg-primary-50 cursor-pointer text-neutral-700"
                                        >
                                            {suggestion.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                     <select
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value as ProductCategory | 'All')}
                        className="w-full md:w-auto p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white transition-shadow appearance-none"
                    >
                        <option value="All">All Categories</option>
                        {Object.values(ProductCategory).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-md">
                    <p className="text-2xl font-semibold text-neutral-600">No products found.</p>
                    <p className="text-neutral-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};