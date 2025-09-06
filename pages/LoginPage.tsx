import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../types';

export const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { login, register, user } = useContext(AppContext) as AppContextType;
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, username);
            }
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-primary-600">EcoFinds</h1>
                    <h2 className="text-2xl font-bold text-neutral-800 mt-4">
                        {isLogin ? 'Welcome Back!' : 'Create an Account'}
                    </h2>
                    <p className="text-neutral-500">{isLogin ? 'Sign in to continue your sustainable journey' : 'Join our community of conscious consumers'}</p>
                </div>
                
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center text-sm">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-neutral-700">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-neutral-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="font-semibold text-primary-600 hover:text-primary-500 ml-1">
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};