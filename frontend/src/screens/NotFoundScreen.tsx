import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</div>
      <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-white">Page Not Found</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="mt-8 flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
      >
        <Home className="h-5 w-5" />
        <span>Go Home</span>
      </Link>
    </div>
  );
};

export default NotFoundScreen;