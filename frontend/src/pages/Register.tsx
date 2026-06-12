import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import toast from 'react-hot-toast';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    state: 'Maharashtra', // Default state
    district: '',
    taluka: '',
    village: '',
    role: searchParams.get('role') || 'farmer',
    password: '',
    shopName: '',
    gstNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const urlRole = searchParams.get('role');
  useEffect(() => {
    if (urlRole) {
      setForm(prev => ({ ...prev, role: urlRole }));
    }
  }, [urlRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-lg mx-auto my-12 p-8 bg-white rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
          {t('register')} Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={form.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="farmer@example.com"
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>

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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
            >
              <option value="farmer">Farmer (शेतकरी)</option>
              <option value="shop_owner">Shop Owner (दुकानदार)</option>
              <option value="expert">Agriculture Expert (कृषी तज्ञ)</option>
              <option value="super_admin">Admin (प्रशासक)</option>
            </select>
          </div>

          {form.role === 'shop_owner' && (
            <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
              <h3 className="font-bold text-slate-800">Shop Owner Details</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Shop Name (दुकानाचे नाव)
                </label>
                <input
                  type="text"
                  name="shopName"
                  required
                  value={form.shopName}
                  onChange={handleChange}
                  placeholder="Krushi Seva Kendra"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  GST Number / License No.
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  required
                  value={form.gstNumber}
                  onChange={handleChange}
                  placeholder="27AADCB2230M1Z2"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password (पासवर्ड)
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none bg-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-sm"
          >
            {loading ? 'Registering...' : t('register')}
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
