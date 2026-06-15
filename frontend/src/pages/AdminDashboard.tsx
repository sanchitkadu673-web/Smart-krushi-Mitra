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
  Home,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Ban,
  Download,
  Bug,
  ShieldAlert,
  Search,
  Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Layout Tab State: overview, farmers, shops, broadcast, crops, stages, diseases, pests, landing-page
  const [activeTab, setActiveTab] = useState<'overview' | 'farmers' | 'shops' | 'broadcast' | 'crops' | 'stages' | 'diseases' | 'pests' | 'landing-page'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('adminSidebarCollapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  // Search query state
  const [searchTerm, setSearchTerm] = useState('');

  // Directory lists state
  const [farmers, setFarmers] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [diseases, setDiseases] = useState<any[]>([]);
  const [pests, setPests] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(false);

  // Diseases Modal State
  const [diseaseModalOpen, setDiseaseModalOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  const [selectedCropFilterForDiseases, setSelectedCropFilterForDiseases] = useState<string>('all');
  const [diseaseForm, setDiseaseForm] = useState({
    crop_master_id: '',
    name: '',
    symptoms: '',
    treatment: ''
  });

  // Pests Modal State
  const [pestModalOpen, setPestModalOpen] = useState(false);
  const [selectedPest, setSelectedPest] = useState<any>(null);
  const [selectedCropFilterForPests, setSelectedCropFilterForPests] = useState<string>('all');
  const [pestForm, setPestForm] = useState({
    crop_master_id: '',
    name: '',
    symptoms: '',
    control_method: ''
  });

  // Crop Master Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [cropForm, setCropForm] = useState({
    name: '',
    category: '',
    duration_days: '',
    expected_yield: '',
    description: '',
    varieties: ''
  });

  // Crop Stage Modal State
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<any>(null);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [stageForm, setStageForm] = useState({
    crop_master_id: '',
    stage_name: '',
    start_day: '',
    end_day: ''
  });

  // Broadcast Alert Form State
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'weather' | 'fertilizer' | 'spray' | 'pest' | 'disease'>('weather');
  const [broadcasting, setBroadcasting] = useState(false);

  // Landing Page Editor State
  const [landingPageForm, setLandingPageForm] = useState({
    hero_title_en: '',
    hero_title_mr: '',
    hero_title_hi: '',
    hero_description_en: '',
    hero_description_mr: '',
    hero_description_hi: '',
    cta_title_en: '',
    cta_title_mr: '',
    cta_title_hi: '',
    cta_description_en: '',
    cta_description_mr: '',
    cta_description_hi: ''
  });
  const [savingLandingPage, setSavingLandingPage] = useState(false);

  const fetchLandingPageSettings = async () => {
    setListLoading(true);
    try {
      const res = await axios.get('/api/landing-page');
      if (res.data) {
        setLandingPageForm({
          hero_title_en: res.data.hero_title_en || '',
          hero_title_mr: res.data.hero_title_mr || '',
          hero_title_hi: res.data.hero_title_hi || '',
          hero_description_en: res.data.hero_description_en || '',
          hero_description_mr: res.data.hero_description_mr || '',
          hero_description_hi: res.data.hero_description_hi || '',
          cta_title_en: res.data.cta_title_en || '',
          cta_title_mr: res.data.cta_title_mr || '',
          cta_title_hi: res.data.cta_title_hi || '',
          cta_description_en: res.data.cta_description_en || '',
          cta_description_mr: res.data.cta_description_mr || '',
          cta_description_hi: res.data.cta_description_hi || ''
        });
      }
    } catch (err) {
      toast.error('Failed to load landing page settings');
    } finally {
      setListLoading(false);
    }
  };

  const handleLandingPageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLandingPage(true);
    try {
      await axios.put('/api/admin/landing-page', landingPageForm);
      toast.success('Landing page settings updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSavingLandingPage(false);
    }
  };

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
    setSearchTerm('');
    fetchList(tab);
  };

  const fetchCrops = async () => {
    setListLoading(true);
    try {
      const res = await axios.get('/api/admin/crops');
      setCrops(res.data);
    } catch (err) {
      toast.error('Failed to load crop masters');
    } finally {
      setListLoading(false);
    }
  };

  const fetchStages = async () => {
    setListLoading(true);
    try {
      const res = await axios.get('/api/admin/stages');
      setStages(res.data);
    } catch (err) {
      toast.error('Failed to load crop stages');
    } finally {
      setListLoading(false);
    }
  };

  const handleCropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: cropForm.name,
        category: cropForm.category,
        duration_days: parseInt(cropForm.duration_days),
        expected_yield: cropForm.expected_yield,
        description: cropForm.description || null,
        varieties: cropForm.varieties || null
      };
      if (selectedCrop) {
        const res = await axios.put(`/api/admin/crops/${selectedCrop.id}`, payload);
        setCrops(prev => prev.map(c => c.id === selectedCrop.id ? res.data : c));
        toast.success('Crop master updated successfully');
      } else {
        const res = await axios.post('/api/admin/crops', payload);
        setCrops(prev => [...prev, res.data]);
        toast.success('Crop master created successfully');
      }
      setCropModalOpen(false);
      fetchData(); // Refresh stats
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save crop master');
    }
  };

  const handleDeleteCrop = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this crop master? This may affect linked stages and schedules.')) return;
    try {
      await axios.delete(`/api/admin/crops/${id}`);
      setCrops(prev => prev.filter(c => c.id !== id));
      toast.success('Crop master deleted');
      fetchData(); // Refresh stats
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete crop master');
    }
  };

  const handleStageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        crop_master_id: stageForm.crop_master_id,
        stage_name: stageForm.stage_name,
        start_day: parseInt(stageForm.start_day),
        end_day: parseInt(stageForm.end_day)
      };
      if (selectedStage) {
        const res = await axios.put(`/api/admin/stages/${selectedStage.id}`, payload);
        setStages(prev => prev.map(s => s.id === selectedStage.id ? res.data : s));
        toast.success('Crop stage updated successfully');
      } else {
        const res = await axios.post('/api/admin/stages', payload);
        setStages(prev => [...prev, res.data]);
        toast.success('Crop stage created successfully');
      }
      setStageModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save crop stage');
    }
  };

  const handleDeleteStage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this crop stage?')) return;
    try {
      await axios.delete(`/api/admin/stages/${id}`);
      setStages(prev => prev.filter(s => s.id !== id));
      toast.success('Crop stage deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete crop stage');
    }
  };

  const handleDeleteFarmer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this farmer? All linked crops, notifications, and data will be permanently removed.')) return;
    try {
      await axios.delete(`/api/admin/farmers/${id}`);
      setFarmers(prev => prev.filter(f => f.id !== id));
      toast.success('Farmer deleted successfully');
      fetchData(); // Refresh stats count
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete farmer');
    }
  };

  const handleDeleteShop = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this shop? The shop owner account and all products will be permanently removed.')) return;
    try {
      await axios.delete(`/api/admin/shops/${id}`);
      setShops(prev => prev.filter(s => s.id !== id));
      toast.success('Shop deleted successfully');
      fetchData(); // Refresh stats count
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete shop');
    }
  };

  const handleToggleShopApproval = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'approve' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${action} this shop?`)) return;
    try {
      const res = await axios.put(`/api/admin/shops/${id}/approve`, { is_approved: newStatus });
      setShops(prev => prev.map(s => s.id === id ? { ...s, is_approved: res.data.is_approved } : s));
      toast.success(`Shop ${newStatus ? 'approved' : 'suspended'} successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update shop approval status');
    }
  };

  const fetchDiseases = async () => {
    setListLoading(true);
    try {
      const res = await axios.get('/api/admin/diseases');
      setDiseases(res.data);
    } catch (err) {
      toast.error('Failed to load diseases database');
    } finally {
      setListLoading(false);
    }
  };

  const fetchPests = async () => {
    setListLoading(true);
    try {
      const res = await axios.get('/api/admin/pests');
      setPests(res.data);
    } catch (err) {
      toast.error('Failed to load pests database');
    } finally {
      setListLoading(false);
    }
  };

  const handleDiseaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        crop_master_id: diseaseForm.crop_master_id,
        name: diseaseForm.name,
        symptoms: diseaseForm.symptoms,
        treatment: diseaseForm.treatment
      };
      if (selectedDisease) {
        const res = await axios.put(`/api/admin/diseases/${selectedDisease.id}`, payload);
        setDiseases(prev => prev.map(d => d.id === selectedDisease.id ? res.data : d));
        toast.success('Disease updated successfully');
      } else {
        const res = await axios.post('/api/admin/diseases', payload);
        setDiseases(prev => [...prev, res.data]);
        toast.success('Disease created successfully');
      }
      setDiseaseModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save disease');
    }
  };

  const handleDeleteDisease = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this disease?')) return;
    try {
      await axios.delete(`/api/admin/diseases/${id}`);
      setDiseases(prev => prev.filter(d => d.id !== id));
      toast.success('Disease deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete disease');
    }
  };

  const handlePestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        crop_master_id: pestForm.crop_master_id,
        name: pestForm.name,
        symptoms: pestForm.symptoms,
        control_method: pestForm.control_method
      };
      if (selectedPest) {
        const res = await axios.put(`/api/admin/pests/${selectedPest.id}`, payload);
        setPests(prev => prev.map(p => p.id === selectedPest.id ? res.data : p));
        toast.success('Pest updated successfully');
      } else {
        const res = await axios.post('/api/admin/pests', payload);
        setPests(prev => [...prev, res.data]);
        toast.success('Pest created successfully');
      }
      setPestModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save pest');
    }
  };

  const handleDeletePest = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this pest?')) return;
    try {
      await axios.delete(`/api/admin/pests/${id}`);
      setPests(prev => prev.filter(p => p.id !== id));
      toast.success('Pest deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete pest');
    }
  };

  const exportToCSV = (data: any[], filename: string, headers: string[], keys: string[]) => {
    const csvRows = [];
    csvRows.push(headers.join(','));
    for (const row of data) {
      const values = keys.map(key => {
        const val = key.split('.').reduce((obj, k) => obj && obj[k], row);
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    const csvContent = "\uFEFF" + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async (title: string, headers: string[], rows: any[][], filename: string) => {
    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;
      const autoTableModule = await import('jspdf-autotable');
      const autoTable = autoTableModule.default;
      
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(title, 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 26);
      
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 32,
        theme: 'striped',
        headStyles: { fillColor: [27, 94, 32], halign: 'left' },
        styles: { fontSize: 8 }
      });
      doc.save(`${filename}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF');
    }
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
    { 
      id: 'crops' as const, 
      label: 'पिकांचे प्रकार (Crop Masters)', 
      icon: <Sprout className="w-5 h-5" />
    },
    { 
      id: 'stages' as const, 
      label: 'पिकांचे टप्पे (Crop Stages)', 
      icon: <Settings className="w-5 h-5" />
    },
    { 
      id: 'diseases' as const, 
      label: 'रोग नियंत्रण (Diseases DB)', 
      icon: <ShieldAlert className="w-5 h-5" />
    },
    { 
      id: 'pests' as const, 
      label: 'कीड नियंत्रण (Pests DB)', 
      icon: <Bug className="w-5 h-5" />
    },
    { id: 'broadcast' as const, label: t('broadcastGlobalAlert') || 'Broadcast Alert', icon: <Bell className="w-5 h-5" /> },
    { 
      id: 'landing-page' as const, 
      label: 'लँडिंग पेज (Landing Page)', 
      icon: <Globe className="w-5 h-5" />
    },
  ];

  const renderSidebarContent = (isCollapsed: boolean) => {
    const getInitials = (n: string) => {
      if (!n) return 'S';
      return n.trim()[0].toUpperCase();
    };
    const adminInitial = getInitials(profile?.full_name || 'Admin');

    if (isCollapsed) {
      return (
        <div className="flex flex-col h-full items-center py-4 bg-white dark:bg-slate-900">
          {/* Collapse/Expand Toggle Button */}
          <button 
            onClick={() => setSidebarCollapsed(false)}
            className="p-2.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer mb-6"
            title="Expand Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* User Initial Circle Badge */}
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm mb-8 border border-emerald-500/20 shadow-sm" title={profile?.full_name}>
            {adminInitial}
          </div>

          {/* Nav Icons */}
          <nav className="flex-1 w-full px-2 space-y-3 flex flex-col items-center overflow-y-auto">
            {menuItems.map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSearchTerm('');
                    if (item.id === 'farmers' || item.id === 'shops') {
                      fetchList(item.id);
                    } else if (item.id === 'crops') {
                      fetchCrops();
                    } else if (item.id === 'stages') {
                      fetchCrops();
                      fetchStages();
                    } else if (item.id === 'diseases') {
                      fetchCrops();
                      fetchDiseases();
                    } else if (item.id === 'pests') {
                      fetchCrops();
                      fetchPests();
                    } else if (item.id === 'landing-page') {
                      fetchLandingPageSettings();
                    }
                  }}
                  className={`p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center relative group ${
                    active 
                      ? 'bg-[#1B5E20]/10 text-[#1B5E20] dark:bg-[#4CAF50]/10 dark:text-[#4CAF50]' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                  {/* Tooltip on hover */}
                  <span className="absolute left-14 scale-0 group-hover:scale-100 transition-all rounded-lg p-2 text-xs font-black bg-slate-950 text-white shadow-xl whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Back Home */}
          <div className="pt-4 border-t border-slate-105 dark:border-slate-800 w-full flex justify-center">
            <Link
              to="/"
              className="p-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all flex items-center justify-center relative group"
              title="Home"
            >
              <Home className="w-5 h-5" />
              <span className="absolute left-14 scale-0 group-hover:scale-100 transition-all rounded-lg p-2 text-xs font-black bg-slate-950 text-white shadow-xl whitespace-nowrap z-50 pointer-events-none">
                {t('home') || 'Home'}
              </span>
            </Link>
          </div>
        </div>
      );
    }

    return (
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
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileMenuOpen(false);
              } else {
                setSidebarCollapsed(true);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
            title="Sidebar लपवा (Hide Sidebar)"
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
                  setSearchTerm('');
                  if (item.id === 'farmers' || item.id === 'shops') {
                    fetchList(item.id);
                  } else if (item.id === 'crops') {
                    fetchCrops();
                  } else if (item.id === 'stages') {
                    fetchCrops();
                    fetchStages();
                  } else if (item.id === 'diseases') {
                    fetchCrops();
                    fetchDiseases();
                  } else if (item.id === 'pests') {
                    fetchCrops();
                    fetchPests();
                  } else if (item.id === 'landing-page') {
                    fetchLandingPageSettings();
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
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* Desktop Persistent Sidebar */}
      <aside className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-850 hidden md:flex flex-col fixed h-screen z-20 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {renderSidebarContent(sidebarCollapsed)}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <aside className="relative w-64 bg-white dark:bg-slate-900 h-full flex flex-col border-r border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-left duration-200">
            {renderSidebarContent(false)}
          </aside>
        </div>
      )}

      {/* Main Content Pane */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'md:pl-16' : 'md:pl-64'}`}>
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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Settings className="text-[#1B5E20] dark:text-[#4CAF50] w-8 h-8" /> 
                {activeTab === 'overview' ? t('adminPanel') : activeTab === 'farmers' ? t('farmersList') : activeTab === 'shops' ? t('shopsList') : activeTab === 'crops' ? 'पिकांचे प्रकार (Crop Masters)' : activeTab === 'stages' ? 'पिकांचे टप्पे (Crop Stages)' : activeTab === 'diseases' ? 'रोग नियंत्रण (Diseases DB)' : activeTab === 'pests' ? 'कीड नियंत्रण (Pests DB)' : t('broadcastGlobalAlert')}
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{t('adminPanelDesc')}</p>
          </div>

          {/* ACTIVE TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-350">
              
              {/* Premium Welcome Card */}
              <div className="bg-gradient-to-r from-emerald-800 to-green-700 dark:from-emerald-950 dark:to-[#1B5E20] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-10 right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="bg-emerald-500/20 text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">SYSTEM ADMINISTRATOR</span>
                    <h2 className="text-3xl font-black mt-3">{t('welcome') || 'Welcome back'}, {profile?.full_name || 'Admin'}!</h2>
                    <p className="text-emerald-100/70 text-sm mt-1.5 font-medium max-w-xl">
                      Here is your platform operational overview. You can manage registered farmers, store directories, agricultural databases, and send live broadcasts.
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-4 shrink-0 flex items-center gap-3 self-start md:self-auto">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-wider">System Date</p>
                      <p className="text-white font-extrabold text-sm mt-0.5">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick statistics widgets grid */}
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {/* Total Farmers Widget */}
                  <div 
                    onClick={() => handleTabClick('farmers')}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md flex items-center gap-4 cursor-pointer hover:shadow-xl hover:border-[#1B5E20]/30 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="p-3.5 bg-blue-50 dark:bg-blue-950/45 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-black uppercase tracking-wider">{t('totalFarmers')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 block">{stats.totalFarmers}</span>
                      <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5 mt-1">↑ 12% new</span>
                    </div>
                  </div>

                  {/* Total Shopkeepers Widget */}
                  <div 
                    onClick={() => handleTabClick('shops')}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md flex items-center gap-4 cursor-pointer hover:shadow-xl hover:border-[#F59E0B]/30 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/45 text-amber-655 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-black uppercase tracking-wider">{t('totalShops')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 block">{stats.totalShopOwners}</span>
                      <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold mt-1 block">Live directories</span>
                    </div>
                  </div>

                  {/* Total Crops Widget */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md flex items-center gap-4 hover:-translate-y-1 transition-all duration-305 group">
                    <div className="p-3.5 bg-green-50 dark:bg-green-950/45 text-green-600 dark:text-green-400 rounded-2xl group-hover:scale-110 transition-transform">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-black uppercase tracking-wider">{t('totalCrops')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 block">{stats.totalCrops}</span>
                      <span className="text-[10px] text-emerald-500 font-bold mt-1 block">Masters database</span>
                    </div>
                  </div>

                  {/* Active Crops Widget */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md flex items-center gap-4 hover:-translate-y-1 transition-all duration-305 group">
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-450 rounded-2xl group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-black uppercase tracking-wider">{t('activeCrops')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 block">{stats.activeCrops}</span>
                      <span className="text-[10px] text-green-500 font-bold flex items-center gap-0.5 mt-1">↑ Active seasons</span>
                    </div>
                  </div>

                  {/* Alerts Issued Widget */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md flex items-center gap-4 hover:-translate-y-1 transition-all duration-305 group">
                    <div className="p-3.5 bg-purple-50 dark:bg-purple-950/45 text-purple-650 dark:text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-slate-400 text-[10px] font-black uppercase tracking-wider">{t('alertsIssued')}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 block">{stats.notificationsSent}</span>
                      <span className="text-[10px] text-[#1B5E20] dark:text-[#4CAF50] font-bold mt-1 block">System broadcasts</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Two Column Layout: Health and Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Column 1: System Health */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
                    <BarChart3 className="w-5 h-5 text-emerald-600" /> {t('systemHealthTitle') || 'System Operational Status'}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('serverStatus') || 'Backend API Service'}</span>
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-950/45 dark:text-green-400 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span> {t('active') || 'Operational'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('databaseLatency') || 'PostgreSQL Connection Latency'}</span>
                      <span className="text-slate-950 dark:text-slate-100 font-bold text-sm font-mono">34ms</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('geminiStatus') || 'AI Agent / Gemini API Integration'}</span>
                      <span className="text-xs bg-indigo-100 text-indigo-850 dark:bg-indigo-950/45 dark:text-indigo-400 font-bold px-3 py-1 rounded-full">{t('connected') || 'Connected'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('cronScheduler') || 'Scheduled Jobs / Tasks'}</span>
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-950/45 dark:text-green-400 font-bold px-3 py-1 rounded-full">{t('running') || 'Active'}</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Crop Distribution */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
                    <Sprout className="w-5 h-5 text-green-600" /> {t('cropDistribution') || 'Active Cultivation share'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Cotton (कापूस)</span>
                        <span>42%</span>
                      </div>
                      <div className="w-full bg-slate-50 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Soybean (सोयाबीन)</span>
                        <span>28%</span>
                      </div>
                      <div className="w-full bg-slate-50 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#4CAF50] h-full rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Wheat (गहू)</span>
                        <span>18%</span>
                      </div>
                      <div className="w-full bg-slate-50 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-green-600 h-full rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Others (इतर)</span>
                        <span>12%</span>
                      </div>
                      <div className="w-full bg-slate-50 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
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
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {t('farmersList')}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">View and manage registered farmer profiles</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="नाव किंवा मोबाईल शोधा..."
                      className="pl-9 pr-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-805 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E20] dark:focus:ring-[#4CAF50] focus:border-transparent font-semibold w-full sm:w-56"
                    />
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => exportToCSV(
                        farmers, 
                        'farmers_list', 
                        ['Full Name', 'Mobile Number', 'State', 'District', 'Taluka', 'Village'],
                        ['full_name', 'mobile', 'state', 'district', 'taluka', 'village']
                      )}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-emerald-200/50"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Excel
                    </button>
                    <button
                      onClick={() => handleExportPDF(
                        'Farmers Directory',
                        ['Full Name', 'Mobile', 'State', 'District', 'Taluka', 'Village'],
                        farmers.map(f => [f.full_name, f.mobile, f.state, f.district, f.taluka, f.village]),
                        'farmers_list'
                      )}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-red-200/50"
                    >
                      <Download className="w-3.5 h-3.5" /> Export PDF
                    </button>
                  </div>
                </div>
              </div>

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
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {farmers
                        .filter(f => {
                          const q = searchTerm.toLowerCase();
                          return (
                            f.full_name?.toLowerCase().includes(q) ||
                            f.mobile?.toLowerCase().includes(q) ||
                            f.district?.toLowerCase().includes(q) ||
                            f.taluka?.toLowerCase().includes(q) ||
                            f.village?.toLowerCase().includes(q)
                          );
                        })
                        .map(f => {
                          const getInitials = (n: string) => {
                            if (!n) return 'F';
                            const parts = n.trim().split(' ');
                            if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
                            return parts[0].slice(0, 2).toUpperCase();
                          };
                          return (
                            <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-400 flex items-center justify-center font-black text-xs shrink-0 border border-emerald-200/10">
                                    {getInitials(f.full_name)}
                                  </div>
                                  <span>{f.full_name}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono">{f.mobile}</td>
                              <td className="py-3.5 px-4">{f.state}</td>
                              <td className="py-3.5 px-4">{f.district}</td>
                              <td className="py-3.5 px-4">{f.taluka}</td>
                              <td className="py-3.5 px-4">{f.village}</td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => handleDeleteFarmer(f.id)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-655 dark:text-red-405 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Farmer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE TAB: SHOPS LIST */}
          {activeTab === 'shops' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {t('shopsList')}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Approve and manage registered partner stores</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="दुकान किंवा मालकाचे नाव शोधा..."
                      className="pl-9 pr-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-805 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E20] dark:focus:ring-[#4CAF50] focus:border-transparent font-semibold w-full sm:w-56"
                    />
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => exportToCSV(
                        shops, 
                        'shops_list', 
                        ['Shop Name', 'Owner Name', 'Mobile Number', 'Status', 'License Number', 'Address'],
                        ['shop_name', 'owner.full_name', 'owner.mobile', 'is_approved', 'license_number', 'address']
                      )}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-emerald-200/50"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Excel
                    </button>
                    <button
                      onClick={() => handleExportPDF(
                        'Shops Directory',
                        ['Shop Name', 'Owner Name', 'Mobile', 'Status', 'License No', 'Address'],
                        shops.map(s => [s.shop_name, s.owner?.full_name || 'N/A', s.owner?.mobile || 'N/A', s.is_approved ? 'Approved' : 'Pending', s.license_number, s.address]),
                        'shops_list'
                      )}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-red-200/50"
                    >
                      <Download className="w-3.5 h-3.5" /> Export PDF
                    </button>
                  </div>
                </div>
              </div>

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
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">{t('licenseNumber')}</th>
                        <th className="py-3 px-4">{t('address')}</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {shops
                        .filter(s => {
                          const q = searchTerm.toLowerCase();
                          return (
                            s.shop_name?.toLowerCase().includes(q) ||
                            s.owner?.full_name?.toLowerCase().includes(q) ||
                            s.owner?.mobile?.toLowerCase().includes(q) ||
                            s.license_number?.toLowerCase().includes(q) ||
                            s.address?.toLowerCase().includes(q)
                          );
                        })
                        .map(s => {
                          const getInitials = (n: string) => {
                            if (!n) return 'S';
                            const parts = n.trim().split(' ');
                            if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
                            return parts[0].slice(0, 2).toUpperCase();
                          };
                          return (
                            <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-850 dark:bg-amber-950/45 dark:text-amber-400 flex items-center justify-center font-black text-xs shrink-0 border border-amber-200/10">
                                    🏪
                                  </div>
                                  <span>{s.shop_name}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-black text-[10px]">
                                    {getInitials(s.owner?.full_name)}
                                  </div>
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">{s.owner?.full_name || t('notAvailable')}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono">{s.owner?.mobile || t('notAvailable')}</td>
                              <td className="py-3.5 px-4">
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                                  s.is_approved 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-950/45 dark:text-green-400' 
                                    : 'bg-amber-100 text-amber-850 dark:bg-amber-950/45 dark:text-amber-400'
                                }`}>
                                  {s.is_approved ? 'Approved' : 'Pending'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-xs font-mono">{s.license_number}</td>
                              <td className="py-3.5 px-4 text-xs max-w-xs truncate" title={s.address}>{s.address}</td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => handleToggleShopApproval(s.id, s.is_approved)}
                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                      s.is_approved 
                                        ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 text-amber-605 dark:text-amber-400' 
                                        : 'bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-900/40 text-green-605 dark:text-green-400'
                                    }`}
                                    title={s.is_approved ? 'Suspend Shop' : 'Approve Shop'}
                                  >
                                    {s.is_approved ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteShop(s.id)}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-655 dark:text-red-405 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Shop"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE TAB: CROP MASTERS */}
          {activeTab === 'crops' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    पिकांचे प्रकार (Crop Masters)
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Manage and view the core crop variety databases</p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="पीक किंवा श्रेणी शोधा..."
                      className="pl-9 pr-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-805 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E20] dark:focus:ring-[#4CAF50] focus:border-transparent font-semibold w-full sm:w-56"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => exportToCSV(
                        crops, 
                        'crop_masters', 
                        ['Crop Name', 'Category', 'Duration (Days)', 'Expected Yield', 'Varieties'],
                        ['name', 'category', 'duration_days', 'expected_yield', 'varieties']
                      )}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-emerald-200/50"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Excel
                    </button>
                    <button
                      onClick={() => handleExportPDF(
                        'Crop Masters Database',
                        ['Crop Name', 'Category', 'Duration', 'Expected Yield', 'Varieties'],
                        crops.map(c => [c.name, c.category, `${c.duration_days} Days`, c.expected_yield, c.varieties || 'N/A']),
                        'crop_masters'
                      )}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/30 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-red-200/50"
                    >
                      <Download className="w-3.5 h-3.5" /> Export PDF
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCrop(null);
                        setCropForm({
                          name: '',
                          category: '',
                          duration_days: '',
                          expected_yield: '',
                          description: '',
                          varieties: ''
                        });
                        setCropModalOpen(true);
                      }}
                      className="bg-[#1B5E20] hover:bg-[#124115] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Crop Master
                    </button>
                  </div>
                </div>
              </div>

              {listLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-[#1B5E20] dark:text-[#4CAF50] animate-spin mb-4" />
                  <p className="text-slate-400 text-sm font-medium">{t('loading')}</p>
                </div>
              ) : crops.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 font-medium py-12 text-center">No Crop Masters found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-xs">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Expected Yield</th>
                        <th className="py-3 px-4">Varieties</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {crops
                        .filter(c => {
                          const q = searchTerm.toLowerCase();
                          return (
                            c.name?.toLowerCase().includes(q) ||
                            c.category?.toLowerCase().includes(q) ||
                            c.varieties?.toLowerCase().includes(q) ||
                            (c.description && c.description.toLowerCase().includes(q))
                          );
                        })
                        .map(c => (
                          <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🌾</span>
                                <span className="font-bold">{c.name}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">{c.category}</td>
                            <td className="py-3.5 px-4 font-mono">{c.duration_days} Days</td>
                            <td className="py-3.5 px-4">{c.expected_yield}</td>
                            <td className="py-3.5 px-4 text-xs max-w-xs truncate" title={c.varieties}>{c.varieties || 'N/A'}</td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedCrop(c);
                                    setCropForm({
                                      name: c.name,
                                      category: c.category,
                                      duration_days: c.duration_days.toString(),
                                      expected_yield: c.expected_yield,
                                      description: c.description || '',
                                      varieties: c.varieties || ''
                                    });
                                    setCropModalOpen(true);
                                  }}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCrop(c.id)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-650 dark:text-red-405 rounded-lg transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE TAB: CROP STAGES */}
          {activeTab === 'stages' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    पिकांचे टप्पे (Crop Stages)
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-bold uppercase">Filter:</span>
                      <select
                        value={selectedCropFilter}
                        onChange={e => setSelectedCropFilter(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-855 dark:text-slate-200 text-xs font-bold focus:outline-none"
                      >
                        <option value="all">सर्व पीक प्रकार (All Crops)</option>
                        {crops.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="टप्पा शोधा..."
                        className="pl-9 pr-4 py-1.5 text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-805 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E20] dark:focus:ring-[#4CAF50] focus:border-transparent font-semibold w-full sm:w-48"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedStage(null);
                    setStageForm({
                      crop_master_id: selectedCropFilter !== 'all' ? selectedCropFilter : (crops[0]?.id || ''),
                      stage_name: '',
                      start_day: '',
                      end_day: ''
                    });
                    setStageModalOpen(true);
                  }}
                  className="bg-[#1B5E20] hover:bg-[#124115] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-center shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Crop Stage
                </button>
              </div>

              {listLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-[#1B5E20] dark:text-[#4CAF50] animate-spin mb-4" />
                  <p className="text-slate-400 text-sm font-medium">{t('loading')}</p>
                </div>
              ) : stages.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 font-medium py-12 text-center">No Crop Stages found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-xs">
                        <th className="py-3 px-4">Crop Type</th>
                        <th className="py-3 px-4">Stage Name</th>
                        <th className="py-3 px-4">Start Day</th>
                        <th className="py-3 px-4">End Day</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {stages
                        .filter(s => selectedCropFilter === 'all' || s.crop_master_id === selectedCropFilter)
                        .filter(s => {
                          const q = searchTerm.toLowerCase();
                          const cropName = crops.find(c => c.id === s.crop_master_id)?.name || '';
                          return s.stage_name?.toLowerCase().includes(q) || cropName.toLowerCase().includes(q);
                        })
                        .map(s => {
                          const cropName = crops.find(c => c.id === s.crop_master_id)?.name || 'Unknown Crop';
                          return (
                            <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{cropName}</td>
                              <td className="py-3.5 px-4 font-bold text-[#1B5E20] dark:text-[#4CAF50]">{s.stage_name}</td>
                              <td className="py-3.5 px-4 font-mono">Day {s.start_day}</td>
                              <td className="py-3.5 px-4 font-mono">Day {s.end_day}</td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedStage(s);
                                      setStageForm({
                                        crop_master_id: s.crop_master_id,
                                        stage_name: s.stage_name,
                                        start_day: s.start_day.toString(),
                                        end_day: s.end_day.toString()
                                      });
                                      setStageModalOpen(true);
                                    }}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStage(s.id)}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-650 dark:text-red-405 rounded-lg transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE TAB: DISEASES DATABASE */}
          {activeTab === 'diseases' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    रोग नियंत्रण (Diseases DB)
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-bold uppercase">Filter:</span>
                      <select
                        value={selectedCropFilterForDiseases}
                        onChange={e => setSelectedCropFilterForDiseases(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-855 dark:text-slate-200 text-xs font-bold focus:outline-none"
                      >
                        <option value="all">सर्व पीक प्रकार (All Crops)</option>
                        {crops.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="रोगाचे नाव किंवा लक्षणे शोधा..."
                        className="pl-9 pr-4 py-1.5 text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-805 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E20] dark:focus:ring-[#4CAF50] focus:border-transparent font-semibold w-full sm:w-52"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDisease(null);
                    setDiseaseForm({
                      crop_master_id: selectedCropFilterForDiseases !== 'all' ? selectedCropFilterForDiseases : (crops[0]?.id || ''),
                      name: '',
                      symptoms: '',
                      treatment: ''
                    });
                    setDiseaseModalOpen(true);
                  }}
                  className="bg-[#1B5E20] hover:bg-[#124115] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-center shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Disease Record
                </button>
              </div>

              {listLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-[#1B5E20] dark:text-[#4CAF50] animate-spin mb-4" />
                  <p className="text-slate-400 text-sm font-medium">{t('loading')}</p>
                </div>
              ) : diseases.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 font-medium py-12 text-center">No Disease records found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-xs">
                        <th className="py-3 px-4">Crop Type</th>
                        <th className="py-3 px-4">Disease Name</th>
                        <th className="py-3 px-4">Symptoms</th>
                        <th className="py-3 px-4">Treatment / Solution</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {diseases
                        .filter(d => selectedCropFilterForDiseases === 'all' || d.crop_master_id === selectedCropFilterForDiseases)
                        .filter(d => {
                          const q = searchTerm.toLowerCase();
                          const cropName = crops.find(c => c.id === d.crop_master_id)?.name || '';
                          return d.name?.toLowerCase().includes(q) || d.symptoms?.toLowerCase().includes(q) || cropName.toLowerCase().includes(q);
                        })
                        .map(d => {
                          const cropName = crops.find(c => c.id === d.crop_master_id)?.name || 'Unknown Crop';
                          return (
                            <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{cropName}</td>
                              <td className="py-3.5 px-4 font-bold text-red-600 dark:text-red-400">🚨 {d.name}</td>
                              <td className="py-3.5 px-4 text-xs max-w-xs truncate" title={d.symptoms}>{d.symptoms}</td>
                              <td className="py-3.5 px-4 text-xs max-w-xs truncate" title={d.treatment}>{d.treatment}</td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedDisease(d);
                                      setDiseaseForm({
                                        crop_master_id: d.crop_master_id,
                                        name: d.name,
                                        symptoms: d.symptoms,
                                        treatment: d.treatment
                                      });
                                      setDiseaseModalOpen(true);
                                    }}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDisease(d.id)}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-655 dark:text-red-405 rounded-lg transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE TAB: PESTS DATABASE */}
          {activeTab === 'pests' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-md animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    कीड नियंत्रण (Pests DB)
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-bold uppercase">Filter:</span>
                      <select
                        value={selectedCropFilterForPests}
                        onChange={e => setSelectedCropFilterForPests(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-855 dark:text-slate-200 text-xs font-bold focus:outline-none"
                      >
                        <option value="all">सर्व पीक प्रकार (All Crops)</option>
                        {crops.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="कीटक किंवा नियंत्रण पद्धती शोधा..."
                        className="pl-9 pr-4 py-1.5 text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-805 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E20] dark:focus:ring-[#4CAF50] focus:border-transparent font-semibold w-full sm:w-52"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedPest(null);
                    setPestForm({
                      crop_master_id: selectedCropFilterForPests !== 'all' ? selectedCropFilterForPests : (crops[0]?.id || ''),
                      name: '',
                      symptoms: '',
                      control_method: ''
                    });
                    setPestModalOpen(true);
                  }}
                  className="bg-[#1B5E20] hover:bg-[#124115] text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-center shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Pest Record
                </button>
              </div>

              {listLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-[#1B5E20] dark:text-[#4CAF50] animate-spin mb-4" />
                  <p className="text-slate-400 text-sm font-medium">{t('loading')}</p>
                </div>
              ) : pests.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 font-medium py-12 text-center">No Pest records found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-xs">
                        <th className="py-3 px-4">Crop Type</th>
                        <th className="py-3 px-4">Pest Name</th>
                        <th className="py-3 px-4">Symptoms</th>
                        <th className="py-3 px-4">Control Method</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      {pests
                        .filter(p => selectedCropFilterForPests === 'all' || p.crop_master_id === selectedCropFilterForPests)
                        .filter(p => {
                          const q = searchTerm.toLowerCase();
                          const cropName = crops.find(c => c.id === p.crop_master_id)?.name || '';
                          return p.name?.toLowerCase().includes(q) || p.symptoms?.toLowerCase().includes(q) || cropName.toLowerCase().includes(q);
                        })
                        .map(p => {
                          const cropName = crops.find(c => c.id === p.crop_master_id)?.name || 'Unknown Crop';
                          return (
                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{cropName}</td>
                              <td className="py-3.5 px-4 font-bold text-amber-650 dark:text-amber-500">🐛 {p.name}</td>
                              <td className="py-3.5 px-4 text-xs max-w-xs truncate" title={p.symptoms}>{p.symptoms}</td>
                              <td className="py-3.5 px-4 text-xs max-w-xs truncate" title={p.control_method}>{p.control_method}</td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedPest(p);
                                      setPestForm({
                                        crop_master_id: p.crop_master_id,
                                        name: p.name,
                                        symptoms: p.symptoms,
                                        control_method: p.control_method
                                      });
                                      setPestModalOpen(true);
                                    }}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePest(p.id)}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-650 dark:text-red-405 rounded-lg transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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

          {/* ACTIVE TAB: LANDING PAGE EDITOR */}
          {activeTab === 'landing-page' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm max-w-4xl mx-auto animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-[#1B5E20] dark:text-[#4CAF50] rounded-2xl">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    लँडिंग पेज संपादन (Edit Landing Page)
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                    Configure the main titles and descriptions displayed on the landing page for all languages.
                  </p>
                </div>
              </div>

              {listLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-[#1B5E20] dark:text-[#4CAF50] animate-spin mb-4" />
                  <p className="text-slate-400 text-sm font-medium">{t('loading')}</p>
                </div>
              ) : (
                <form onSubmit={handleLandingPageSubmit} className="space-y-8">
                  {/* Hero Section settings */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-extrabold text-[#1B5E20] dark:text-[#4CAF50] uppercase tracking-wider border-l-4 border-[#1B5E20] dark:border-[#4CAF50] pl-3">
                      Hero Section (मुख्य विभाग)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* English Hero */}
                      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-805">
                        <span className="text-xs font-black text-slate-450 dark:text-slate-500 uppercase">English</span>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Hero Title</label>
                          <input
                            type="text"
                            required
                            value={landingPageForm.hero_title_en}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, hero_title_en: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Hero Description</label>
                          <textarea
                            required
                            rows={4}
                            value={landingPageForm.hero_description_en}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, hero_description_en: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-semibold"
                          />
                        </div>
                      </div>

                      {/* Marathi Hero */}
                      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-805">
                        <span className="text-xs font-black text-slate-450 dark:text-slate-500 uppercase">मराठी (Marathi)</span>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">मुख्य शीर्षक (Title)</label>
                          <input
                            type="text"
                            required
                            value={landingPageForm.hero_title_mr}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, hero_title_mr: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">तपशील (Description)</label>
                          <textarea
                            required
                            rows={4}
                            value={landingPageForm.hero_description_mr}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, hero_description_mr: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-semibold"
                          />
                        </div>
                      </div>

                      {/* Hindi Hero */}
                      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-805">
                        <span className="text-xs font-black text-slate-450 dark:text-slate-500 uppercase">हिन्दी (Hindi)</span>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">मुख्य शीर्षक (Title)</label>
                          <input
                            type="text"
                            required
                            value={landingPageForm.hero_title_hi}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, hero_title_hi: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">विवरण (Description)</label>
                          <textarea
                            required
                            rows={4}
                            value={landingPageForm.hero_description_hi}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, hero_description_hi: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Section settings */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-extrabold text-[#1B5E20] dark:text-[#4CAF50] uppercase tracking-wider border-l-4 border-[#1B5E20] dark:border-[#4CAF50] pl-3">
                      CTA Section (कृती विभाग)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* English CTA */}
                      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-805">
                        <span className="text-xs font-black text-slate-450 dark:text-slate-500 uppercase">English</span>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">CTA Title</label>
                          <input
                            type="text"
                            required
                            value={landingPageForm.cta_title_en}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, cta_title_en: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">CTA Description</label>
                          <textarea
                            required
                            rows={4}
                            value={landingPageForm.cta_description_en}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, cta_description_en: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-semibold"
                          />
                        </div>
                      </div>

                      {/* Marathi CTA */}
                      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-805">
                        <span className="text-xs font-black text-slate-450 dark:text-slate-500 uppercase">मराठी (Marathi)</span>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">शीर्षक (Title)</label>
                          <input
                            type="text"
                            required
                            value={landingPageForm.cta_title_mr}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, cta_title_mr: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">तपशील (Description)</label>
                          <textarea
                            required
                            rows={4}
                            value={landingPageForm.cta_description_mr}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, cta_description_mr: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-semibold"
                          />
                        </div>
                      </div>

                      {/* Hindi CTA */}
                      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-805">
                        <span className="text-xs font-black text-slate-450 dark:text-slate-500 uppercase">हिन्दी (Hindi)</span>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">शीर्षक (Title)</label>
                          <input
                            type="text"
                            required
                            value={landingPageForm.cta_title_hi}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, cta_title_hi: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">विवरण (Description)</label>
                          <textarea
                            required
                            rows={4}
                            value={landingPageForm.cta_description_hi}
                            onChange={e => setLandingPageForm(prev => ({ ...prev, cta_description_hi: e.target.value }))}
                            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="submit"
                      disabled={savingLandingPage}
                      className="bg-[#1B5E20] hover:bg-[#124115] text-white font-extrabold text-sm px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-[#1B5E20]/20 transition-all disabled:opacity-50 cursor-pointer w-full sm:w-auto"
                    >
                      {savingLandingPage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>जतन होत आहे (Saving...)</span>
                        </>
                      ) : (
                        <>
                          <span>बदल जतन करा (Save Changes)</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </main>
      </div>
      {/* Crop Master Add/Edit Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 max-w-lg w-full relative animate-in fade-in zoom-in-95 duration-150 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {selectedCrop ? 'Edit Crop Master' : 'Add New Crop Master'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">Manage global crop settings in the master database.</p>

            <form onSubmit={handleCropSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Crop Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cotton (Kapus)"
                    value={cropForm.name}
                    onChange={e => setCropForm({ ...cropForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cash Crop, Cereal"
                    value={cropForm.category}
                    onChange={e => setCropForm({ ...cropForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150"
                    value={cropForm.duration_days}
                    onChange={e => setCropForm({ ...cropForm, duration_days: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Expected Yield</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10-12 Quintals/Acre"
                    value={cropForm.expected_yield}
                    onChange={e => setCropForm({ ...cropForm, expected_yield: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Recommended Varieties (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Bt Cotton (Kanak, Bunny), Non-Bt"
                  value={cropForm.varieties}
                  onChange={e => setCropForm({ ...cropForm, varieties: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide general information about the crop"
                  value={cropForm.description}
                  onChange={e => setCropForm({ ...cropForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-[#1B5E20] hover:bg-[#124115] text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crop Stage Add/Edit Modal */}
      {stageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 max-w-md w-full relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {selectedStage ? 'Edit Crop Stage' : 'Add New Crop Stage'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">Manage timeline stages for recommendations schedule.</p>

            <form onSubmit={handleStageSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Select Crop Master</label>
                <select
                  disabled={!!selectedStage}
                  value={stageForm.crop_master_id}
                  onChange={e => setStageForm({ ...stageForm, crop_master_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm font-semibold"
                >
                  {crops.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Stage Name (English / Localised)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sowing & Germination (पेरणी आणि उगवण)"
                  value={stageForm.stage_name}
                  onChange={e => setStageForm({ ...stageForm, stage_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Start Day</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1"
                    value={stageForm.start_day}
                    onChange={e => setStageForm({ ...stageForm, start_day: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">End Day</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15"
                    value={stageForm.end_day}
                    onChange={e => setStageForm({ ...stageForm, end_day: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStageModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-[#1B5E20] hover:bg-[#124115] text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disease Add/Edit Modal */}
      {diseaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 max-w-md w-full relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {selectedDisease ? 'Edit Disease Record' : 'Add New Disease Record'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">Manage crop disease specifications and treatments.</p>

            <form onSubmit={handleDiseaseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Select Crop Master</label>
                <select
                  disabled={!!selectedDisease}
                  value={diseaseForm.crop_master_id}
                  onChange={e => setDiseaseForm({ ...diseaseForm, crop_master_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm font-semibold"
                >
                  {crops.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Disease Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leaf Spot (पानावरील ठिपके)"
                  value={diseaseForm.name}
                  onChange={e => setDiseaseForm({ ...diseaseForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Symptoms</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the visible symptoms of the disease..."
                  value={diseaseForm.symptoms}
                  onChange={e => setDiseaseForm({ ...diseaseForm, symptoms: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Treatment / Solution</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Specify chemical spray, fertilizer adjustments, or local organic remedies..."
                  value={diseaseForm.treatment}
                  onChange={e => setDiseaseForm({ ...diseaseForm, treatment: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDiseaseModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-[#1B5E20] hover:bg-[#124115] text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pest Add/Edit Modal */}
      {pestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 max-w-md w-full relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {selectedPest ? 'Edit Pest Record' : 'Add New Pest Record'}
            </h3>
            <p className="text-sm text-slate-500 mb-6">Manage crop pests details and control methods.</p>

            <form onSubmit={handlePestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Select Crop Master</label>
                <select
                  disabled={!!selectedPest}
                  value={pestForm.crop_master_id}
                  onChange={e => setPestForm({ ...pestForm, crop_master_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm font-semibold"
                >
                  {crops.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Pest Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aphids (मावा)"
                  value={pestForm.name}
                  onChange={e => setPestForm({ ...pestForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Symptoms</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the damages or visible symptoms on leaves/crops..."
                  value={pestForm.symptoms}
                  onChange={e => setPestForm({ ...pestForm, symptoms: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Control Method</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Specify chemical spray, bio-pesticides or physical removal methods..."
                  value={pestForm.control_method}
                  onChange={e => setPestForm({ ...pestForm, control_method: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B5E20] text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPestModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-[#1B5E20] hover:bg-[#124115] text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
