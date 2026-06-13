import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import toast from 'react-hot-toast';
import { Sprout, Store } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-lg mx-auto my-12 p-8 bg-white rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">
          {t('register')} Account
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          तुम्ही कोण आहात ते आधी निवडा
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── ROLE SELECTION – FIRST ── */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              मी आहे... / I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Farmer card */}
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, role: 'farmer', email: '' }))}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer font-bold text-sm
                  ${!isShopOwner
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-md shadow-emerald-100'
                    : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
              >
                <span className={`p-2.5 rounded-xl ${!isShopOwner ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                  <Sprout className="w-6 h-6" />
                </span>
                <span>शेतकरी</span>
                <span className="text-xs font-normal opacity-75">Farmer</span>
              </button>

              {/* Shop Owner card */}
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, role: 'shop_owner' }))}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer font-bold text-sm
                  ${isShopOwner
                    ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md shadow-blue-100'
                    : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
              >
                <span className={`p-2.5 rounded-xl ${isShopOwner ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
                  <Store className="w-6 h-6" />
                </span>
                <span>दुकानदार</span>
                <span className="text-xs font-normal opacity-75">Shop Owner</span>
              </button>
            </div>
            {/* Hidden select to keep form value in sync */}
            <input type="hidden" name="role" value={form.role} />
          </div>

          {/* ── DIVIDER ── */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-gray-400 font-semibold uppercase tracking-widest">
                {isShopOwner ? 'दुकानदार माहिती' : 'शेतकरी माहिती'}
              </span>
            </div>
          </div>

          {/* ── FULL NAME ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t('fullName')}
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={form.fullName}
              onChange={handleChange}
              placeholder="Sanchit Patil"
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>

          {/* ── MOBILE ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {t('mobileNumber')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-semibold text-sm">
                +91
              </span>
              <input
                type="tel"
                name="mobile"
                required
                maxLength={10}
                value={form.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* ── EMAIL (only for Shop Owner) ── */}
          {isShopOwner && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-gray-400 ml-1">(दुकानदारांसाठी आवश्यक)</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="shop@example.com"
                className="block w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-blue-50/30"
              />
            </div>
          )}

          {/* ── STATE & DISTRICT ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t('state')}
              </label>
              <input
                type="text"
                name="state"
                required
                value={form.state}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t('district')}
              </label>
              <input
                type="text"
                name="district"
                required
                value={form.district}
                onChange={handleChange}
                placeholder="Pune"
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* ── TALUKA & VILLAGE ── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t('taluka')}
              </label>
              <input
                type="text"
                name="taluka"
                required
                value={form.taluka}
                onChange={handleChange}
                placeholder="Haveli"
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t('village')}
              </label>
              <input
                type="text"
                name="village"
                required
                value={form.village}
                onChange={handleChange}
                placeholder="Manjri"
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* ── SHOP OWNER EXTRA FIELDS ── */}
          {isShopOwner && (
            <div className="space-y-4 bg-blue-50 p-5 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-blue-800 flex items-center gap-2 text-sm">
                <Store className="w-4 h-4" />
                Shop Details (दुकानाची माहिती)
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Shop Name (दुकानाचे नाव) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="shopName"
                  required
                  value={form.shopName}
                  onChange={handleChange}
                  placeholder="Krushi Seva Kendra"
                  className="block w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  GST Number / License No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  required
                  value={form.gstNumber}
                  onChange={handleChange}
                  placeholder="27AADCB2230M1Z2"
                  className="block w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password (पासवर्ड) <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="block w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          )}

          {/* ── SUBMIT ── */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-sm text-white
              ${isShopOwner
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
              }
              disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? 'नोंदणी होत आहे...' : (isShopOwner ? 'दुकानदार म्हणून नोंदणी करा' : 'शेतकरी म्हणून नोंदणी करा')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-primary font-bold hover:underline">
            Already have an account? Login here.
          </Link>
        </div>
      </div>
    </div>
  );
};
