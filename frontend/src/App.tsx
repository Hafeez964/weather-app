import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WeatherProvider } from './context/WeatherContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotFoundScreen from './screens/NotFoundScreen';

function App() {
  return (
    <AuthProvider>
      <WeatherProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <ProfileScreen />
                    </PrivateRoute>
                  } 
                />
                <Route path="*" element={<NotFoundScreen />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </WeatherProvider>
    </AuthProvider>
  );
}

export default App;