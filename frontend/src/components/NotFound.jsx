import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-6">The page you are looking for might have been removed or is temporarily unavailable.</p>
                <Link
                    to="/"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;