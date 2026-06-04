import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CloudRain, Compass, Calendar, PlusCircle, AlertCircle, RefreshCw, Sprout } from 'lucide-react';

import i18n from 'i18next';

const translateNotification = (notif: { title: string; message: string }) => {
  let title = notif.title;
  let message = notif.message;

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

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { t } = useTranslation();

  const [crops, setCrops] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [cropsRes, weatherRes, notifRes] = await Promise.all([
        axios.get('/api/crops'),
        axios.get('/api/weather/forecast'),
        axios.get('/api/notifications')
      ]);

      setCrops(cropsRes.data);
      setWeather(weatherRes.data);
      setNotifications(notifRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activeCrops = crops.filter(c => c.status === 'active');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Header summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {t('welcome')}, {transliterateName(profile?.full_name || 'Farmer', i18n.language)}
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" /> {profile?.village}, {profile?.taluka}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm bg-white border border-gray-200 px-3 py-2 rounded-xl text-gray-600 font-medium flex items-center gap-2 shadow-sm">
              <Calendar className="w-4 h-4 text-primary" /> {new Date().toLocaleDateString()}
            </span>
            <button 
              onClick={() => window.location.reload()}
              className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-sm text-gray-600 hover:text-primary transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Crops Widget */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sprout className="text-primary w-5 h-5" /> {t('myCrops')}
                </h3>
                <Link to="/crops/add" className="text-sm bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                  <PlusCircle className="w-4 h-4" /> {t('addCrop')}
                </Link>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-gray-100 rounded-xl"></div>
                  <div className="h-16 bg-gray-100 rounded-xl"></div>
                </div>
              ) : activeCrops.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-gray-400 text-sm mb-4">{t('noCrops')}</p>
                  <Link to="/crops/add" className="text-primary font-bold hover:underline">
                    Add your first crop now &rarr;
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCrops.map(crop => {
                    const days = Math.floor((Date.now() - new Date(crop.sowing_date).getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <Link 
                        key={crop.id} 
                        to={`/crops/${crop.id}`}
                        className="p-5 bg-background border border-gray-100 hover:border-primary/20 rounded-xl block transition-card"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-extrabold text-lg text-gray-900">{crop.crop_master.name}</h4>
                          <span className="text-xs font-bold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                            {t('active')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{t('sowingDate')}: {crop.sowing_date}</p>
                        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-gray-600">
                          <span>{t('age')}: {days} {t('days')}</span>
                          <span className="text-primary">{t('viewTimeline')} &rarr;</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications / Tasks Panel */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertCircle className="text-primary w-5 h-5" /> {t('recentRecommendations')}
              </h3>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-100 rounded-xl"></div>
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">No recent tasks or recommended activities.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 5).map(notif => {
                    const translated = translateNotification(notif);
                    return (
                      <div 
                        key={notif.id} 
                        className={`p-4 rounded-xl border flex items-start gap-3.5 transition-colors ${
                          notif.is_read ? 'bg-gray-50/50 border-gray-100' : 'bg-green-50/20 border-green-100'
                        }`}
                      >
                        <span className="text-xl">
                          {notif.type === 'fertilizer' ? '🧪' : notif.type === 'spray' ? '💨' : '💧'}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-900">{translated.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{translated.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Weather Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-8 -mt-8"></div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CloudRain className="text-primary w-5 h-5" /> {t('weatherToday')}
              </h3>

              {loading || !weather ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-100 rounded-xl"></div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-4xl font-extrabold text-gray-900">{weather.temperature}°C</span>
                      <p className="text-sm text-gray-500 mt-1 font-semibold">{weather.condition}</p>
                    </div>
                    <span className="text-4xl">☀️</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm font-medium border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-gray-400 block text-xs">{t('humidity')}</span>
                      <span className="text-gray-900 font-bold">{weather.humidity}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-xs">{t('windSpeed')}</span>
                      <span className="text-gray-900 font-bold">{weather.windSpeed} km/h</span>
                    </div>
                  </div>

                  {weather.rainAlert && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                      ⚠️ {t('rainAlertWarning')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
