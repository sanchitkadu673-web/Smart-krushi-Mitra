import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Globe, LogOut, User, Bell, Sprout, Menu, X, AlertTriangle } from 'lucide-react';
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

const WeatherNotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const weatherAlerts = [
    {
      mr: '🌦️ पुणे: पुढील २४ तासांत मुसळधार पावसाची शक्यता. काढणी केलेले पीक सुरक्षित ठिकाणी ठेवा.',
      hi: '🌦️ पुणे: अगले 24 घंटों में भारी बारिश की संभावना। कटी हुई फसलों को सुरक्षित रखें।',
      en: '🌦️ Pune: Heavy rainfall expected in the next 24 hours. Keep harvested crops safe.'
    },
    {
      mr: '💨 नाशिक: ताशी ४० किमी वेगाने वारे वाहण्याची शक्यता. औषध फवारणी टाळावी.',
      hi: '💨 नाशिक: 40 किमी/घंटा की रफ्तार से तेज हवाएं। कीटनाशक छिड़काव से बचें।',
      en: '💨 Nashik: Strong winds up to 40 km/h. Avoid spraying pesticides.'
    },
    {
      mr: '🌧️ कोल्हापूर: मध्यम ते मुसळधार पाऊस. शेतातून पाण्याचा निचरा योग्य ठेवा.',
      hi: '🌧️ कोल्हापुर: मध्यम से भारी बारिश। खेतों में जल निकासी की उचित व्यवस्था करें।',
      en: '🌧️ Kolhapur: Moderate to heavy rain showers. Ensure proper field drainage.'
    },
    {
      mr: '☀️ नागपूर: तीव्र उष्णतेचा इशारा. जनावरांना सावलीत ठेवा व पिकांना पाणी द्या.',
      hi: '☀️ नागपुर: अत्यधिक गर्मी की चेतावनी। पशुधन को छांव में रखें और फसलों की सिंचाई करें।',
      en: '☀️ Nagpur: High temperature warning. Keep livestock in shade and irrigate crops.'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 text-gray-650 hover:text-primary transition-colors flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg hover:border-primary/30 cursor-pointer"
        title="Weather Alerts"
      >
        <Bell className="w-4 h-4 md:w-5 h-5 text-gray-600 hover:text-primary shrink-0" />
        <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                {lang === 'mr' ? 'हवामान इशारे' : lang === 'hi' ? 'मौसम चेतावनी' : 'Weather Alerts'}
              </h4>
              <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase">
                {lang === 'mr' ? 'थेट' : lang === 'hi' ? 'लाइव' : 'Live'}
              </span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {weatherAlerts.map((alert, idx) => (
                <div 
                  key={idx} 
                  className="p-2.5 rounded-xl bg-red-50/40 dark:bg-red-950/10 border border-red-100/50 dark:border-red-900/20 text-xs text-red-950 dark:text-red-300 font-bold leading-relaxed"
                >
                  {lang === 'mr' ? alert.mr : lang === 'hi' ? alert.hi : alert.en}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { profile, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLandingPage = location.pathname === '/';

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
    <nav className="glass-panel sticky top-0 z-50 bg-white/90 shadow-sm px-4 py-3 md:px-8 flex flex-col justify-center relative">
      <div className="flex items-center justify-between w-full">
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
          
          {isLandingPage && !profile && (
            <WeatherNotificationDropdown />
          )}

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
                <Link to="/admin" className="text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded hidden sm:inline">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="items-center gap-1 text-sm text-red-650 hover:text-red-800 font-semibold transition-colors hidden md:flex"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </>
          ) : (
            <div className="items-center gap-2 hidden sm:flex">
              <Link to="/login" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors px-3 py-1.5 rounded-lg">
                {t('login')}
              </Link>
              <Link to="/register" className="text-sm font-bold bg-primary text-white hover:bg-primary-dark transition-all px-4 py-2 rounded-lg shadow-sm">
                {t('register')}
              </Link>
            </div>
          )}

          {/* Hamburger Menu Icon (Mobile Only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gray-600 hover:text-primary rounded-lg transition-colors md:hidden cursor-pointer flex items-center justify-center"
            title="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Drawer Menu */}
      {mobileMenuOpen && (
        <div className="w-full mt-3 pt-3 border-t border-gray-100 flex flex-col gap-3 md:hidden z-50 animate-fade-in bg-white">
          {profile ? (
            <>
              <Link 
                to={
                  profile.role === 'shop_owner' ? '/shop' :
                  profile.role === 'expert' ? '/expert' :
                  profile.role === 'admin' || profile.role === 'super_admin' ? '/admin' :
                  '/dashboard'
                } 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-gray-700 hover:text-primary transition-colors py-1 flex items-center gap-2"
              >
                <Sprout className="w-4 h-4 text-primary" />
                {t('dashboard')}
              </Link>
              <Link 
                to="/notifications" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-gray-700 hover:text-primary transition-colors py-1 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  {t('notifications') || 'Notifications'}
                </span>
                {unreadCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white select-none">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link 
                to="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-gray-700 hover:text-primary transition-colors py-1 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-primary" />
                {t('profile') || 'Profile'} ({transliterateName(profile.full_name, i18n.language)})
              </Link>
              {profile.role === 'admin' && (
                <Link 
                  to="/admin" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors py-1 flex items-center gap-2"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-sm font-bold text-red-650 hover:text-red-850 transition-colors py-1 flex items-center gap-2 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1 pb-2">
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-primary hover:text-primary-dark transition-colors py-2 rounded-lg text-center border border-primary/20 bg-primary/5"
              >
                {t('login')}
              </Link>
              <Link 
                to="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold bg-primary text-white hover:bg-primary-dark transition-all py-2 rounded-lg shadow-sm text-center"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

