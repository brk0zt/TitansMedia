import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';

type AuthView = 'login' | 'register' | 'forgot-password';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AuthView>('login');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-titans-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-8 h-8 text-titans-accent/60" strokeWidth={1.5} />
          </motion.div>
          <p className="text-white/30 text-sm font-[425]">Loading FBTool...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <>
      {currentView === 'login' && (
        <LoginForm
          onSuccess={() => {}}
          onNavigateToRegister={() => setCurrentView('register')}
          onNavigateToForgotPassword={() => setCurrentView('forgot-password')}
        />
      )}
      {currentView === 'register' && (
        <RegisterForm
          onSuccess={() => {}}
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}
      {currentView === 'forgot-password' && (
        <ForgotPassword
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}
    </>
  );
};

export default App;
