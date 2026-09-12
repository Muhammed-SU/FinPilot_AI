import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageToggle } from '../ui/LanguageToggle';
import { useLanguage } from '../../contexts/LanguageContext';
import { FinPilotLogo } from '../ui/FinPilotLogo';
import { register } from '../services/authService';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string, userData?: any) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = t('fullName') + ' is required';
    }
    
    if (!email) {
      newErrors.email = t('emailAddress') + ' is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = t('password') + ' is required';
    } else if (password.length < 6) {
      newErrors.password = t('password') + ' must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const res = await register({ name, email, password });
        if (res.token) {
          localStorage.setItem('token', res.token);
        } else {
          localStorage.setItem('token', 'session-' + Date.now());
        }
        const userData = res.user || { name, email };
        localStorage.setItem('user', JSON.stringify(userData));
        onRegister(name, email, password, userData);
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Registration failed:', err);
        setErrors({
          email: err.response?.data?.error || 'Registration failed. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/40 to-teal-50/30 dark:from-slate-950 dark:via-emerald-950/30 dark:to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Language & Theme toggle */}
      <div className="absolute top-6 right-6 z-10 flex items-center space-x-3">
        <LanguageToggle variant="pill" />
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <FinPilotLogo size="xl" showText={false} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('createAccount')}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{t('registerSubtitle')}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Card className="space-y-5">
            <Input
              label={t('fullName')}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              icon={<User className="w-5 h-5 text-gray-400" />}
              error={errors.name}
            />

            <Input
              label={t('emailAddress')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              error={errors.email}
            />

            <div>
              <div className="relative">
                <Input
                  label={t('password')}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  error={errors.password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 flex space-x-1">
                      {[0, 1, 2, 3].map((index) => (
                        <div
                          key={index}
                          className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                            index < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200 dark:bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Input
              label={t('confirmPassword')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              error={errors.confirmPassword}
            />

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? t('loading') : t('createAccount')}
            </Button>
          </Card>

          <div className="text-center">
            <span className="text-gray-600 dark:text-gray-400 text-sm">{t('alreadyHaveAccount')} </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold text-sm transition-colors"
            >
              {t('signIn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};