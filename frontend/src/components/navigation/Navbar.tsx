import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Globe, LogOut, User, Bell, Sprout } from 'lucide-react';
import axios from 'axios';

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
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!profile) return;
    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get('/api/notifications');
        const unread = res.data.filter((n: any) => !n.is_read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Failed to fetch unread notifications count:', err);
      }
    };
    fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [profile]);

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
      <Link to="/" className="flex items-center gap-1 md:gap-2">
        <Sprout className="w-6 h-6 md:w-7 md:h-7 text-primary shrink-0" />
        <span className="font-extrabold text-lg md:text-xl text-primary tracking-tight font-sans whitespace-nowrap hidden sm:block">
          {t('appName')}
        </span>
      </Link>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-1 py-1 md:px-2">
          <Globe className="w-3 h-3 md:w-4 md:h-4 text-gray-500 hidden sm:block" />
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="bg-transparent text-xs md:text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="mr">मराठी</option>
            <option value="hi">हिन्दी</option>
            <option value="en">English</option>
          </select>
        </div>



        {profile ? (
          <>
            <Link 
              to={
                profile.role === 'shop_owner' ? '/shop' :
                profile.role === 'expert' ? '/expert' :
                profile.role === 'admin' || profile.role === 'super_admin' ? '/admin' :
                '/dashboard'
              } 
              className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors hidden md:inline"
            >
              {t('dashboard')}
            </Link>
            <Link to="/notifications" className="relative p-1.5 text-gray-600 hover:text-primary transition-colors flex items-center justify-center">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white select-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
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
