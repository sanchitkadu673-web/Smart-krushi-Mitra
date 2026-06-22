import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  CloudRain, Compass, Calendar, PlusCircle, AlertCircle, AlertTriangle,
  RefreshCw, Sprout, Wind, Droplets, Thermometer,
  Sun, Cloud, CloudLightning, Snowflake, Eye, Building2, MapPin,
  LayoutDashboard, User, LogOut, Bell, Menu, X, Home, ChevronRight, Globe
} from 'lucide-react';
import i18n from 'i18next';

/* ─── helpers ───────────────────────────────────────────────── */

const translateNotification = (notif: { title: string; message: string }) => {
  let { title, message } = notif;
  if (i18n.language === 'mr') {
    title = title
      .replace('Fertilizer Alert:', 'खत व्यवस्थापन सूचना:')
      .replace('Spray Alert:', 'फवारणी सूचना:')
      .replace('Irrigation Alert:', 'पाणी व्यवस्थापन सूचना:')
      .replace('Harvest Alert:', 'पीक काढणी सूचना:')
      .replace('Weather Alert:', 'हवामान इशारा:');
    message = message
      .replace('Apply', 'वापरा')
      .replace('for your', 'तुमच्या')
      .replace('crop', 'पिकासाठी')
      .replace('Time to apply', 'फवारणीची वेळ झाली आहे:')
      .replace('spray to protect your', 'पिकाच्या संरक्षणासाठी फवारणी करा')
      .replace('Water requirement at this stage:', 'या टप्प्यावरील पाण्याची आवश्यकता:')
      .replace('Light watering', 'हलके पाणी')
      .replace('Interval of', 'दिवसांच्या अंतराने')
      .replace('days depending on rain', 'पावसानुसार पाणी द्या')
      .replace('Critical stage: maintain moisture.', 'महत्त्वाचा टप्पा: ओलावा टिकवून ठेवा.')
      .replace('Maintain consistent moisture to avoid boll shedding', 'बोंड गळती रोखण्यासाठी सतत ओलावा टिकवून ठेवा')
      .replace('Your crop is reaching maturity. Plan harvest soon.', 'तुमचे पीक काढणीस आले आहे. लवकरच नियोजन करा.');
  } else if (i18n.language === 'hi') {
    title = title
      .replace('Fertilizer Alert:', 'उर्वरक चेतावनी:')
      .replace('Spray Alert:', 'छिड़काव चेतावनी:')
      .replace('Irrigation Alert:', 'सिंचाई चेतावनी:')
      .replace('Harvest Alert:', 'कटाई चेतावनी:')
      .replace('Weather Alert:', 'मौसम चेतावनी:');
    message = message
      .replace('Apply', 'उपयोग करें')
      .replace('for your', 'अपनी')
      .replace('crop', 'फसल के लिए')
      .replace('Time to apply', 'छिड़काव का समय हो गया है:')
      .replace('spray to protect your', 'फसल सुरक्षा के लिए छिड़काव करें')
      .replace('Water requirement at this stage:', 'इस चरण में पानी की आवश्यकता:')
      .replace('Light watering', 'हल्की सिंचाई')
      .replace('Interval of', 'दिनों के अंतराल पर')
      .replace('days depending on rain', 'बारिश के अनुसार पानी दें')
      .replace('Critical stage: maintain moisture.', 'महत्वपूर्ण चरण: नमी बनाए रखें।')
      .replace('Maintain consistent moisture to avoid boll shedding', 'फूल-बोंड गिरने से बचाने के लिए नमी बनाए रखें')
      .replace('Your crop is reaching maturity. Plan harvest soon.', 'आपकी फसल पकने के कगार पर है। जल्द ही कटाई की योजना बनाएं।');
  }
  return { title, message };
};

const transliterateName = (name: string, lang: string) => {
  if (lang !== 'mr' && lang !== 'hi') return name;
  const dictionary: Record<string, string> = {
    sanchit: 'संचित', kadu: 'कडू', patil: 'पाटील',
    shinde: 'शिंदे', pawar: 'पवार', farmer: 'शेतकरी', admin: 'प्रशासक'
  };
  return name.split(' ').map(w => dictionary[w.toLowerCase()] || w).join(' ');
};

/** Pick a weather emoji/icon based on condition string */
const getWeatherEmoji = (condition: string): string => {
  const c = condition?.toLowerCase() || '';
  if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
  if (c.includes('thunder') || c.includes('storm')) return '⛈️';
  if (c.includes('snow')) return '❄️';
  if (c.includes('cloud') || c.includes('overcast')) return '☁️';
  if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return '🌫️';
  if (c.includes('partly')) return '⛅';
  return '☀️';
};

const WeatherIcon: React.FC<{ condition: string; className?: string }> = ({ condition, className = 'w-5 h-5' }) => {
  const c = condition?.toLowerCase() || '';
  if (c.includes('rain')) return <CloudRain className={className} />;
  if (c.includes('thunder') || c.includes('storm')) return <CloudLightning className={className} />;
  if (c.includes('snow')) return <Snowflake className={className} />;
  if (c.includes('cloud') || c.includes('overcast') || c.includes('partly')) return <Cloud className={className} />;
  if (c.includes('fog') || c.includes('mist')) return <Eye className={className} />;
  return <Sun className={className} />;
};

const formatDay = (dateStr: string, lang: string) => {
  const d = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return lang === 'mr' ? 'आज' : lang === 'hi' ? 'आज' : 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return lang === 'mr' ? 'उद्या' : lang === 'hi' ? 'कल' : 'Tomorrow';
  const locale = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
  return d.toLocaleDateString(locale, { weekday: 'short' });
};

/* ─── main component ─────────────────────────────────────────── */

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const { t } = useTranslation();

  const [crops, setCrops] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [allShops, setAllShops] = useState<any[]>([]);
  const [expandedDashboardShopId, setExpandedDashboardShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* live clock — ticks every second */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleDeleteCrop = async (cropId: string) => {
    const confirmMessage = i18n.language === 'mr' 
      ? 'तुम्हाला हे पीक खरोखर हटवायचे आहे का?' 
      : i18n.language === 'hi' 
      ? 'क्या आप वाकई इस फसल को हटाना चाहते हैं?' 
      : 'Are you sure you want to delete this crop?';

    if (!window.confirm(confirmMessage)) {
      return;
    }
    try {
      await axios.delete(`/api/crops/${cropId}`);
      const successMessage = i18n.language === 'mr' 
        ? 'पीक यशस्वीरित्या हटवले!' 
        : i18n.language === 'hi' 
        ? 'फसल सफलतापूर्वक हटा दी गई!' 
        : 'Crop deleted successfully!';
      toast.success(successMessage);
      fetchDashboardData(true);
    } catch (err: any) {
      const errorMessage = i18n.language === 'mr' 
        ? 'पीक हटवण्यात अडचण आली' 
        : i18n.language === 'hi' 
        ? 'फसल हटाने में त्रुटि हुई' 
        : 'Failed to delete crop';
      toast.error(err.response?.data?.error || errorMessage);
    }
  };

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const [cropsRes, weatherRes, notifRes, allShopsRes] = await Promise.all([
        axios.get('/api/crops').catch(err => {
          console.error('Failed to fetch crops:', err);
          return { data: [] };
        }),
        axios.get('/api/weather/forecast').catch(err => {
          console.error('Failed to fetch weather:', err);
          return { data: { error: true } };
        }),
        axios.get('/api/notifications').catch(err => {
          console.error('Failed to fetch notifications:', err);
          return { data: [] };
        }),
        axios.get('/api/shop/all').catch(err => {
          console.error('Failed to fetch shops:', err);
          return { data: [] };
        })
      ]);

      setCrops(cropsRes.data);
      
      if (weatherRes.data && !weatherRes.data.error) {
        setWeather(weatherRes.data);
      } else {
        setWeather({ error: true });
      }

      setNotifications(notifRes.data);
      setAllShops(allShopsRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Unexpected error in fetchDashboardData:', err);
      if (!silent) {
        const errorMsg = i18n.language === 'mr' 
          ? 'डॅशबोर्ड डेटा लोड करताना त्रुटी आली' 
          : i18n.language === 'hi' 
          ? 'डैशबोर्ड डेटा लोड करने में त्रुटि हुई' 
          : 'Failed to load dashboard data';
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* initial load */
  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  /* auto-refresh every 5 minutes */
  useEffect(() => {
    const id = setInterval(() => fetchDashboardData(true), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchDashboardData]);

  const activeCrops = crops.filter(c => c.status === 'active');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      label: i18n.language === 'mr' ? 'डॅशबोर्ड' : i18n.language === 'hi' ? 'डैशबोर्ड' : 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/dashboard',
      active: true,
    },
    {
      label: i18n.language === 'mr' ? 'पीक जोडा' : i18n.language === 'hi' ? 'फसल जोड़ें' : 'Add Crop',
      icon: <PlusCircle className="w-5 h-5" />,
      path: '/crops/add',
      active: false,
    },
    {
      label: i18n.language === 'mr' ? 'सूचना / शिफारसी' : i18n.language === 'hi' ? 'सूचनाएं / सिफारिशें' : 'Alerts & Tips',
      icon: <Bell className="w-5 h-5" />,
      path: '/notifications',
      active: false,
    },
    {
      label: i18n.language === 'mr' ? 'माझी माहिती' : i18n.language === 'hi' ? 'प्रोफ़ाइल' : 'My Profile',
      icon: <User className="w-5 h-5" />,
      path: '/profile',
      active: false,
    },
    {
      label: i18n.language === 'mr' ? 'मुख्यपृष्ठ' : i18n.language === 'hi' ? 'मुख्यपृष्ठ' : 'Back to Home',
      icon: <Home className="w-5 h-5" />,
      path: '/',
      active: false,
    },
  ];

  /* ── render ── */
  return (
    <div className="min-h-screen bg-[#F4F7F2] dark:bg-slate-950 flex flex-col md:flex-row text-gray-800 dark:text-slate-100">
      
      {/* ── MOBILE HEADER ── */}
      <div className="flex md:hidden items-center justify-between bg-white dark:bg-slate-900 px-4 py-3.5 border-b border-slate-200/60 dark:border-slate-800 sticky top-0 z-40 shadow-sm w-full">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 text-gray-600 dark:text-slate-350 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1.5">
            <Sprout className="w-6 h-6 text-primary" />
            <span className="font-black text-base text-primary tracking-tight">
              {t('appName')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/notifications" className="relative p-1.5 text-gray-600 dark:text-slate-350 hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
            {notifications.filter(n => !n.is_read).length > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white select-none"></span>
            )}
          </Link>
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-1.5 py-1">
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-transparent text-xs font-semibold text-gray-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="mr">मराठी</option>
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── MOBILE SIDEBAR DRAWER (OVERLAY) ── */}
      {isSidebarOpen && (
        <>
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 md:hidden backdrop-blur-sm transition-opacity"
          />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-50 md:hidden flex flex-col shadow-2xl border-r border-slate-200/60 dark:border-slate-800 animate-slide-in">
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sprout className="w-7 h-7 text-primary" />
                <span className="font-extrabold text-lg text-primary tracking-tight">
                  {t('appName')}
                </span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Block */}
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-green-50/30 dark:from-emerald-950/20 dark:to-slate-900 border-b border-slate-150 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center font-black text-xl shadow-inner border border-primary/20">
                {profile?.full_name?.charAt(0).toUpperCase() || 'F'}
              </div>
              <div>
                <h4 className="font-extrabold text-[#1A2E1A] dark:text-[#F7FAF4]">
                  {transliterateName(profile?.full_name || 'Farmer', i18n.language)}
                </h4>
                <p className="text-xs text-[#1B5E20] dark:text-[#4CAF50] font-bold bg-[#4CAF50]/10 px-2 py-0.5 rounded-full inline-block mt-1">
                  {i18n.language === 'mr' ? 'शेतकरी' : i18n.language === 'hi' ? 'किसान' : 'Farmer'}
                </p>
              </div>
            </div>

            {/* Menu Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                    item.active
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-gray-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-primary dark:hover:text-primary'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Logout Footer */}
            <div className="p-4 border-t border-slate-150 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-650 dark:text-red-400 font-extrabold py-3 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── DESKTOP SIDEBAR (FIXED) ── */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 h-screen sticky top-0 shrink-0">
        <div className="p-6 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800">
          <Sprout className="w-8 h-8 text-primary shrink-0" />
          <span className="font-extrabold text-xl text-primary tracking-tight">
            {t('appName')}
          </span>
        </div>

        {/* User Card */}
        <div className="m-4 p-4 rounded-2xl bg-gradient-to-br from-[#F7FAF4] to-[#EEF5E6] dark:from-emerald-950/30 dark:to-slate-800 border border-[#4CAF50]/15 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg border border-primary/20 shrink-0">
            {profile?.full_name?.charAt(0).toUpperCase() || 'F'}
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-sm text-[#1A2E1A] dark:text-[#F7FAF4] truncate">
              {transliterateName(profile?.full_name || 'Farmer', i18n.language)}
            </h4>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 font-semibold truncate flex items-center gap-0.5 mt-0.5">
              <MapPin className="w-3 h-3 text-primary shrink-0" />
              {profile?.village}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                item.active
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-primary dark:hover:text-primary'
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer (Language + Logout) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
            <Globe className="w-4 h-4 text-gray-500 dark:text-slate-400 shrink-0" />
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-transparent text-xs font-bold text-gray-700 dark:text-slate-200 focus:outline-none cursor-pointer w-full"
            >
              <option value="mr">मराठी</option>
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
            </select>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-extrabold py-2.5 rounded-xl transition-colors text-sm"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* DESKTOP TOP HEADER */}
        <div className="hidden md:flex items-center justify-between bg-white dark:bg-slate-900 px-8 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 px-3 py-1.5 rounded-full select-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {i18n.language === 'mr' ? 'थेट' : i18n.language === 'hi' ? 'लाइव' : 'LIVE'}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {i18n.language === 'mr' ? 'सिस्टम कार्यरत आहे' : i18n.language === 'hi' ? 'सिस्टम सक्रिय है' : 'System Operational'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Clock & Date */}
            <div className="flex items-center gap-3 bg-[#EEF5E6] dark:bg-slate-800 px-4 py-2 rounded-2xl border border-primary/10">
              <Calendar className="w-4 h-4 text-primary shrink-0 animate-pulse" />
              <span className="text-sm font-extrabold text-[#1B5E20] dark:text-[#4CAF50] tabular-nums">
                {now.toLocaleTimeString(i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="text-xs text-[#1A2E1A]/40 dark:text-slate-400">|</span>
              <span className="text-xs font-bold text-[#1A2E1A] dark:text-slate-200">
                {new Date().toLocaleDateString(i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="p-2.5 bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl shadow-sm text-gray-600 dark:text-slate-300 hover:text-primary transition-colors disabled:opacity-50"
              title={i18n.language === 'mr' ? 'ताजे करा' : i18n.language === 'hi' ? 'ताज़ा करें' : 'Refresh'}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── LIVE WEATHER ALERT TICKER ── */}
        <div className="bg-[#2D0A0A] border-b border-red-500/20 overflow-hidden shrink-0">
          <div className="flex items-center">
            {/* Label Badge */}
            <div className="shrink-0 bg-[#D32F2F] text-white text-xs font-black px-4 py-3 flex items-center gap-2 z-10 select-none">
              <span className="w-2 h-2 bg-white rounded-full animate-ping shrink-0"></span>
              <AlertTriangle className="w-4 h-4 text-white animate-pulse shrink-0" />
              <span className="whitespace-nowrap">
                {i18n.language === 'mr' ? 'हवामान इशारा' : i18n.language === 'hi' ? 'मौसम चेतावनी' : 'WEATHER ALERT'}
              </span>
            </div>
            {/* Scrolling Ticker */}
            <div className="overflow-hidden flex-1 relative min-w-0">
              <div className="animate-marquee py-3 flex whitespace-nowrap">
                {[
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
                  },
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
                ].map((item, i) => (
                  <div key={i} className="shrink-0 flex items-center gap-3 mx-8 text-red-100 font-medium text-sm">
                    <span>{i18n.language === 'mr' ? item.mr : i18n.language === 'hi' ? item.hi : item.en}</span>
                    <span className="text-red-500/30 text-lg ml-4">|</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SCROLLABLE MAIN CONTENT WRAPPER */}
        <div className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">
          
          {/* Welcome Premium Greeting Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-green-600 dark:from-emerald-950 dark:to-slate-900 rounded-[2rem] p-6 md:p-8 text-white shadow-xl shadow-emerald-900/15 border border-emerald-700/20 animate-fade-up">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                  {i18n.language === 'mr' ? 'राम राम' : i18n.language === 'hi' ? 'नमस्कार' : 'Welcome'}, {transliterateName(profile?.full_name || 'Farmer', i18n.language)}!
                </h2>
                <p className="text-sm md:text-base text-emerald-100 font-medium max-w-xl">
                  {i18n.language === 'mr' 
                    ? `तुमचा शेती सोबती सक्रिय आहे. गाव: ${profile?.village || 'उपलब्ध नाही'}, तालुका: ${profile?.taluka || 'उपलब्ध नाही'}` 
                    : i18n.language === 'hi' 
                    ? `आपका कृषि साथी सक्रिय है। गाँव: ${profile?.village || 'N/A'}, तहसील: ${profile?.taluka || 'N/A'}` 
                    : `Your smart farming assistant is active. Village: ${profile?.village || 'N/A'}, Taluka: ${profile?.taluka || 'N/A'}`}
                </p>
                {lastUpdated && (
                  <p className="text-[10px] text-white/50 mt-3 font-semibold">
                    {i18n.language === 'mr' ? 'शेवटचे अपडेट: ' : i18n.language === 'hi' ? 'अंतिम अपडेट: ' : 'Last updated: '}
                    {lastUpdated.toLocaleTimeString(i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                    &nbsp;·&nbsp;
                    {i18n.language === 'mr' ? 'दर ५ मिनिटांनी स्वयंचलित ताजे' : 'Auto-refreshes every 5 mins'}
                  </p>
                )}
              </div>

              {/* Counter badges */}
              <div className="flex gap-4 shrink-0 w-full md:w-auto">
                <div className="flex-1 md:flex-initial bg-white/10 backdrop-blur-md border border-white/10 px-5 py-4 rounded-2xl text-center">
                  <span className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1">
                    {i18n.language === 'mr' ? 'एकूण पिके' : i18n.language === 'hi' ? 'कुल फसलें' : 'Total Crops'}
                  </span>
                  <span className="text-2xl font-black tabular-nums">{crops.length}</span>
                </div>
                <div className="flex-1 md:flex-initial bg-white/10 backdrop-blur-md border border-white/10 px-5 py-4 rounded-2xl text-center">
                  <span className="block text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1">
                    {i18n.language === 'mr' ? 'नवीन शिफारसी' : i18n.language === 'hi' ? 'सिफारिशें' : 'Alerts'}
                  </span>
                  <span className="text-2xl font-black tabular-nums">{notifications.filter(n => !n.is_read).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT 2 COLUMNS: CROPS & STORES */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Active Crops Widget */}
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-premium-3d">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2.5">
                    <Sprout className="text-primary w-5 h-5 shrink-0" />
                    {t('myCrops')}
                    {!loading && (
                      <span className="text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {activeCrops.length} {i18n.language === 'mr' ? 'सक्रिय' : i18n.language === 'hi' ? 'सक्रिय' : 'Active'}
                      </span>
                    )}
                  </h3>
                  <Link
                    to="/crops/add"
                    className="text-xs bg-primary hover:bg-emerald-600 text-white font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-primary/10"
                  >
                    <PlusCircle className="w-4 h-4 shrink-0" /> {t('addCrop')}
                  </Link>
                </div>

                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-gray-50 dark:bg-slate-800 rounded-2xl" />
                    <div className="h-20 bg-gray-50 dark:bg-slate-800 rounded-2xl" />
                  </div>
                ) : activeCrops.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/30">
                    <p className="text-gray-400 dark:text-slate-500 text-sm mb-4 font-semibold">{t('noCrops')}</p>
                    <Link to="/crops/add" className="inline-flex items-center gap-1.5 text-primary font-black hover:underline text-sm bg-primary/5 px-4 py-2 rounded-xl">
                      {i18n.language === 'mr' ? 'तुमचे पहिले पीक आता जोडा →' : i18n.language === 'hi' ? 'अपनी पहली फसल अभी जोड़ें →' : 'Add your first crop now →'}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {activeCrops.map(crop => {
                      const days = Math.floor(
                        (Date.now() - new Date(crop.sowing_date).getTime()) / (1000 * 60 * 60 * 24)
                      );
                      
                      const totalDuration = crop.crop_master.duration_days || 120;
                      const progressPercentage = Math.min(Math.round((days / totalDuration) * 100), 100);

                      return (
                        <div
                          key={crop.id}
                          className="group p-5 bg-[#F7FAF4] dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 hover:border-primary/20 rounded-2xl transition-all duration-305 hover:-translate-y-1 shadow-sm relative flex flex-col justify-between text-left"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-3">
                              <h4 className="font-black text-lg text-[#1A2E1A] dark:text-[#F7FAF4] group-hover:text-primary transition-colors leading-snug">
                                {crop.crop_master.name}
                              </h4>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[10px] font-bold bg-[#4CAF50]/15 text-[#1B5E20] dark:text-[#4CAF50] px-2.5 py-1 rounded-full border border-green-200/20">
                                  {t('active')}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleDeleteCrop(crop.id);
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title={i18n.language === 'mr' ? 'पीक हटवा' : i18n.language === 'hi' ? 'फसल हटाएं' : 'Delete Crop'}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                              {t('sowingDate')}: <span className="font-bold text-gray-700 dark:text-slate-350">{crop.sowing_date}</span>
                            </p>
                          </div>

                          <div className="mt-5 space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold text-gray-500 dark:text-slate-400">
                              <span>{i18n.language === 'mr' ? 'कालावधी प्रगती' : 'Progress'}</span>
                              <span className="tabular-nums">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200/70 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full transition-all duration-500" 
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between text-xs font-extrabold">
                            <span className="text-[#1A2E1A]/70 dark:text-slate-350 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-750 font-semibold">
                              {t('age')}: <span className="text-primary font-bold">{days}</span> {t('days')}
                            </span>
                            <Link to={`/crops/${crop.id}`} className="text-primary hover:text-emerald-600 hover:underline flex items-center gap-0.5">
                              {t('viewTimeline')} <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* All Registered Shops Widget */}
              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-premium-3d">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2.5">
                  <Building2 className="text-primary w-5 h-5 shrink-0" />
                  {i18n.language === 'mr' ? 'प्लॅटफॉर्मवरील सर्व नोंदणीकृत दुकाने' : i18n.language === 'hi' ? 'प्लेटफ़ॉर्म पर सभी पंजीकृत दुकानें' : 'All Registered Shops on Platform'}
                </h3>
                <p className="text-xs text-gray-400 dark:text-slate-500 mb-6 font-medium">
                  {i18n.language === 'mr' ? 'खालील दुकानांमध्ये खते, औषधे आणि शेती साहित्य उपलब्ध आहे.' : i18n.language === 'hi' ? 'निम्नलिखित दुकानों में उर्वरक, दवाएं और कृषि सामग्री उपलब्ध हैं।' : 'Fertilizer, seed, and agriculture material shops registered on the platform.'}
                </p>

                {allShops.length === 0 ? (
                  <p className="text-gray-450 dark:text-slate-500 text-xs text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    {i18n.language === 'mr' ? 'सध्या कोणतेही दुकान नोंदणीकृत नाही.' : i18n.language === 'hi' ? 'वर्तमान में कोई भी दुकान पंजीकृत नहीं है।' : 'No registered shops found at the moment.'}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {allShops.map((shop) => (
                      <div 
                        key={shop.id}
                        onClick={() => setExpandedDashboardShopId(expandedDashboardShopId === shop.id ? null : shop.id)}
                        className="p-5 border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-[#F7FAF4]/40 dark:bg-slate-850/30 hover:border-primary/20 hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer select-none"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 transition-transform duration-200 shrink-0" style={{ transform: expandedDashboardShopId === shop.id ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>▶</span>
                              <h4 className="font-black text-slate-900 dark:text-white text-base leading-snug">🏪 {shop.shop_name}</h4>
                            </div>
                            <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full shrink-0">
                              Active
                            </span>
                          </div>
                          <div className="text-xs space-y-1 text-slate-650 dark:text-slate-350">
                            <p><span className="font-bold text-slate-700 dark:text-slate-200">{i18n.language === 'mr' ? 'मालक' : i18n.language === 'hi' ? 'मालिक' : 'Owner'}:</span> {shop.owner_name}</p>
                            <p><span className="font-bold text-slate-700 dark:text-slate-200">{i18n.language === 'mr' ? 'मोबाईल' : i18n.language === 'hi' ? 'मोबाइल' : 'Mobile'}:</span> <a href={`tel:${shop.owner_mobile}`} onClick={(e) => e.stopPropagation()} className="text-primary font-bold hover:underline">{shop.owner_mobile}</a></p>
                            <p><span className="font-bold text-slate-700 dark:text-slate-200">GST / Lic:</span> <span className="font-mono">{shop.license_number || 'N/A'}</span></p>
                            <p className="text-[11px] text-[#1A2E1A]/60 dark:text-slate-400 mt-1 flex items-start gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> 
                              <span className="leading-snug">{shop.address}</span>
                            </p>
                          </div>
                        </div>

                        {/* Collapsible products list */}
                        {expandedDashboardShopId === shop.id && (
                          <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-3" onClick={(e) => e.stopPropagation()}>
                            <h5 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <span className="w-1.5 h-3 bg-primary rounded-full" />
                              {i18n.language === 'mr' ? 'उपलब्ध साहित्य व स्टॉक' : i18n.language === 'hi' ? 'उपलब्ध स्टॉक' : 'Available Products & Stock'}
                            </h5>
                            {!shop.products || shop.products.length === 0 ? (
                              <p className="text-[11px] text-gray-400 dark:text-slate-500 italic py-2">
                                {i18n.language === 'mr' ? 'या दुकानात सध्या कोणतेही उत्पादन उपलब्ध नाही.' : i18n.language === 'hi' ? 'इस दुकान में वर्तमान में कोई उत्पाद उपलब्ध नहीं है।' : 'No products available in this shop currently.'}
                              </p>
                            ) : (
                              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {shop.products.map((p: any) => (
                                  <div key={p.id} className="p-2.5 bg-white dark:bg-slate-905 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-[11px] hover:border-primary/20 transition-all">
                                    <div className="pr-2">
                                      <p className="font-black text-slate-800 dark:text-slate-250">{p.name}</p>
                                      <p className="text-[9px] text-gray-400 font-bold mt-0.5">{p.company} | {p.category}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="font-black text-slate-950 dark:text-slate-100">₹{p.price}</p>
                                      {p.stock_quantity <= 0 ? (
                                        <span className="text-[8px] font-black text-red-650 bg-red-50 dark:bg-red-950/20 px-1.5 py-0.5 rounded">
                                          {i18n.language === 'mr' ? 'संपला' : i18n.language === 'hi' ? 'समाप्त' : 'Out of Stock'}
                                        </span>
                                      ) : (
                                        <span className="text-[8px] font-black text-green-700 bg-green-50 dark:bg-green-950/20 px-1.5 py-0.5 rounded">
                                          {i18n.language === 'mr' ? `स्टॉक: ${p.stock_quantity}` : i18n.language === 'hi' ? `स्टॉक: ${p.stock_quantity}` : `Stock: ${p.stock_quantity}`}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: WEATHER FORECAST & ALERTS FEED */}
            <div className="space-y-8">
              
              {/* Modern Weather Card Widget */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-premium-3d relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 dark:bg-primary/10 rounded-full -mr-12 -mt-12 blur-md" />

                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2.5 relative z-10">
                  <CloudRain className="text-primary w-5 h-5 shrink-0" />
                  {t('weatherToday')}
                </h3>

                {loading || !weather ? (
                  <div className="animate-pulse space-y-5">
                    <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl w-3/4" />
                  </div>
                ) : weather.error ? (
                  <div className="text-center py-6 space-y-3">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-bold">
                      {i18n.language === 'mr' ? 'हवामान माहिती लोड करता आली नाही' : i18n.language === 'hi' ? 'मौसम डेटा प्राप्त करने में असमर्थ' : 'Unable to load weather data'}
                    </p>
                    <button
                      onClick={() => fetchDashboardData(true)}
                      className="text-xs bg-primary hover:bg-emerald-600 text-white font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 mx-auto shadow-sm cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> {i18n.language === 'mr' ? 'पुन्हा प्रयत्न करा' : i18n.language === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
                    </button>
                  </div>
                ) : (
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-5xl font-black text-gray-900 dark:text-white tabular-nums tracking-tight">
                          {weather.temperature}°C
                        </span>
                        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                          <WeatherIcon condition={weather.condition} className="w-3.5 h-3.5 text-primary" />
                          {weather.condition}
                        </p>
                      </div>
                      <div className="p-3 bg-amber-500/10 dark:bg-amber-400/10 rounded-2xl border border-amber-500/10 shrink-0">
                        <WeatherIcon condition={weather.condition} className="w-10 h-10 text-amber-500 shrink-0" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-5">
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850/50 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/40">
                        <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 block tracking-wider uppercase">{t('humidity')}</span>
                          <span className="text-sm text-gray-900 dark:text-white font-extrabold tabular-nums">{weather.humidity}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-850/50 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/40">
                        <Wind className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 block tracking-wider uppercase">{t('windSpeed')}</span>
                          <span className="text-sm text-gray-900 dark:text-white font-extrabold tabular-nums">{weather.windSpeed} km/h</span>
                        </div>
                      </div>
                    </div>

                    {weather.rainAlert && (
                      <div className="p-3.5 bg-red-50/80 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs font-bold rounded-2xl border border-red-150 dark:border-red-900/30 flex items-start gap-2.5 animate-glow-pulse">
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-450 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{t('rainAlertWarning')}</span>
                      </div>
                    )}

                    {weather.forecast && weather.forecast.length > 0 && (
                      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5">
                        <p className="text-xs font-black text-gray-400 dark:text-slate-550 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                          <span className="w-1.5 h-3.5 bg-primary rounded-full" />
                          {i18n.language === 'mr' ? 'पुढील ५ दिवस हवामान' : i18n.language === 'hi' ? 'अगले ५ दिन का मौसम' : 'Next 5 Days Forecast'}
                        </p>
                        <div className="space-y-2.5">
                          {weather.forecast.slice(0, 5).map((day: any, idx: number) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl border border-transparent transition-all ${
                                idx === 0 
                                  ? 'bg-[#4CAF50]/10 border-[#4CAF50]/10 text-emerald-900 dark:text-emerald-400 font-bold' 
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-850/80 text-gray-700 dark:text-slate-350'
                              }`}
                            >
                              <span className="font-extrabold w-12">{formatDay(day.date, i18n.language)}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                <WeatherIcon condition={day.condition} className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                                {day.rainAlert && (
                                  <CloudRain className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                )}
                              </div>
                              <div className="text-right font-black tabular-nums">
                                <span className="text-gray-900 dark:text-white">{day.tempMax}°</span>
                                <span className="text-gray-400 ml-1.5 font-bold">{day.tempMin}°</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recommendations/Alerts list Widget */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-premium-3d">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2.5">
                  <AlertCircle className="text-primary w-5 h-5 shrink-0" />
                  {t('recentRecommendations')}
                </h3>

                {loading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-14 bg-gray-50 dark:bg-slate-800 rounded-xl" />
                    <div className="h-14 bg-gray-50 dark:bg-slate-800 rounded-xl" />
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="text-gray-400 dark:text-slate-500 text-xs text-center py-8 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl border border-slate-100 dark:border-slate-850">
                    {i18n.language === 'mr' ? 'सध्या कोणत्याही शिफारसी नाहीत.' : i18n.language === 'hi' ? 'वर्तमान में कोई सिफारिशें नहीं हैं।' : 'No recommendations at the moment.'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map(notif => {
                      const translated = translateNotification(notif);
                      
                      let typeBadgeBg = "bg-green-500/10 text-green-700 dark:text-green-400";
                      let borderStyle = "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900";
                      
                      if (notif.type === 'spray') {
                        typeBadgeBg = "bg-amber-500/10 text-amber-700 dark:text-amber-400";
                      } else if (notif.type === 'irrigation' || notif.type === 'weather') {
                        typeBadgeBg = "bg-blue-500/10 text-blue-700 dark:text-blue-400";
                      }
                      
                      if (!notif.is_read) {
                        borderStyle = "border-green-150 dark:border-emerald-800/60 bg-green-50/10 dark:bg-emerald-950/10";
                      }

                      return (
                        <div
                          key={notif.id}
                          className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all hover:scale-[1.01] duration-200 ${borderStyle}`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${typeBadgeBg}`}>
                            {notif.type === 'fertilizer' ? (
                              <Sprout className="w-4.5 h-4.5" />
                            ) : notif.type === 'spray' ? (
                              <Wind className="w-4.5 h-4.5" />
                            ) : (
                              <Droplets className="w-4.5 h-4.5" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-xs text-gray-900 dark:text-white leading-tight">{translated.title}</h4>
                            <p className="text-[11px] text-gray-600 dark:text-slate-400 font-medium leading-relaxed">{translated.message}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
