import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  CloudRain, Compass, Calendar, PlusCircle, AlertCircle,
  RefreshCw, Sprout, Wind, Droplets, Thermometer,
  Sun, Cloud, CloudLightning, Snowflake, Eye, Building2, MapPin
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
  const { profile } = useAuth();
  const { t } = useTranslation();

  const [crops, setCrops] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [linkedShopData, setLinkedShopData] = useState<{ shop: any; products: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [now, setNow] = useState(new Date());

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
      const [cropsRes, weatherRes, notifRes, shopRes] = await Promise.all([
        axios.get('/api/crops'),
        axios.get('/api/weather/forecast'),
        axios.get('/api/notifications'),
        axios.get('/api/shop/linked').catch(() => ({ data: { shop: null, products: [] } }))
      ]);
      setCrops(cropsRes.data);
      setWeather(weatherRes.data);
      setNotifications(notifRes.data);
      setLinkedShopData(shopRes.data);
      setLastUpdated(new Date());
    } catch {
      if (!silent) toast.error('Dashboard data लोड होण्यात अडचण आली');
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

  /* ── render ── */
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {t('welcome')}, {transliterateName(profile?.full_name || 'Farmer', i18n.language)}
            </h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              {profile?.village}, {profile?.taluka}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Live indicator */}
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {i18n.language === 'mr' ? 'थेट' : i18n.language === 'hi' ? 'लाइव' : 'LIVE'}
            </span>

            {/* Live clock */}
            <span className="text-sm bg-white border border-gray-200 px-3 py-2 rounded-xl text-gray-700 font-mono font-bold shadow-sm tabular-nums">
              {now.toLocaleTimeString(i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>

            {/* Date */}
            <span className="text-sm bg-white border border-gray-200 px-3 py-2 rounded-xl text-gray-600 font-medium flex items-center gap-2 shadow-sm">
              <Calendar className="w-4 h-4 text-primary" />
              {new Date().toLocaleDateString(i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>

            {/* Manual refresh */}
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl shadow-sm text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
              title={i18n.language === 'mr' ? 'ताजे करा' : i18n.language === 'hi' ? 'ताज़ा करें' : 'Refresh'}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Last updated badge */}
        {lastUpdated && (
          <p className="text-xs text-gray-400 mb-6 -mt-4">
            {i18n.language === 'mr' ? 'शेवटचे अपडेट: ' : i18n.language === 'hi' ? 'अंतिम अपडेट: ' : 'Last updated: '}
            {lastUpdated.toLocaleTimeString(i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            &nbsp;·&nbsp;
            {i18n.language === 'mr' ? 'दर ५ मिनिटांनी आपोआप ताजे होते' : i18n.language === 'hi' ? 'हर ५ मिनट में स्वचालित रूप से ताज़ा होता है' : 'Auto-refreshes every 5 mins'}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main (2/3 width) ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Active Crops */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sprout className="text-primary w-5 h-5" /> {t('myCrops')}
                  {!loading && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                      {activeCrops.length} {i18n.language === 'mr' ? 'सक्रिय' : i18n.language === 'hi' ? 'सक्रिय' : 'Active'}
                    </span>
                  )}
                </h3>
                <Link
                  to="/crops/add"
                  className="text-sm bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> {t('addCrop')}
                </Link>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-gray-100 rounded-xl" />
                  <div className="h-16 bg-gray-100 rounded-xl" />
                </div>
              ) : activeCrops.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-gray-400 text-sm mb-4">{t('noCrops')}</p>
                  <Link to="/crops/add" className="text-primary font-bold hover:underline">
                    {i18n.language === 'mr' ? 'तुमचे पहिले पीक आता जोडा →' : i18n.language === 'hi' ? 'अपनी पहली फसल अभी जोड़ें →' : 'Add your first crop now →'}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCrops.map(crop => {
                    const days = Math.floor(
                      (Date.now() - new Date(crop.sowing_date).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div
                        key={crop.id}
                        className="p-5 bg-[#F7FAF4] dark:bg-slate-850 border border-slate-100 dark:border-slate-800 hover:border-primary/20 rounded-2xl relative block transition-card shadow-sm text-left"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-extrabold text-lg text-[#1A2E1A] dark:text-[#F7FAF4]">
                            {crop.crop_master.name}
                          </h4>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold bg-[#4CAF50]/15 text-[#1B5E20] dark:text-[#4CAF50] px-2.5 py-1 rounded-full">
                              {t('active') || 'Active'}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleDeleteCrop(crop.id);
                              }}
                              className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                              title={i18n.language === 'mr' ? 'पीक हटवा' : i18n.language === 'hi' ? 'फसल हटाएं' : 'Delete Crop'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{t('sowingDate') || 'Sowing Date'}: {crop.sowing_date}</p>
                        <div className="mt-4 flex items-center justify-between text-xs font-bold">
                          <span className="text-[#1A2E1A]/70 dark:text-slate-300">{t('age') || 'Age'}: {days} {t('days') || 'Days'}</span>
                          <Link to={`/crops/${crop.id}`} className="text-primary hover:underline flex items-center gap-1">
                            {t('viewTimeline') || 'View Timeline'} →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Linked Shop Stock */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="text-primary w-5 h-5" /> {i18n.language === 'mr' ? 'माझे जोडलेले दुकान' : i18n.language === 'hi' ? 'मेरी जुड़ी हुई दुकान' : 'My Linked Shop'}
              </h3>
              
              {!linkedShopData?.shop ? (
                <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-slate-100 text-sm">
                  <p className="text-gray-500 font-medium">
                    {i18n.language === 'mr' ? 'तुमचे खाते अद्याप कोणत्याही दुकानाशी जोडलेले नाही.' : i18n.language === 'hi' ? 'आपका खाता अभी किसी दुकान से नहीं जुड़ा है।' : 'Your account is not linked to any shop yet.'}
                  </p>
                  <p className="text-gray-400 mt-1">
                    {i18n.language === 'mr' ? 'तुमच्या गावातील दुकानदार तुम्हाला त्यांच्याकडे नोंदणी करतील, तेव्हा तुम्हाला त्यांचा स्टॉक आणि दर दिसतील.' : i18n.language === 'hi' ? 'जब आपके गांव के दुकानदार आपको अपने साथ पंजीकृत करेंगे, तो आप उनका स्टॉक और दरें देख पाएंगे।' : 'Once a shop owner in your village registers you, you will see their stock and prices here.'}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-lg">{linkedShopData.shop.shop_name}</h4>
                      <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> {linkedShopData.shop.address}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shrink-0">
                      ✓ {i18n.language === 'mr' ? 'जोडलेले' : i18n.language === 'hi' ? 'जुड़ा हुआ' : 'Linked'}
                    </span>
                  </div>

                  <h5 className="font-bold text-sm text-gray-700 mb-3">
                    {i18n.language === 'mr' ? 'उपलब्ध खते व औषधे' : i18n.language === 'hi' ? 'उपलब्ध उर्वरक और दवाएं' : 'Available Fertilizers & Sprays'}
                  </h5>
                  {linkedShopData.products.length === 0 ? (
                    <p className="text-gray-400 text-xs text-center py-4 bg-slate-50 rounded-xl">
                      {i18n.language === 'mr' ? 'दुकानदाराने अद्याप कोणतीही उत्पादने जोडलेली नाहीत.' : i18n.language === 'hi' ? 'दुकानदार ने अभी तक कोई उत्पाद नहीं जोड़ा है।' : 'No products added by the shop owner yet.'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                      {linkedShopData.products.map(p => (
                        <div key={p.id} className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                            <p className="text-gray-400 font-medium mt-0.5">{p.company} · {p.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-gray-800 text-sm">₹{p.price}</p>
                            {p.stock_quantity <= 0 ? (
                              <span className="text-red-500 font-bold text-[10px]">
                                {i18n.language === 'mr' ? 'स्टॉक संपला' : i18n.language === 'hi' ? 'स्टॉक समाप्त' : 'Out of Stock'}
                              </span>
                            ) : (
                              <span className="text-green-600 font-bold text-[10px]">
                                {i18n.language === 'mr' ? `शिल्लक: ${p.stock_quantity}` : i18n.language === 'hi' ? `शेष: ${p.stock_quantity}` : `Stock: ${p.stock_quantity}`}
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

            {/* Notifications */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertCircle className="text-primary w-5 h-5" /> {t('recentRecommendations')}
              </h3>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-100 rounded-xl" />
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">
                  {i18n.language === 'mr' ? 'सध्या कोणत्याही शिफारसी नाहीत.' : i18n.language === 'hi' ? 'वर्तमान में कोई सिफारिशें नहीं हैं।' : 'No recommendations at the moment.'}
                </p>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 5).map(notif => {
                    const translated = translateNotification(notif);
                    return (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-xl border flex items-start gap-3.5 transition-colors ${
                          notif.is_read
                            ? 'bg-gray-50/50 border-gray-100'
                            : 'bg-green-50/20 border-green-100'
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

          {/* ── Sidebar (1/3 width) ── */}
          <div className="space-y-6">

            {/* Current Weather Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-8 -mt-8" />

              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CloudRain className="text-primary w-5 h-5" /> {t('weatherToday')}
              </h3>

              {loading || !weather ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-100 rounded-xl" />
                  <div className="h-6 bg-gray-100 rounded-xl w-2/3" />
                </div>
              ) : (
                <div>
                  {/* Main temp row */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <span className="text-5xl font-extrabold text-gray-900 tabular-nums">
                        {weather.temperature}°C
                      </span>
                      <p className="text-sm text-gray-500 mt-1 font-semibold flex items-center gap-1">
                        <WeatherIcon condition={weather.condition} className="w-4 h-4 text-primary" />
                        {weather.condition}
                      </p>
                    </div>
                    <span className="text-5xl drop-shadow-sm">{getWeatherEmoji(weather.condition)}</span>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm border-t border-gray-100 pt-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="text-gray-400 block text-xs">{t('humidity')}</span>
                        <span className="text-gray-900 font-bold">{weather.humidity}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="text-gray-400 block text-xs">{t('windSpeed')}</span>
                        <span className="text-gray-900 font-bold">{weather.windSpeed} km/h</span>
                      </div>
                    </div>
                  </div>

                  {/* Rain alert */}
                  {weather.rainAlert && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                      ⚠️ {t('rainAlertWarning')}
                    </div>
                  )}

                  {/* 5-day forecast */}
                  {weather.forecast && weather.forecast.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        {i18n.language === 'mr' ? 'पुढील ५ दिवस' : i18n.language === 'hi' ? 'अगले ५ दिन' : 'Next 5 Days'}
                      </p>
                      <div className="space-y-2">
                        {weather.forecast.slice(0, 5).map((day: any, idx: number) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between text-sm px-2 py-1.5 rounded-lg ${
                              idx === 0 ? 'bg-primary/5' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="font-semibold text-gray-700 w-12">{formatDay(day.date, i18n.language)}</span>
                            <span className="text-lg">{getWeatherEmoji(day.condition)}</span>
                            <div className="text-right tabular-nums">
                              <span className="font-bold text-gray-900">{day.tempMax}°</span>
                              <span className="text-gray-400 ml-1">{day.tempMin}°</span>
                            </div>
                            {day.rainAlert && (
                              <span className="text-blue-500 text-xs font-bold ml-1">🌧️</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick stats card */}
            {!loading && (
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  {i18n.language === 'mr' ? 'जलद माहिती' : i18n.language === 'hi' ? 'त्वरित जानकारी' : 'Quick Info'}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center gap-1.5">
                      <Sprout className="w-4 h-4 text-primary" /> {i18n.language === 'mr' ? 'एकूण पिके' : i18n.language === 'hi' ? 'कुल फसलें' : 'Total Crops'}
                    </span>
                    <span className="font-extrabold text-gray-900">{crops.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-500" /> {i18n.language === 'mr' ? 'न वाचलेल्या सूचना' : i18n.language === 'hi' ? 'अपठित सूचनाएं' : 'Unread Alerts'}
                    </span>
                    <span className="font-extrabold text-gray-900">
                      {notifications.filter(n => !n.is_read).length}
                    </span>
                  </div>
                  {weather && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-1.5">
                        <Thermometer className="w-4 h-4 text-orange-400" /> {i18n.language === 'mr' ? 'तापमान' : i18n.language === 'hi' ? 'तापमान' : 'Temperature'}
                      </span>
                      <span className="font-extrabold text-gray-900">{weather.temperature}°C</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
