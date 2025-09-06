
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../types';

export const ProtectedRoute: React.FC = () => {
    // FIX: Cast the value from AppContext to AppContextType to resolve type errors.
    const { user } = useContext(AppContext) as AppContextType;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
