import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, ChevronDown, ArrowLeft, Sprout, UploadCloud, X, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { cropTranslations } from '../constants/cropTranslations';

export const AddCrop: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [masters, setMasters] = useState<any[]>([]);
  const [form, setForm] = useState({
    cropMasterId: '',
    sowingDate: new Date().toISOString().split('T')[0],
    area: '',
    variety: '',
    farmingType: 'irrigated',
    soilType: 'black'
  });

  const [soilReportFile, setSoilReportFile] = useState<File | null>(null);
  const [soilReportBase64, setSoilReportBase64] = useState<string | null>(null);
  const [soilReportMime, setSoilReportMime] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isVarietyOpen, setIsVarietyOpen] = useState(false);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const res = await axios.get('/api/crops/masters');
        setMasters(res.data);
      } catch (err) {
        const mockMasters = [
          { id: 'b30353c5-f761-460d-8521-4ea78e4726e6', name: 'Cotton (Kapus / कपास)' },
          { id: 'd14467d0-1c09-411a-85ba-c189ef7dc6bb', name: 'Soybean (सोयाबीन)' },
          { id: 'f99617d1-e63d-4c8d-8fe0-cbb1fa0d7ff3', name: 'Wheat (Gahu / गेहूं)' }
        ];
        setMasters(mockMasters);
      }
    };
    fetchMasters();
  }, []);

  const getVarietySuggestions = () => {
    if (!form.cropMasterId) return [];
    const selectedCrop = masters.find(m => m.id === form.cropMasterId);
    if (!selectedCrop) return [];

    const trans = cropTranslations[selectedCrop.name]?.[i18n.language as 'mr' | 'hi'];
    const rawVarieties = trans?.varieties || selectedCrop.varieties || '';

    if (!rawVarieties) return [];
    return rawVarieties
      .split(/,\s*(?![^()]*\))/)
      .map((v: string) => v.trim())
      .filter(Boolean);
  };

  const suggestions = getVarietySuggestions();
  const filteredSuggestions = suggestions.filter((v: string) =>
    v.toLowerCase().includes(form.variety.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(i18n.language === 'mr' ? 'फाईल ५ एमबी पेक्षा लहान असावी.' : 'File size must be under 5MB');
      return;
    }

    setSoilReportFile(file);
    setSoilReportMime(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setSoilReportBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.success(i18n.language === 'mr' ? 'अहवाल जोडला गेला!' : 'Report attached successfully!');
  };

  const handleRemoveFile = () => {
    setSoilReportFile(null);
    setSoilReportBase64(null);
    setSoilReportMime(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cropMasterId) {
      toast.error(i18n.language === 'mr' ? 'कृपया पिकाचा प्रकार निवडा' : 'Please select a crop type');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/crops', {
        cropMasterId: form.cropMasterId,
        sowingDate: form.sowingDate,
        area: form.area ? parseFloat(form.area) : undefined,
        variety: form.variety || undefined,
        farmingType: form.farmingType,
        soilType: form.soilType,
        soilReport: soilReportBase64 || undefined,
        soilReportMime: soilReportMime || undefined
      });
      toast.success(i18n.language === 'mr' ? 'पिकाची नोंदणी यशस्वीरित्या पूर्ण झाली!' : 'Crop registered successfully!');
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

  const soilTypes = [
    { id: 'black', mr: 'काळी माती', hi: 'काली मिट्टी', en: 'Black Soil', desc: 'Regur Clayey', color: 'bg-stone-800' },
    { id: 'red', mr: 'तांबडी माती', hi: 'लाल मिट्टी', en: 'Red Soil', desc: 'Sandy/Loam', color: 'bg-red-700' },
    { id: 'murmad', mr: 'मुरमाड माती', hi: 'मुरम मिट्टी', en: 'Sandy/Gravel', desc: 'Rocky/Dry', color: 'bg-amber-600' },
    { id: 'clayey', mr: 'गाळाची माती', hi: 'जलोढ़ मिट्टी', en: 'Clayey Soil', desc: 'High Moisture', color: 'bg-amber-800' },
    { id: 'loamy', mr: 'दुमट माती', hi: 'दुमट मिट्टी', en: 'Loamy Soil', desc: 'Balanced Nutrients', color: 'bg-amber-950' }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F2] dark:bg-slate-950 pb-16">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-10">
        
        {/* Back Link */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {i18n.language === 'mr' ? 'डॅशबोर्डवर परत जा' : i18n.language === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}
        </Link>

        {/* Premium form card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden text-left">
          
          {/* Green Hero Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-600 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-2">
              <Sprout className="w-8 h-8 text-emerald-300 animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                {i18n.language === 'mr' ? 'नवीन पिकाची नोंदणी' : i18n.language === 'hi' ? 'नई फसल का पंजीकरण' : 'Register New Crop'}
              </h2>
            </div>
            <p className="text-emerald-100 text-sm max-w-lg leading-relaxed font-medium">
              {i18n.language === 'mr' 
                ? 'तुमच्या पिकाची माहिती देऊन कृषी सल्ला आणि AI च्या मदतीने माती परीक्षण अहवालानुसार खत आणि फवारणीचे वेळापत्रक मिळवा.' 
                : i18n.language === 'hi' 
                ? 'अपनी फसल का विवरण देकर कृषि सलाह और AI की मदद से मिट्टी परीक्षण रिपोर्ट के अनुसार उर्वरक और छिड़काव की योजना प्राप्त करें।' 
                : 'Provide sowing details to start getting automated updates on stages, fertilizer applications, and soil-specific guidance.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* 1. Crop Selection */}
            <div className="relative">
              <label className="block text-sm font-black text-gray-800 dark:text-slate-250 mb-2">
                {t('selectCrop')} <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder={i18n.language === 'mr' ? 'पीक शोधण्यासाठी टाईप करा (उदा. सोयाबीन, कापूस)...' : i18n.language === 'hi' ? 'फसल खोजने के लिए टाइप करें...' : 'Type to search crop...'}
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setIsOpen(true);
                    const matched = masters.find(m => m.name.toLowerCase() === e.target.value.toLowerCase());
                    if (matched) {
                      setForm(f => ({ ...f, cropMasterId: matched.id }));
                    } else {
                      setForm(f => ({ ...f, cropMasterId: '' }));
                    }
                  }}
                  onFocus={() => setIsOpen(true)}
                  onBlur={() => {
                    setTimeout(() => setIsOpen(false), 200);
                  }}
                  className="block w-full pl-11 pr-10 py-3.5 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-primary focus:border-primary focus:outline-none bg-white dark:bg-slate-900 font-bold text-gray-900 dark:text-white"
                />
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-5 h-5" />
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {isOpen && (
                <div className="absolute z-30 w-full mt-1 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
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
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-bold text-gray-800 dark:text-slate-200 ${
                          form.cropMasterId === m.id ? 'bg-primary/5 text-primary border-l-4 border-primary' : ''
                        }`}
                      >
                        {m.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3.5 text-sm text-gray-550">
                      {i18n.language === 'mr' ? 'जुळणारे पीक आढळले नाही' : i18n.language === 'hi' ? 'कोई मेल खाती फसल नहीं मिली' : 'No matching crops found'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Sowing Date & Farming Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-black text-gray-800 dark:text-slate-250 mb-2">
                  {t('sowingDate')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={form.sowingDate}
                  onChange={e => setForm({ ...form, sowingDate: e.target.value })}
                  className="block w-full px-4 py-3.5 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-primary focus:border-primary focus:outline-none bg-white dark:bg-slate-900 font-bold text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-gray-800 dark:text-slate-250 mb-2">
                  {i18n.language === 'mr' ? 'शेतीचा प्रकार' : i18n.language === 'hi' ? 'खेती का प्रकार' : 'Farming Type'} <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.farmingType}
                  onChange={e => setForm({ ...form, farmingType: e.target.value })}
                  className="block w-full px-4 py-3.5 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-primary focus:border-primary focus:outline-none bg-white dark:bg-slate-900 font-bold text-gray-900 dark:text-white"
                >
                  <option value="irrigated">{i18n.language === 'mr' ? 'बागायती (Irrigated)' : i18n.language === 'hi' ? 'सिंचित (Irrigated)' : 'Irrigated'}</option>
                  <option value="rainfed">{i18n.language === 'mr' ? 'जिरायती/कोरडवाहू (Rainfed)' : i18n.language === 'hi' ? 'वर्षा आधारित (Rainfed)' : 'Rainfed'}</option>
                </select>
              </div>
            </div>

            {/* 3. Area & Variety */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-black text-gray-800 dark:text-slate-250 mb-2">
                  {t('area')} ({i18n.language === 'mr' ? 'एकरमध्ये' : 'Acres'}) <span className="text-gray-400 font-normal">({i18n.language === 'mr' ? 'पर्यायी' : 'Optional'})</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.area}
                  onChange={e => setForm({ ...form, area: e.target.value })}
                  placeholder="e.g. 2.5"
                  className="block w-full px-4 py-3.5 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-primary focus:border-primary focus:outline-none bg-white dark:bg-slate-900 font-bold text-gray-900 dark:text-white"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-black text-gray-800 dark:text-slate-250 mb-2">
                  {t('variety')} <span className="text-gray-400 font-normal">({i18n.language === 'mr' ? 'पर्यायी' : 'Optional'})</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.variety}
                    onChange={e => setForm({ ...form, variety: e.target.value })}
                    onFocus={() => setIsVarietyOpen(true)}
                    onBlur={() => {
                      setTimeout(() => setIsVarietyOpen(false), 200);
                    }}
                    placeholder="e.g. Bt Cotton"
                    className="block w-full pr-10 pl-4 py-3.5 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-primary focus:border-primary focus:outline-none bg-white dark:bg-slate-900 font-bold text-gray-900 dark:text-white"
                  />
                  {suggestions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsVarietyOpen(!isVarietyOpen)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  )}
                  
                  {isVarietyOpen && filteredSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl shadow-xl max-h-60 overflow-y-auto">
                      {filteredSuggestions.map((v: string, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={() => {
                            setForm(f => ({ ...f, variety: v }));
                            setIsVarietyOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-bold text-gray-800 dark:text-slate-200 ${
                            form.variety === v ? 'bg-primary/5 text-primary border-l-4 border-primary' : ''
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Soil Type Grid Selector */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <label className="block text-sm font-black text-gray-800 dark:text-slate-250 mb-3 flex items-center gap-1">
                {i18n.language === 'mr' ? 'मातीचा प्रकार' : i18n.language === 'hi' ? 'मिट्टी का प्रकार' : 'Soil Type'}
                <span className="text-xs text-gray-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {i18n.language === 'mr' ? 'मार्गदर्शन' : 'Recommendation context'}
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {soilTypes.map(soil => (
                  <button
                    key={soil.id}
                    type="button"
                    onClick={() => setForm({ ...form, soilType: soil.id })}
                    className={`p-3 rounded-2xl border flex flex-col items-center text-center justify-between transition-all select-none hover:shadow ${
                      form.soilType === soil.id
                        ? 'border-primary bg-primary/5 text-primary scale-105 shadow-sm ring-2 ring-primary/10'
                        : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${soil.color} border-2 border-white dark:border-slate-850 shadow-sm mb-2`} />
                    <span className="font-extrabold text-xs">
                      {i18n.language === 'mr' ? soil.mr : i18n.language === 'hi' ? soil.hi : soil.en}
                    </span>
                    <span className="text-[9px] text-gray-450 mt-1">{soil.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Soil Test Report File Upload */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <label className="block text-sm font-black text-gray-800 dark:text-slate-250 mb-2">
                {i18n.language === 'mr' ? 'माती परीक्षण अहवाल जोडा' : i18n.language === 'hi' ? 'मिट्टी परीक्षण रिपोर्ट जोड़ें' : 'Attach Soil Test Report'} 
                <span className="text-gray-400 font-normal"> ({i18n.language === 'mr' ? 'पर्यायी' : 'Optional'})</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 leading-relaxed">
                {i18n.language === 'mr' 
                  ? 'अहवाल जोडल्यास आमचे AI त्याचे विश्लेषण करून थेट नत्र, स्फुरद, पालाश प्रमाणानुसार खताचे वेळापत्रक तयार करेल.' 
                  : i18n.language === 'hi'
                  ? 'रिपोर्ट जोड़ने पर हमारा AI इसका विश्लेषण करके यूरिया, डीएपी आदि की खुराक की योजना बनाएगा।'
                  : 'Uploading a report allows Gemini AI to scan nutrient deficiencies and customize schedule dosages automatically.'}
              </p>

              {!soilReportFile ? (
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-850 hover:border-primary dark:hover:border-primary/50 transition-colors rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/40 text-center flex flex-col items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-gray-700 dark:text-slate-300">
                    {i18n.language === 'mr' ? 'अहवाल अपलोड करण्यासाठी येथे क्लिक करा' : i18n.language === 'hi' ? 'रिपोर्ट अपलोड करने के लिए यहाँ क्लिक करें' : 'Click here to upload your report'}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, JPEG, PDF (Max 5MB)</p>
                </div>
              ) : (
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 text-xs">
                      <p className="font-extrabold text-gray-800 dark:text-slate-200 truncate">{soilReportFile.name}</p>
                      <p className="text-gray-400 mt-0.5 font-bold">{(soilReportFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-colors"
                    title={i18n.language === 'mr' ? 'अहवाल काढा' : 'Remove File'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-emerald-600 text-white font-extrabold py-4 rounded-2xl transition-all shadow-md shadow-primary/25 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>
                    {i18n.language === 'mr' ? 'अहवाल स्कॅन करून पीक नोंदणी होत आहे...' : i18n.language === 'hi' ? 'रिपोर्ट स्कैन करके पंजीकरण हो रहा है...' : 'Scanning report & registering...'}
                  </span>
                </>
              ) : (
                <span>
                  {i18n.language === 'mr' ? 'पीक नोंदणी करा' : i18n.language === 'hi' ? 'फसल पंजीकृत करें' : 'Register Crop'}
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
