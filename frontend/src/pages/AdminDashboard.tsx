import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Settings, 
  BarChart3, 
  Users, 
  Sprout, 
  Bell, 
  Loader2, 
  Building2, 
  Menu, 
  X, 
  LayoutDashboard, 
  Home 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Layout Tab State: overview, farmers, shops, broadcast
  const [activeTab, setActiveTab] = useState<'overview' | 'farmers' | 'shops' | 'broadcast'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Directory lists state
  const [farmers, setFarmers] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(false);

  // Broadcast Alert Form State
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'weather' | 'fertilizer' | 'spray' | 'pest' | 'disease'>('weather');
  const [broadcasting, setBroadcasting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await axios.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchList = async (tab: 'farmers' | 'shops') => {
    setListLoading(true);
    try {
      const res = await axios.get(`/api/admin/${tab}`);
      if (tab === 'farmers') {
        setFarmers(res.data);
      } else {
        setShops(res.data);
      }
    } catch (err) {
      toast.error(`Failed to load ${tab}`);
    } finally {
      setListLoading(false);
    }
  };

  const handleTabClick = (tab: 'farmers' | 'shops') => {
    setActiveTab(tab);
    fetchList(tab);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcasting(true);
    try {
      await axios.post('/api/admin/broadcast', {
        title: alertTitle,
        message: alertMessage,
        type: alertType
      });
      toast.success(t('broadcastSuccess'));
      setAlertTitle('');
      setAlertMessage('');
    } catch (err) {
      toast.error(t('broadcastFailed'));
    } finally {
      setBroadcasting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <span className="text-5xl">🚫</span>
          <p className="text-red-600 dark:text-red-400 font-extrabold text-lg mt-4">{t('forbiddenAdmin')}</p>
          <Link to="/" className="inline-flex items-center gap-2 mt-6 bg-[#1B5E20] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#124115] transition-colors text-sm">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 text-[#1B5E20] dark:text-[#4CAF50] animate-spin mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t('loadingAdmin')}</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview' as const, label: t('dashboard') || 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { 
      id: 'farmers' as const, 
      label: t('farmersList') || 'Farmers Directory', 
      icon: <Users className="w-5 h-5" />,
      badge: stats?.totalFarmers 
    },
    { 
      id: 'shops' as const, 
      label: t('shopsList') || 'Shops Directory', 
      icon: <Building2 className="w-5 h-5" />,
      badge: stats?.totalShopOwners 
    },
    { id: 'broadcast' as const, label: t('broadcastGlobalAlert') || 'Broadcast Alert', icon: <Bell className="w-5 h-5" /> },
  ];

  const renderSidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌱</span>
          <div>
            <span className="font-extrabold text-[#1B5E20] dark:text-[#4CAF50] block text-sm">स्मार्ट कृषी मित्र</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admin Portal</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(false)}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 md:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map(item => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'farmers' || item.id === 'shops') {
                  fetchList(item.id);
                }
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                active 
                  ? 'bg-[#1B5E20]/10 text-[#1B5E20] dark:bg-[#4CAF50]/10 dark:text-[#4CAF50]' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-black transition-colors ${
                  active 
                    ? 'bg-[#1B5E20]/20 text-[#1B5E20] dark:bg-[#4CAF50]/20 dark:text-[#4CAF50]' 
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-450'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer link to home */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-805">
        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>{t('home') || 'Home'}</span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-850 hidden md:flex flex-col fixed h-screen z-20">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <aside className="relative w-64 bg-white dark:bg-slate-900 h-full flex flex-col border-r border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-left duration-200">
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-4 md:p-8 flex-grow">
          {/* Mobile header bar */}
          <div className="flex items-center justify-between mb-6 md:hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-sm">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-extrabold text-[#1B5E20] dark:text-[#4CAF50] text-sm">स्मार्ट कृषी मित्र</span>
            <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">Admin</span>
          </div>

          {/* Page Title & Desc */}
          <div className="mb-8 hidden md:block">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Settings className="text-[#1B5E20] dark:text-[#4CAF50] w-8 h-8" /> 
              {activeTab === 'overview' ? t('adminPanel') : activeTab === 'farmers' ? t('farmersList') : activeTab === 'shops' ? t('shopsList') : t('broadcastGlobalAlert')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{t('adminPanelDesc')}</p>
          </div>

          {/* ACTIVE TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Quick statistics widgets grid */}
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {/* Total Farmers Widget */}
                  <div 
                    onClick={() => handleTabClick('farmers')}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-lg hover:border-[#1B5E20]/25 transition-all duration-300 group"
                  >
                    <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-115 transition-transform duration-350">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">{t('totalFarmers')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 block">{stats.totalFarmers}</span>
                    </div>
                  </div>

                  {/* Total Shopkeepers Widget */}
                  <div 
                    onClick={() => handleTabClick('shops')}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-lg hover:border-[#F59E0B]/25 transition-all duration-300 group"
                  >
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-115 transition-transform duration-350">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">{t('totalShops')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 block">{stats.totalShopOwners}</span>
                    </div>
                  </div>

                  {/* Total Crops Widget */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                    <div className="p-3.5 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-2xl">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">{t('totalCrops')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 block">{stats.totalCrops}</span>
                    </div>
                  </div>

                  {/* Active Crops Widget */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">{t('activeCrops')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 block">{stats.activeCrops}</span>
                    </div>
                  </div>

                  {/* Alerts Issued Widget */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                    <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-2xl">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">{t('alertsIssued')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 block">{stats.notificationsSent}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Two Column Layout: Health and Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Column 1: System Health */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" /> {t('systemHealthTitle')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('serverStatus')}</span>
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-950/45 dark:text-green-455 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span> {t('active')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('databaseLatency')}</span>
                      <span className="text-slate-950 dark:text-slate-100 font-bold text-sm">34ms</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('geminiStatus')}</span>
                      <span className="text-xs bg-indigo-100 text-indigo-850 dark:bg-indigo-950/45 dark:text-indigo-400 font-bold px-3 py-1 rounded-full">{t('connected')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('cronScheduler')}</span>
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-950/45 dark:text-green-455 font-bold px-3 py-1 rounded-full">{t('running')}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Crop Distribution */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-600" /> {t('cropDistribution')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Cotton (कापूस)</span>
                        <span>42%</span>
                      </div>
                      <div className="w-full bg-slate-50 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Soybean (सोयाबीन)</span>
                        <span>28%</span>
                      </div>
                      <div className="w-full bg-slate-50 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#4CAF50] h-full rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Wheat (गहू)</span>
                        <span>18%</span>
                      </div>
                      <div className="w-full bg-slate-50 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-600 h-full rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Others (इतर)</span>
                        <span>12%</span>
                      </div>
                      <div className="w-full bg-slate-50 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ACTIVE TAB: FARMERS LIST */}
          {activeTab === 'farmers' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                {t('farmersList')}
              </h3>

              {listLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-[#1B5E20] dark:text-[#4CAF50] animate-spin mb-4" />
                  <p className="text-slate-400 text-sm font-medium">{t('loading')}</p>
                </div>
              ) : farmers.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 font-medium py-12 text-center">{t('noFarmersFound')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-xs">
                        <th className="py-3 px-4">{t('fullName')}</th>
                        <th className="py-3 px-4">{t('mobileNumber')}</th>
                        <th className="py-3 px-4">{t('state')}</th>
                        <th className="py-3 px-4">{t('district')}</th>
                        <th className="py-3 px-4">{t('taluka')}</th>
                        <th className="py-3 px-4">{t('village')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {farmers.map(f => (
                        <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{f.full_name}</td>
                          <td className="py-3.5 px-4">{f.mobile}</td>
                          <td className="py-3.5 px-4">{f.state}</td>
                          <td className="py-3.5 px-4">{f.district}</td>
                          <td className="py-3.5 px-4">{f.taluka}</td>
                          <td className="py-3.5 px-4">{f.village}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE TAB: SHOPS LIST */}
          {activeTab === 'shops' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                {t('shopsList')}
              </h3>

              {listLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-[#1B5E20] dark:text-[#4CAF50] animate-spin mb-4" />
                  <p className="text-slate-400 text-sm font-medium">{t('loading')}</p>
                </div>
              ) : shops.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 font-medium py-12 text-center">{t('noShopsFound')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-xs">
                        <th className="py-3 px-4">{t('shopName')}</th>
                        <th className="py-3 px-4">{t('ownerName')}</th>
                        <th className="py-3 px-4">{t('mobileNumber')}</th>
                        <th className="py-3 px-4">{t('licenseNumber')}</th>
                        <th className="py-3 px-4">{t('address')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {shops.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{s.shop_name}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">{s.owner?.full_name || t('notAvailable')}</td>
                          <td className="py-3.5 px-4">{s.owner?.mobile || t('notAvailable')}</td>
                          <td className="py-3.5 px-4 text-xs font-mono">{s.license_number}</td>
                          <td className="py-3.5 px-4 text-xs">{s.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE TAB: GLOBAL BROADCAST */}
          {activeTab === 'broadcast' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm max-w-3xl mx-auto animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-2xl">
                  <Bell className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {t('broadcastGlobalAlert')}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Send a real-time warning broadcast to all farmers.</p>
                </div>
              </div>
              
              <form onSubmit={handleBroadcast} className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Alert Title</label>
                  <input
                    type="text"
                    required
                    placeholder={t('alertTitlePlaceholder')}
                    value={alertTitle}
                    onChange={e => setAlertTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Alert Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder={t('alertMsgPlaceholder')}
                    value={alertMessage}
                    onChange={e => setAlertMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-2">
                  <div className="flex-1 max-w-xs">
                    <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">{t('alertTypeLabel')}</label>
                    <select
                      value={alertType}
                      onChange={e => setAlertType(e.target.value as any)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none text-sm font-medium"
                    >
                      <option value="weather">{t('weather')}</option>
                      <option value="fertilizer">{t('fertilizer')}</option>
                      <option value="spray">{t('spray')}</option>
                      <option value="pest">{t('pest')}</option>
                      <option value="disease">{t('disease')}</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={broadcasting}
                    className="bg-[#1B5E20] hover:bg-[#124115] text-white font-extrabold text-sm px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-950/20 transition-all disabled:opacity-50 cursor-pointer self-end w-full sm:w-auto"
                  >
                    {broadcasting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('sending')}</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4" />
                        <span>{t('broadcast')}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
