import React, { useState, useContext } from 'react';
import { User, Save } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProfileScreen: React.FC = () => {
  const { user, updateProfile, loading, error } = useContext(AuthContext);
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState(
    user?.preferences?.temperatureUnit || 'metric'
  );
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      setMessage(null);
      
      try {
        const userData: any = {
          name,
          email,
          preferences: {
            temperatureUnit,
          },
        };
        
        if (password) {
          userData.password = password;
        }
        
        await updateProfile(userData);
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
            <User className="h-6 w-6 text-purple-500 dark:text-purple-300" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Your Profile
        </h1>
        
        {message && <Message variant="error">{message}</Message>}
        {error && <Message variant="error">{error}</Message>}
        {success && <Message variant="success">Profile updated successfully</Message>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="temperatureUnit" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Temperature Unit
            </label>
            <select
              id="temperatureUnit"
              value={temperatureUnit}
              onChange={(e) => setTemperatureUnit(e.target.value as 'metric' | 'imperial')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="metric">Celsius (°C)</option>
              <option value="imperial">Fahrenheit (°F)</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Update Profile
              </>
            )}
          </button>
        </form>
      </div>
      
      {user?.searchHistory && user.searchHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Search History
          </h2>
          
          <div className="space-y-2">
            {user.searchHistory.map((item: any, index: number) => (
              <div 
                key={index}
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800 dark:text-white">
                    {item.city}, {item.country}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;