import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Settings, PlusCircle, Trash, BarChart3, Users, Sprout, Bell } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form controls
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: '',
    category: 'Cash Crop',
    durationDays: 120,
    expectedYield: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, cropsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/crops')
      ]);
      setStats(statsRes.data);
      setCrops(cropsRes.data);
    } catch (err) {
      toast.error('Failed to load admin stats/crops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCropMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/crops', newCrop);
      toast.success('Crop Master registered!');
      setShowAddForm(false);
      setNewCrop({ name: '', category: 'Cash Crop', durationDays: 120, expectedYield: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to register crop master');
    }
  };

  const handleDeleteCropMaster = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Crop Master?')) return;
    try {
      await axios.delete(`/api/admin/crops/${id}`);
      toast.success('Crop Master deleted');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-red-600 font-extrabold text-lg">Forbidden: Access Restricted to Admins</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Settings className="text-primary w-8 h-8" /> Admin Panel
          </h1>
          <p className="text-gray-500 mt-1">Manage core agricultural metrics, crop master databases, and stage parameters.</p>
        </div>

        {/* Stats widgets */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-gray-400 text-xs font-bold uppercase">Total Farmers</span>
                <span className="text-2xl font-black text-gray-900 mt-0.5 block">{stats.totalFarmers}</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-gray-400 text-xs font-bold uppercase">Total Crop Records</span>
                <span className="text-2xl font-black text-gray-900 mt-0.5 block">{stats.totalCrops}</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-gray-400 text-xs font-bold uppercase">Active Crops</span>
                <span className="text-2xl font-black text-gray-900 mt-0.5 block">{stats.activeCrops}</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-gray-400 text-xs font-bold uppercase">Alerts Issued</span>
                <span className="text-2xl font-black text-gray-900 mt-0.5 block">{stats.notificationsSent}</span>
              </div>
            </div>
          </div>
        )}

        {/* Master lists CRUD */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Crop Master Database</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Crop Master
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddCropMaster} className="mb-8 p-6 bg-background rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Name</label>
                <input
                  type="text"
                  required
                  value={newCrop.name}
                  onChange={e => setNewCrop({ ...newCrop, name: e.target.value })}
                  placeholder="e.g. Wheat (गेहूं)"
                  className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category</label>
                <select
                  value={newCrop.category}
                  onChange={e => setNewCrop({ ...newCrop, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                >
                  <option value="Cash Crop">Cash Crop</option>
                  <option value="Cereal">Cereal</option>
                  <option value="Oilseed">Oilseed</option>
                  <option value="Vegetable">Vegetable</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Duration (Days)</label>
                <input
                  type="number"
                  required
                  value={newCrop.durationDays}
                  onChange={e => setNewCrop({ ...newCrop, durationDays: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Yield Spec</label>
                <input
                  type="text"
                  required
                  value={newCrop.expectedYield}
                  onChange={e => setNewCrop({ ...newCrop, expectedYield: e.target.value })}
                  placeholder="e.g. 15 Quintals"
                  className="w-full px-3 py-2 border rounded-lg bg-white text-sm"
                />
              </div>
              <div className="md:col-span-4 flex gap-2 justify-end">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:underline">Cancel</button>
                <button type="submit" className="bg-primary text-white text-sm font-bold px-5 py-2 rounded-lg">Register</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-xs">
                  <th className="py-3 px-4">Crop Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Duration (Days)</th>
                  <th className="py-3 px-4">Expected Yield</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                {crops.map(c => (
                  <tr key={c.id}>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{c.name}</td>
                    <td className="py-3.5 px-4">{c.category}</td>
                    <td className="py-3.5 px-4">{c.duration_days} Days</td>
                    <td className="py-3.5 px-4">{c.expected_yield}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteCropMaster(c.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
