import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, ChevronDown } from 'lucide-react';

export const AddCrop: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [masters, setMasters] = useState<any[]>([]);
  const [form, setForm] = useState({
    cropMasterId: '',
    sowingDate: new Date().toISOString().split('T')[0],
    area: '',
    variety: '',
    farmingType: 'irrigated'
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const res = await axios.get('/api/crops/masters');
        setMasters(res.data);
        if (res.data.length > 0) {
          setForm(f => ({ ...f, cropMasterId: res.data[0].id }));
          setSearchQuery(res.data[0].name);
        }
      } catch (err) {
        const mockMasters = [
          { id: 'b30353c5-f761-460d-8521-4ea78e4726e6', name: 'Cotton (Kapus / कपास)' },
          { id: 'd14467d0-1c09-411a-85ba-c189ef7dc6bb', name: 'Soybean (सोयाबीन)' },
          { id: 'f99617d1-e63d-4c8d-8fe0-cbb1fa0d7ff3', name: 'Wheat (Gahu / गेहूं)' }
        ];
        setMasters(mockMasters);
        setForm(f => ({ ...f, cropMasterId: mockMasters[0].id }));
        setSearchQuery(mockMasters[0].name);
      }
    };
    fetchMasters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cropMasterId) {
      toast.error('Please select a crop type');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/crops', {
        cropMasterId: form.cropMasterId,
        sowingDate: form.sowingDate,
        area: form.area ? parseFloat(form.area) : undefined,
        variety: form.variety || undefined,
        farmingType: form.farmingType
      });
      toast.success('Crop registered successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to register crop');
    } finally {
      setLoading(false);
    }
  };

  const filteredMasters = masters.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Register New Crop
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Provide sowing details to start getting automated updates on stages, fertilizer applications, and irrigation recommendations.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('selectCrop')}
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search crop..."
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setIsOpen(true);
                    // Match directly if exists
                    const matched = masters.find(m => m.name.toLowerCase() === e.target.value.toLowerCase());
                    if (matched) {
                      setForm(f => ({ ...f, cropMasterId: matched.id }));
                    } else {
                      setForm(f => ({ ...f, cropMasterId: '' }));
                    }
                  }}
                  onFocus={() => setIsOpen(true)}
                  onBlur={() => {
                    // Timeout to allow clicking suggestions list items
                    setTimeout(() => setIsOpen(false), 200);
                  }}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none bg-white font-medium"
                />
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-5 h-5" />
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-150 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {filteredMasters.length > 0 ? (
                    filteredMasters.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onMouseDown={() => {
                          setSearchQuery(m.name);
                          setForm(f => ({ ...f, cropMasterId: m.id }));
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors font-medium text-gray-800 ${
                          form.cropMasterId === m.id ? 'bg-primary/5 text-primary border-l-4 border-primary' : ''
                        }`}
                      >
                        {m.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No matching crops found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('sowingDate')}
                </label>
                <input
                  type="date"
                  required
                  value={form.sowingDate}
                  onChange={e => setForm({ ...form, sowingDate: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {i18n.language === 'mr' ? 'शेतीचा प्रकार' : i18n.language === 'hi' ? 'खेती का प्रकार' : 'Farming Type'}
                </label>
                <select
                  value={form.farmingType}
                  onChange={e => setForm({ ...form, farmingType: e.target.value })}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none font-medium bg-white"
                >
                  <option value="irrigated">{i18n.language === 'mr' ? 'बागायती (Irrigated)' : i18n.language === 'hi' ? 'सिंचित (Irrigated)' : 'Irrigated'}</option>
                  <option value="rainfed">{i18n.language === 'mr' ? 'जिरायती/कोरडवाहू (Rainfed)' : i18n.language === 'hi' ? 'वर्षा आधारित (Rainfed)' : 'Rainfed'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('area')} (Optional)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.area}
                  onChange={e => setForm({ ...form, area: e.target.value })}
                  placeholder="e.g. 2.5"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('variety')} (Optional)
                </label>
                <input
                  type="text"
                  value={form.variety}
                  onChange={e => setForm({ ...form, variety: e.target.value })}
                  placeholder="e.g. Bt Cotton"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-sm"
            >
              {loading ? 'Registering...' : 'Register Crop'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
