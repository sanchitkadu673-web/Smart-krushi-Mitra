import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { profile, updateProfileState } = useAuth();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    fullName: profile?.full_name || '',
    state: profile?.state || '',
    district: profile?.district || '',
    taluka: profile?.taluka || '',
    village: profile?.village || '',
    shopName: profile?.shop_name || '',
    gstNumber: profile?.license_number || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put('/api/profile', {
        full_name: form.fullName,
        state: form.state,
        district: form.district,
        taluka: form.taluka,
        village: form.village,
        shop_name: form.shopName,
        license_number: form.gstNumber
      });
      updateProfileState(response.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            {t('profile')} Settings
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t('fullName')}
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">
                {t('mobileNumber')} (Read-Only)
              </label>
              <input
                type="tel"
                disabled
                value={profile?.mobile || ''}
                className="block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-gray-400 font-semibold cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t('state')}
                </label>
                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t('district')}
                </label>
                <input
                  type="text"
                  required
                  value={form.district}
                  onChange={e => setForm({ ...form, district: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary"
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
                  required
                  value={form.taluka}
                  onChange={e => setForm({ ...form, taluka: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t('village')}
                </label>
                <input
                  type="text"
                  required
                  value={form.village}
                  onChange={e => setForm({ ...form, village: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {profile?.role === 'shop_owner' && (
              <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-slate-800">Shop Details (दुकानाची माहिती)</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Shop Name (दुकानाचे नाव)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.shopName}
                    onChange={e => setForm({ ...form, shopName: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    GST Number / License No. (परवाना क्रमांक)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.gstNumber}
                    onChange={e => setForm({ ...form, gstNumber: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary bg-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-sm"
            >
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
