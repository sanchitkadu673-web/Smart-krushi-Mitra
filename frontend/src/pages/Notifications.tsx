import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Bell, 
  CheckCheck, 
  Loader2, 
  Building2, 
  ArrowLeft,
  Calendar,
  Sprout,
  Trash2,
  Wind,
  Droplets,
  CloudSun,
  Bug,
  Activity,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import i18n from 'i18next';

// Reusing translation logic from Dashboard.tsx
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
      .replace('Apply', 'डालें')
      .replace('for your', 'अपनी')
      .replace('crop', 'फसल के लिए')
      .replace('Time to apply', 'छिड़काव का समय:')
      .replace('spray to protect your', 'फसल की सुरक्षा के लिए छिड़काव करें')
      .replace('Water requirement at this stage:', 'इस चरण में पानी की आवश्यकता:')
      .replace('Light watering', 'हल्की सिंचाई')
      .replace('Interval of', 'दिनों के अंतराल पर')
      .replace('days depending on rain', 'बारिश के अनुसार पानी दें')
      .replace('Critical stage: maintain moisture.', 'क्रांतिक चरण: नमी बनाए रखें।')
      .replace('Maintain consistent moisture to avoid boll shedding', 'फूल झड़ने से रोकने के लिए नमी बनाए रखें')
      .replace('Your crop is reaching maturity. Plan harvest soon.', 'आपकी फसल पक रही है। जल्द ही कटाई की योजना बनाएं।');
  }
  return { title, message };
};

export const Notifications: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'crop' | 'shop'>('crop');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data || []);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Separate crop and shop announcements
  const cropNotifications = notifications.filter(n => !n.title.startsWith('['));
  const shopNotifications = notifications.filter(n => n.title.startsWith('['));

  const unreadCropCount = cropNotifications.filter(n => !n.is_read).length;
  const unreadShopCount = shopNotifications.filter(n => !n.is_read).length;

  const currentSectionNotifications = activeSection === 'crop' ? cropNotifications : shopNotifications;

  const handleMarkSectionRead = async () => {
    const unread = currentSectionNotifications.filter(n => !n.is_read);
    if (unread.length === 0) return;
    try {
      const ids = unread.map(n => n.id);
      await axios.put('/api/notifications/read', { ids });
      toast.success(
        activeSection === 'crop' 
          ? 'Crop advisories marked as read' 
          : 'Shop announcements marked as read'
      );
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to update notifications');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm(
      i18n.language === 'mr' 
        ? 'तुम्हाला ही सूचना खरोखर हटवायची आहे का?' 
        : i18n.language === 'hi' 
          ? 'क्या आप वास्तव में इस अधिसूचना को हटाना चाहते हैं?' 
          : 'Are you sure you want to delete this notification?'
    )) return;

    try {
      await axios.delete(`/api/notifications/${id}`);
      toast.success(
        i18n.language === 'mr' 
          ? 'सूचना यशस्वीरित्या हटवली' 
          : i18n.language === 'hi' 
            ? 'सूचना सफलतापूर्वक हटा दी गई' 
            : 'Notification deleted successfully'
      );
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications = currentSectionNotifications.filter(notif => {
    if (filter === 'unread') return !notif.is_read;
    return true;
  });

  const getEmojiIcon = (type: string, title: string) => {
    if (title.startsWith('[')) return <Building2 className="w-5 h-5 text-teal-650 dark:text-teal-400" />;
    switch (type) {
      case 'fertilizer':
        return <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'spray':
        return <Wind className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
      case 'irrigation':
        return <Droplets className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'weather':
        return <CloudSun className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
      case 'pest':
        return <Bug className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
      case 'disease':
        return <Activity className="w-5 h-5 text-red-500 dark:text-red-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back and Title Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl flex items-center gap-2">
                <Bell className="text-primary w-7 h-7 animate-swing" />
                {t('notifications') || 'Notifications'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                View your latest crop alerts, expert advisory, and shop announcements.
              </p>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 w-full">
          <button
            onClick={() => { setActiveSection('crop'); setFilter('all'); }}
            className={`flex items-center gap-2 pb-3.5 px-4 text-sm font-extrabold border-b-2 transition-all cursor-pointer relative ${
              activeSection === 'crop'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>{i18n.language === 'mr' ? 'पीक शिफारसी व सल्ला' : i18n.language === 'hi' ? 'फसल शिफारिशें और सलाह' : 'Crop Schedules & Advisory'}</span>
            {unreadCropCount > 0 && (
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white select-none shrink-0">
                {unreadCropCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveSection('shop'); setFilter('all'); }}
            className={`flex items-center gap-2 pb-3.5 px-4 text-sm font-extrabold border-b-2 transition-all cursor-pointer relative ${
              activeSection === 'shop'
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{i18n.language === 'mr' ? 'दुकानदार घोषणा' : i18n.language === 'hi' ? 'दुकानदार संदेश' : 'Shop Messages'}</span>
            {unreadShopCount > 0 && (
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white select-none shrink-0">
                {unreadShopCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters & Actions bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl w-fit">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                filter === 'all' 
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-white' 
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {i18n.language === 'mr' ? 'सर्व' : i18n.language === 'hi' ? 'सभी' : 'All'} ({currentSectionNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                filter === 'unread' 
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-white' 
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {i18n.language === 'mr' ? 'न वाचलेले' : i18n.language === 'hi' ? 'अपठित' : 'Unread'} ({currentSectionNotifications.filter(n => !n.is_read).length})
            </button>
          </div>

          <button
            onClick={handleMarkSectionRead}
            disabled={currentSectionNotifications.filter(n => !n.is_read).length === 0}
            className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-850 cursor-pointer shadow-sm w-full sm:w-auto justify-center"
          >
            <CheckCheck className="w-4 h-4 text-green-600" />
            {i18n.language === 'mr' 
              ? 'या विभागातील सर्व वाचलेले चिन्हांकित करा' 
              : i18n.language === 'hi' 
                ? 'इस अनुभाग के सभी पढ़े हुए चिह्नित करें' 
                : 'Mark Section as Read'}
          </button>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading Notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-850 shadow-sm">
            <Bell className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4 stroke-1" />
            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              {i18n.language === 'mr' ? 'कोणत्याही नवीन सूचना नाहीत' : i18n.language === 'hi' ? 'कोई नई सूचना नहीं है' : 'No notifications found'}
            </h4>
            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto text-xs sm:text-sm font-medium">
              {activeSection === 'crop' 
                ? (filter === 'unread' 
                    ? 'You have read all crop scheduling alerts and fertilizer updates.' 
                    : 'Your crop scheduling advisory updates will appear here.')
                : (filter === 'unread' 
                    ? 'No new unread stock announcements from your linked shop owner.' 
                    : 'Announcements, special discounts, and stock notifications from your linked shop owner will show here.')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map(notif => {
              const isShopBroadcast = notif.title.startsWith('[');
              const translated = translateNotification(notif);
              
              return (
                <div
                  key={notif.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                    notif.is_read
                      ? 'bg-white/50 border-slate-100 dark:bg-slate-900/50 dark:border-slate-850'
                      : isShopBroadcast
                        ? 'bg-teal-50/20 border-teal-200 dark:bg-teal-950/10 dark:border-teal-900/50 shadow-sm shadow-teal-500/5'
                        : 'bg-green-50/25 border-green-150 dark:bg-green-950/10 dark:border-green-900/50 shadow-sm shadow-green-500/5'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${
                    notif.is_read 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' 
                      : isShopBroadcast 
                        ? 'bg-teal-100/60 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400' 
                        : 'bg-green-100/60 dark:bg-green-950/50 text-green-700 dark:text-green-400'
                  }`}>
                    {getEmojiIcon(notif.type, notif.title)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className={`font-bold text-slate-900 dark:text-slate-100 sm:text-base leading-snug ${notif.is_read ? 'font-semibold' : 'font-extrabold'}`}>
                        {translated.title}
                      </h4>
                      <div className="flex items-center gap-2 shrink-0">
                        {!notif.is_read && (
                          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notif.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-350 text-xs sm:text-sm mt-1 leading-relaxed">
                      {translated.message}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(notif.created_at).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {isShopBroadcast && (
                        <span className="bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-md dark:bg-teal-950 dark:text-teal-400 dark:border-teal-900">
                          {i18n.language === 'mr' ? 'दुकानदार घोषणा' : i18n.language === 'hi' ? 'दुकानदार घोषणा' : 'Shop Announcement'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
export default Notifications;
