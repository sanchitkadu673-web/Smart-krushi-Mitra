import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Globe, LogOut, User, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const transliterateName = (name: string, lang: string) => {
  if (lang !== 'mr' && lang !== 'hi') return name;

  const dictionary: Record<string, string> = {
    "sanchit": "संचित",
    "kadu": "कडू",
    "patil": "पाटील",
    "shinde": "शिंदे",
    "pawar": "पवार",
    "farmer": "शेतकरी",
    "admin": "प्रशासक"
  };

  return name
    .split(' ')
    .map(word => {
      const lower = word.toLowerCase();
      return dictionary[lower] || word;
    })
    .join(' ');
};

export const Navbar: React.FC = () => {
  const { profile, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 bg-white/90 shadow-sm px-4 py-3 md:px-8 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🌱</span>
        <span className="font-extrabold text-xl text-primary tracking-tight font-sans">
          {t('appName')}
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
          <Globe className="w-4 h-4 text-gray-500" />
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="mr">मराठी</option>
            <option value="hi">हिन्दी</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-700 dark:hover:bg-slate-700 transition-all focus:outline-none flex items-center justify-center cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {profile ? (
          <>
            <Link to="/dashboard" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors hidden md:inline">
              {t('dashboard')}
            </Link>
            <Link to="/crops" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors hidden md:inline">
              {t('myCrops')}
            </Link>
            <Link to="/notifications" className="relative p-1 text-gray-600 hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
            </Link>
            <Link to="/profile" className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">{transliterateName(profile.full_name, i18n.language)}</span>
            </Link>
            {profile.role === 'admin' && (
              <Link to="/admin" className="text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">{t('logout')}</span>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors px-3 py-1.5 rounded-lg">
              {t('login')}
            </Link>
            <Link to="/register" className="text-sm font-bold bg-primary text-white hover:bg-primary-dark transition-all px-4 py-2 rounded-lg shadow-sm">
              {t('register')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
