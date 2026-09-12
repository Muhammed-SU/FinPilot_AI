import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Sidebar } from './components/navigation/Sidebar';
import { BottomNav } from './components/navigation/BottomNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { TransactionTable } from './components/transactions/TransactionTable';
import { BudgetOverview } from './components/budget/BudgetOverview';
import { CategoryManager } from './components/categories/CategoryManager';
import { AIInsights } from './components/insights/AIInsights';
import { FinPilotLogo } from './components/ui/FinPilotLogo';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { User } from './types';
import { aiInsights } from './data/mockData';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && (parsedUser.email || parsedUser.name)) {
            setUser(parsedUser);
            // Ensure token is present so downstream API interceptors don't fail
            if (!token) {
              localStorage.setItem('token', 'session-' + Date.now());
            }
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (email: string, password: string, userData?: any) => {
    const user = userData || { name: email.split('@')[0], email };
    setUser(user);
    // Store user data in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(user));
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'session-' + Date.now());
    }
  };

  const handleRegister = (name: string, email: string, password: string, userData?: any) => {
    const user = userData || { name, email };
    setUser(user);
    // Store user data in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(user));
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'session-' + Date.now());
    }
  };

  const handleLogout = () => {
    setUser(null);
    // Clear all auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/50 to-teal-50/40 dark:from-slate-950 dark:via-emerald-950/40 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4 animate-pulse">
            <FinPilotLogo size="xl" showText={false} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading FinPilot</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/40 to-teal-50/30 dark:from-slate-950 dark:via-emerald-950/30 dark:to-slate-900 transition-all duration-500">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {!user ? (
          <div className="relative z-10">
            <Routes>
              <Route 
                path="/login" 
                element={
                  <LoginForm 
                    onLogin={handleLogin}
                    onSwitchToRegister={() => {}}
                  />
                } 
              />
              <Route 
                path="/register" 
                element={
                  <RegisterForm 
                    onRegister={handleRegister}
                    onSwitchToLogin={() => {}}
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        ) : (
          <>
            {/* Fixed Sidebar */}
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              onLogout={handleLogout}
            />
            
            {/* Main Content Area */}
            <div className={`transition-all duration-300 relative z-10 ${
              isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
            }`}>
              <main className="min-h-screen p-6 pb-20 md:pb-6">
                <Routes>
                  <Route 
                    path="/dashboard" 
                    element={<Dashboard />} 
                  />
                  <Route 
                    path="/transactions" 
                    element={<TransactionTable />} 
                  />
                  <Route 
                    path="/budget" 
                    element={<BudgetOverview />} 
                  />
                  <Route 
                    path="/categories" 
                    element={<CategoryManager />} 
                  />
                  <Route 
                    path="/insights" 
                    element={<AIInsights insights={aiInsights} />} 
                  />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
            
            {/* Mobile Bottom Navigation */}
            <BottomNav />
          </>
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;