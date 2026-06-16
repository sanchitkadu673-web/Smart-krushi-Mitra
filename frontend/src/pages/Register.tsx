import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Sprout, Store, Leaf, ChevronLeft, User, Smartphone, MapPin, Building, Globe, LockKeyhole } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lang = i18n.language;

  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    state: 'Maharashtra',
    district: '',
    taluka: '',
    village: '',
    role: (searchParams.get('role') === 'super_admin' ? 'farmer' : searchParams.get('role')) || 'farmer',
    password: '',
    shopName: '',
    gstNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const urlRole = searchParams.get('role');
  useEffect(() => {
    if (urlRole) {
      if (urlRole === 'super_admin') {
        setForm(prev => ({ ...prev, role: 'farmer' }));
      } else {
        setForm(prev => ({ ...prev, role: urlRole }));
      }
    }
  }, [urlRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      // Clear email when switching to farmer
      ...(name === 'role' && value === 'farmer' ? { email: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (form.role === 'shop_owner' && !form.email.trim()) {
      toast.error('Email address is required for Shop Owner registration');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const isShopOwner = form.role === 'shop_owner';
  const accent = isShopOwner ? '#3B82F6' : '#10B981';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FAF4] dark:bg-slate-950 relative overflow-hidden font-sans py-12">
      {/* Subtle background orbs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-[90px] -z-0 pointer-events-none" style={{ background: `${accent}08` }}></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[70px] -z-0 pointer-events-none" style={{ background: `${accent}06` }}></div>

      <div className="w-full max-w-lg px-6 relative z-10">
        
        {/* Top brand header */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5" style={{ color: accent }} />
            </div>
            <span className="text-[#1A2E1A] dark:text-white font-black text-lg">{t('appName')}</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-650 dark:hover:text-slate-300 text-sm font-semibold transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {lang === 'mr' ? 'मुख्यपृष्ठ' : lang === 'hi' ? 'होम' : 'Home'}
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/30 p-8 md:p-10">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#1A2E1A] dark:text-white leading-tight">
              {t('register')} Account
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1.5">
              {lang === 'mr' ? 'तुमची भूमिका निवडून नोंदणी करा' : 'Select your role and register'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── ROLE SELECTION ── */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#1A2E1A] dark:text-slate-300 mb-3">
                {lang === 'mr' ? 'मी आहे... / I am a...' : 'Register as...'}
              </label>
              <div className="grid grid-cols-2 gap-3.5">
                {/* Farmer button */}
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, role: 'farmer', email: '' }))}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all cursor-pointer font-black text-xs ${
                    !isShopOwner
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 dark:text-emerald-450 dark:bg-emerald-950/20 shadow-md shadow-emerald-100/20'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 hover:border-emerald-300 dark:hover:border-emerald-900/50'
                  }`}
                >
                  <span className={`p-2.5 rounded-xl ${!isShopOwner ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40' : 'bg-slate-100 dark:bg-slate-805 text-slate-400'}`}>
                    <Sprout className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="block">शेतकरी</span>
                    <span className="text-[10px] font-semibold opacity-80 mt-0.5 block">Farmer</span>
                  </div>
                </button>

                {/* Shop Owner button */}
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, role: 'shop_owner' }))}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all cursor-pointer font-black text-xs ${
                    isShopOwner
                      ? 'border-blue-500 bg-blue-50/50 text-blue-800 dark:text-blue-450 dark:bg-blue-950/20 shadow-md shadow-blue-100/20'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 hover:border-blue-300 dark:hover:border-blue-900/50'
                  }`}
                >
                  <span className={`p-2.5 rounded-xl ${isShopOwner ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-slate-805 text-slate-400'}`}>
                    <Store className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="block">दुकानदार</span>
                    <span className="text-[10px] font-semibold opacity-80 mt-0.5 block">Shop Owner</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
              <div className="relative flex justify-center">
                <span className="px-3.5 bg-white dark:bg-slate-900 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                  {isShopOwner ? (lang === 'mr' ? 'दुकानदार माहिती' : 'Shop Owner Details') : (lang === 'mr' ? 'शेतकरी माहिती' : 'Farmer Details')}
                </span>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-[#1A2E1A] dark:text-white mb-2">
                {t('fullName')}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Sanchit Patil"
                  className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 font-semibold text-sm transition-all"
                  style={{ '--tw-ring-color': accent } as React.CSSProperties}
                  onFocus={(e) => { e.target.style.borderColor = accent; }}
                  onBlur={(e) => { e.target.style.borderColor = ''; }}
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-bold text-[#1A2E1A] dark:text-white mb-2">
                {t('mobileNumber')}
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 font-bold text-slate-600 dark:text-slate-350 text-sm shrink-0">
                  🇮🇳 <span>+91</span>
                </div>
                <div className="relative flex-1">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="tel"
                    name="mobile"
                    required
                    maxLength={10}
                    value={form.mobile}
                    onChange={(e) => setForm(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                    placeholder="9876543210"
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 font-semibold text-sm transition-all"
                    style={{ '--tw-ring-color': accent } as React.CSSProperties}
                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                    onBlur={(e) => { e.target.style.borderColor = ''; }}
                  />
                </div>
              </div>
            </div>

            {/* Email (only for Shop Owner) */}
            {isShopOwner && (
              <div>
                <label className="block text-sm font-bold text-[#1A2E1A] dark:text-white mb-2">
                  Email Address <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-slate-400 ml-1">({lang === 'mr' ? 'दुकानदारांसाठी आवश्यक' : 'Required for shop owners'})</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="shop@example.com"
                  className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 font-semibold text-sm transition-all"
                  style={{ '--tw-ring-color': accent } as React.CSSProperties}
                  onFocus={(e) => { e.target.style.borderColor = accent; }}
                  onBlur={(e) => { e.target.style.borderColor = ''; }}
                />
              </div>
            )}

            {/* STATE & DISTRICT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1A2E1A] dark:text-white mb-2">
                  {t('state')}
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="state"
                    required
                    value={form.state}
                    onChange={handleChange}
                    className="block w-full pl-9 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 font-semibold text-sm transition-all"
                    style={{ '--tw-ring-color': accent } as React.CSSProperties}
                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                    onBlur={(e) => { e.target.style.borderColor = ''; }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A2E1A] dark:text-white mb-2">
                  {t('district')}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="district"
                    required
                    value={form.district}
                    onChange={handleChange}
                    placeholder="Pune"
                    className="block w-full pl-9 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 font-semibold text-sm transition-all"
                    style={{ '--tw-ring-color': accent } as React.CSSProperties}
                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                    onBlur={(e) => { e.target.style.borderColor = ''; }}
                  />
                </div>
              </div>
            </div>

            {/* TALUKA & VILLAGE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1A2E1A] dark:text-white mb-2">
                  {t('taluka')}
                </label>
                <input
                  type="text"
                  name="taluka"
                  required
                  value={form.taluka}
                  onChange={handleChange}
                  placeholder="Haveli"
                  className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 font-semibold text-sm transition-all"
                  style={{ '--tw-ring-color': accent } as React.CSSProperties}
                  onFocus={(e) => { e.target.style.borderColor = accent; }}
                  onBlur={(e) => { e.target.style.borderColor = ''; }}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A2E1A] dark:text-white mb-2">
                  {t('village')}
                </label>
                <input
                  type="text"
                  name="village"
                  required
                  value={form.village}
                  onChange={handleChange}
                  placeholder="Manjri"
                  className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 font-semibold text-sm transition-all"
                  style={{ '--tw-ring-color': accent } as React.CSSProperties}
                  onFocus={(e) => { e.target.style.borderColor = accent; }}
                  onBlur={(e) => { e.target.style.borderColor = ''; }}
                />
              </div>
            </div>

            {/* SHOP OWNER EXTRA DETAILS */}
            {isShopOwner && (
              <div className="space-y-4 bg-blue-50/50 dark:bg-slate-800/40 p-5 rounded-2xl border border-blue-100 dark:border-slate-800">
                <h3 className="font-black text-blue-800 dark:text-blue-400 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <Store className="w-4.5 h-4.5" />
                  Shop Details (दुकानाची माहिती)
                </h3>
                <div>
                  <label className="block text-xs font-bold text-[#1A2E1A] dark:text-slate-350 mb-1.5">
                    Shop Name (दुकानाचे नाव) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="shopName"
                      required
                      value={form.shopName}
                      onChange={handleChange}
                      placeholder="Krushi Seva Kendra"
                      className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 font-semibold text-sm transition-all"
                      style={{ '--tw-ring-color': accent } as React.CSSProperties}
                      onFocus={(e) => { e.target.style.borderColor = accent; }}
                      onBlur={(e) => { e.target.style.borderColor = ''; }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2E1A] dark:text-slate-350 mb-1.5">
                    GST / License No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    required
                    value={form.gstNumber}
                    onChange={handleChange}
                    placeholder="27AADCB2230M1Z2"
                    className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 font-semibold text-sm transition-all"
                    style={{ '--tw-ring-color': accent } as React.CSSProperties}
                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                    onBlur={(e) => { e.target.style.borderColor = ''; }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A2E1A] dark:text-slate-350 mb-1.5">
                    Password (पासवर्ड) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="block w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 font-semibold text-sm transition-all"
                      style={{ '--tw-ring-color': accent } as React.CSSProperties}
                      onFocus={(e) => { e.target.style.borderColor = accent; }}
                      onBlur={(e) => { e.target.style.borderColor = ''; }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 font-black py-4 rounded-2xl text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-4"
              style={{ background: `linear-gradient(135deg, ${accent}ee, ${accent}bb)` }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  {lang === 'mr' ? 'नोंदणी होत आहे...' : 'Processing...'}
                </span>
              ) : (
                <>
                  {isShopOwner
                    ? (lang === 'mr' ? 'दुकानदार म्हणून नोंदणी करा' : lang === 'hi' ? 'दुकानदार पंजीकरण' : 'Register as Shop Owner')
                    : (lang === 'mr' ? 'शेतकरी म्हणून नोंदणी करा' : lang === 'hi' ? 'किसान पंजीकरण' : 'Register as Farmer')
                  }
                </>
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {lang === 'mr' ? 'आधीच खाते आहे?' : 'Already have an account?'}{' '}
              <Link
                to="/login"
                className="font-black transition-colors hover:underline"
                style={{ color: accent }}
              >
                {lang === 'mr' ? 'लॉगिन करा' : 'Login here'}
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
