import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Activity, Calendar, Droplets, ShieldAlert, Sparkles, Sprout } from 'lucide-react';

export const CropDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const [crop, setCrop] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'fertilizer' | 'spray' | 'irrigation' | 'pests' | 'diseases'>('fertilizer');

  // Edit Crop fields state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    sowingDate: '',
    area: '',
    variety: '',
    status: 'active'
  });

  const handleEditClick = () => {
    if (!crop) return;
    setEditForm({
      sowingDate: crop.sowing_date,
      area: crop.area || '',
      variety: crop.variety || '',
      status: crop.status || 'active'
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/crops/${id}`, {
        sowingDate: editForm.sowingDate,
        area: editForm.area ? parseFloat(editForm.area) : undefined,
        variety: editForm.variety || undefined,
        status: editForm.status
      });
      setCrop(res.data);
      
      // Refetch recommendations immediately
      const recsRes = await axios.get(`/api/recommendations/${id}`);
      setRecommendations(recsRes.data);
      
      setIsEditing(false);
      toast.success('Crop details updated!');
    } catch (err) {
      toast.error('Failed to update details');
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [cropRes, recsRes] = await Promise.all([
          axios.get(`/api/crops/${id}`),
          axios.get(`/api/recommendations/${id}`)
        ]);
        setCrop(cropRes.data);
        setRecommendations(recsRes.data);
      } catch (err) {
        toast.error('Failed to load crop recommendation timeline');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!crop || !recommendations) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-gray-500">Crop recommendations not found.</p>
          <Link to="/dashboard" className="text-primary hover:underline mt-4 inline-block">Go back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('dashboard')}
        </Link>

        {/* Header Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-4 items-center">
            <span className="text-4xl">🌱</span>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{crop.crop_master.name}</h1>
              <p className="text-sm text-gray-500 mt-1">Sown on: {crop.sowing_date} • {crop.area ? `${crop.area} Acres` : 'No area specified'}</p>
              <button 
                onClick={handleEditClick}
                className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-lg mt-2 hover:bg-primary/20 transition-all flex items-center gap-1.5"
              >
                ✏️ Edit Details
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50 text-center">
              <span className="block text-xs font-bold text-gray-400 uppercase">Crop Age</span>
              <span className="text-lg font-black text-primary mt-1 block">{recommendations.daysSinceSowing} Days</span>
            </div>
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50 text-center">
              <span className="block text-xs font-bold text-gray-400 uppercase">Expected Harvest</span>
              <span className="text-sm font-black text-primary mt-1 block">{recommendations.harvestDate}</span>
            </div>
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50 text-center col-span-2 sm:col-span-1">
              <span className="block text-xs font-bold text-gray-400 uppercase">Current Stage</span>
              <span className="text-xs font-black text-primary mt-1 block truncate">
                {recommendations.currentStage?.stageName || 'Sowing'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar timeline */}
        {recommendations.currentStage && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Active Stage Progress
            </h3>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (recommendations.daysSinceSowing / crop.crop_master.duration_days) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500 font-semibold">
              <span>Sowing (Day 0)</span>
              <span>{recommendations.currentStage.stageName}</span>
              <span>Harvest (Day {crop.crop_master.duration_days})</span>
            </div>
          </div>
        )}

        {/* Tabs and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation tab links */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-1">
            {[
              { id: 'fertilizer', label: t('fertilizers'), icon: Sparkles },
              { id: 'spray', label: t('sprays'), icon: Sprout },
              { id: 'irrigation', label: t('irrigation'), icon: Droplets },
              { id: 'pests', label: t('pests'), icon: ShieldAlert },
              { id: 'diseases', label: t('diseases'), icon: ShieldAlert }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content panel */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
            {activeTab === 'fertilizer' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">{t('fertilizers')}</h3>
                {recommendations.fertilizers.length === 0 ? (
                  <p className="text-gray-400 text-sm">No fertilizer recommendations required at this stage.</p>
                ) : (
                  <div className="space-y-4">
                    {recommendations.fertilizers.map((f: any) => (
                      <div key={f.id} className="p-4 rounded-xl bg-green-50/20 border border-green-100/50">
                        <h4 className="font-extrabold text-gray-900">{f.fertilizer_name}</h4>
                        <p className="text-sm text-gray-600 mt-1">Recommended Quantity: <span className="font-bold text-primary">{f.quantity}</span></p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'spray' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">{t('sprays')}</h3>
                {recommendations.sprays.length === 0 ? (
                  <p className="text-gray-400 text-sm">No sprays schedules defined for current stage.</p>
                ) : (
                  <div className="space-y-4">
                    {recommendations.sprays.map((s: any) => (
                      <div key={s.id} className="p-4 rounded-xl bg-green-50/20 border border-green-100/50">
                        <h4 className="font-extrabold text-gray-900">{s.spray_name}</h4>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'irrigation' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">{t('irrigation')}</h3>
                {recommendations.irrigation.length === 0 ? (
                  <p className="text-gray-400 text-sm">Standard rainfall suffices. No extra irrigation schedules active.</p>
                ) : (
                  <div className="space-y-4">
                    {recommendations.irrigation.map((i: any) => (
                      <div key={i.id} className="p-4 rounded-xl bg-green-50/20 border border-green-100/50">
                        <h4 className="font-extrabold text-gray-900">Water Requirement:</h4>
                        <p className="text-sm text-gray-600 mt-1">{i.water_requirement}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pests' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">Pests to watch out for</h3>
                {recommendations.pests.length === 0 ? (
                  <p className="text-gray-400 text-sm">No common pests reported for this crop type.</p>
                ) : (
                  <div className="space-y-6">
                    {recommendations.pests.map((p: any) => (
                      <div key={p.id} className="p-5 rounded-xl border border-red-100 bg-red-50/10">
                        <h4 className="font-extrabold text-red-700 text-lg">{p.name}</h4>
                        <p className="text-sm text-gray-600 mt-2"><span className="font-bold">Symptoms:</span> {p.symptoms}</p>
                        <p className="text-sm text-gray-600 mt-1"><span className="font-bold">Control Method:</span> {p.control_method}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'diseases' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">Diseases risk & prevention</h3>
                {recommendations.diseases.length === 0 ? (
                  <p className="text-gray-400 text-sm">No common diseases reported for this crop type.</p>
                ) : (
                  <div className="space-y-6">
                    {recommendations.diseases.map((d: any) => (
                      <div key={d.id} className="p-5 rounded-xl border border-red-100 bg-red-50/10">
                        <h4 className="font-extrabold text-red-700 text-lg">{d.name}</h4>
                        <p className="text-sm text-gray-600 mt-2"><span className="font-bold">Symptoms:</span> {d.symptoms}</p>
                        <p className="text-sm text-gray-600 mt-1"><span className="font-bold">Treatment:</span> {d.treatment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Details Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-150 p-6 max-w-md w-full relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Edit Crop Details</h3>
            <p className="text-sm text-gray-500 mb-6">Modify details for your registered crop. Sowing date shifts will recalculate the stages timeline.</p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Sowing Date</label>
                <input 
                  type="date"
                  required
                  value={editForm.sowingDate}
                  onChange={e => setEditForm({ ...editForm, sowingDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Area (Acres)</label>
                  <input 
                    type="number"
                    step="0.1"
                    value={editForm.area}
                    onChange={e => setEditForm({ ...editForm, area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Variety</label>
                  <input 
                    type="text"
                    value={editForm.variety}
                    onChange={e => setEditForm({ ...editForm, variety: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Crop Status</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary bg-white font-medium"
                >
                  <option value="active">Active (सक्रिय)</option>
                  <option value="harvested">Harvested (काढणी झालेले)</option>
                  <option value="abandoned">Abandoned (सोडून दिलेले)</option>
                </select>
              </div>

              <div className="flex gap-3.5 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-2/3 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
