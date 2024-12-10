import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserMenu from './components/UserMenu';
import RecipeSearch from './pages/RecipeSearch';
import FamilySizeAndIngredients from './pages/FamilySizeAndIngredients';
import WeeklyCalendar from './pages/WeeklyCalendar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './components/NotFound';
import { IRecipe } from './models/Recipe.model';
import RecipeRecommendations from './pages/RecipeRecommendation';
import IngredientDashboard from './pages/IngredientDashboard'; 

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true); 
  };

  return (
    <div className="app-container">
      <UserMenu isLoggedIn={isLoggedIn} onLogout={handleLogout} onLogin={handleLogin} />
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<RecipeSearch onSelectRecipe={(recipe: IRecipe) => console.log('Selected recipe:', recipe)} />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Protected Routes */}
        {isLoggedIn ? (
          <>
            <Route path="/config" element={<FamilySizeAndIngredients />} />
            <Route path="/weeklycalendar" element={<WeeklyCalendar />} />
            <Route path="/dashboard" element={<IngredientDashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/recipe-recommendations" element={<RecipeRecommendations />} />
            
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
