import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Activity, Calendar, Droplets, ShieldAlert, Sparkles, Sprout, ChevronDown } from 'lucide-react';

import { cropTranslations } from '../constants/cropTranslations';

const translateStageName = (stageName: string, lang: string) => {
  if (!stageName) return '';
  if (lang !== 'mr' && lang !== 'hi') return stageName;

  const dictionary: Record<string, Record<string, string>> = {
    'sowing': { mr: 'पेरणी', hi: 'बुवाई' },
    'vegetative': { mr: 'शाकीय वाढ अवस्था', hi: 'वानस्पतिक वृद्धि चरण' },
    'flowering': { mr: 'फूल धारणा अवस्था', hi: 'फूल आने का चरण' },
    'pod formation': { mr: 'शेंगा भरणे अवस्था', hi: 'फली निर्माण चरण' },
    'maturity': { mr: 'परिपक्वता अवस्था', hi: 'परिपक्वता चरण' },
    'harvest': { mr: 'काढणी', hi: 'कटाई' },
    'active': { mr: 'सक्रिय', hi: 'सक्रिय' }
  };

  const lower = stageName.toLowerCase().trim();
  for (const [key, trans] of Object.entries(dictionary)) {
    if (lower.includes(key)) {
      return trans[lang];
    }
  }

  return stageName;
};

const translateGuideAndText = (text: string, lang: string) => {
  if (!text) return '';
  if (lang !== 'mr' && lang !== 'hi') return text;

  let translated = text;

  if (lang === 'mr') {
    translated = translated
      .replace('Deep ploughing in summer', 'उन्हाळ्यात खोल नांगरणी')
      .replace('Spacing of 90x60 cm or 120x60 cm', '९०x६० सेमी किंवा १२०x६० सेमी अंतर')
      .replace('Pre-sowing seed treatment with Imidacloprid (7g/kg) to protect against early sucking pests', 'सुरुवातीच्या रसशोषक किडींपासून संरक्षणासाठी इमिडाक्लोप्रिड (७ ग्रॅम/किलो) सह पेरणीपूर्व बीजप्रक्रिया')
      .replace('First spray at 25-30 days after sowing', 'पेरणीनंतर २५-३० दिवसांनी पहिली फवारणी')
      
      .replace('Ploughing followed by 2 harrowings', 'नांगरणी आणि त्यानंतर २ वेळा कुळवणी')
      .replace('Spacing of 45x15 cm', '४५x१५ सेमी अंतर')
      .replace('Sowing depth of 3-5 cm', '३-५ सेमी खोलीवर पेरणी')
      .replace('Seed treatment with Carboxin + Thiram (2g/kg) and Rhizobium culture', 'कार्बोक्सिन + थायरम (२ ग्रॅम/किलो) आणि रायझोबियम कल्चरसह बीजप्रक्रिया')
      .replace('First spray at 20 days after sowing', 'पेरणीनंतर २० दिवसांनी पहिली फवारणी')
      
      .replace('Fine seedbed preparation by 2-3 harrowings', '२-३ वेळा कुळवणी करून जमीन भुसभुशीत करणे')
      .replace('Sowing at spacing of 22.5 cm in lines', '२२.५ सेमी अंतरावर ओळीत पेरणी')
      .replace('Pre-irrigation required before sowing', 'पेरणीपूर्वी जमीन ओलवून घेणे आवश्यक')
      .replace('Seed treatment with Vitavax (2g/kg)', 'विटावॅक्स (२ ग्रॅम/किलो) सह बीजप्रक्रिया')
      .replace('First spray or weeding at 21 days', '२१ दिवसांनी पहिली फवारणी किंवा खुरपणी')
      
      .replace('Puddling of soil is critical', 'जमिनीची चिखलणी करणे अत्यंत महत्त्वाचे आहे')
      .replace('Sowing in nursery beds, then transplanting 21-25 days old seedlings into the main field with 20x15 cm spacing', 'रोपवाटिकेमध्ये पेरणी करणे, नंतर २१-२५ दिवसांची रोपे २०x१५ सेमी अंतरावर मुख्य शेतात लावणी करणे')
      .replace('Keep 2-5 cm of water level in the field', 'शेतात २-५ सेमी पाण्याची पातळी राखा')
      .replace('First spray at nursery stage', 'रोपवाटिका अवस्थेत पहिली फवारणी')
      
      .replace('Deep ploughing up to 30 cm', '३० सेमी पर्यंत खोल नांगरणी')
      .replace('Ridge and furrow method at 120 cm spacing', '१२० सेमी अंतरावर सरी-वरंबा पद्धत')
      .replace('Setts treatment with Carbendazim (0.1%) and Malathion (0.1%) for 15 mins before planting', 'लागवडीपूर्वी १५ मिनिटे कार्बेन्डाझिम (०.१%) आणि मॅलेथिऑन (०.१%) सह बेणे प्रक्रिया')
      .replace('First earthing up at 4 months', '४ महिन्यांनी पहिली बाळभरणी करणे')
      
      .replace('Grows best in deep, well-drained loamy soils', 'खोल, चांगला निचरा होणाऱ्या लोमी जमिनीत उत्तम वाढते')
      .replace('Spacing 90x20 cm or 120x30 cm', '९०x२० सेमी किंवा १२०x३० सेमी अंतर')
      .replace('Seed treatment with Trichoderma (5g/kg) and Rhizobium', 'ट्रायकोडर्मा (५ ग्रॅम/किलो) आणि रायझोबियमसह बीजप्रक्रिया')
      .replace('Intercropping with Soybean (1:2 ratio) is highly recommended', 'सोयाबीनसोबत आंतरपीक (१:२ प्रमाण) घेण्याची शिफारस केली जाते')
      
      .replace('Sow in residual soil moisture after Kharif harvest', 'खरीप काढणीनंतर जमिनीतील उर्वरित ओलाव्यावर पेरणी करावी')
      .replace('Spacing 30x10 cm', '३०x१० सेमी अंतर')
      .replace('Seed treatment with Trichoderma (5g/kg) and Ammonium Molybdate', 'ट्रायकोडर्मा (५ ग्रॅम/किलो) आणि अमोनियम मॉलिब्डेटसह बीजप्रक्रिया')
      .replace('Nipping of terminal buds at 30-35 days to promote branching', 'फांद्या वाढवण्यासाठी ३०-३५ दिवसांनी पिकाचा शेंडा खुडणे')
      
      .replace('Sandy loam soils are ideal', 'वालुकामय लोम जमीन आदर्श आहे')
      .replace('Seed treatment with Trichoderma (4g/kg)', 'ट्रायकोडर्मा (४ ग्रॅम/किलो) सह बीजप्रक्रिया')
      .replace('Apply Gypsum (200kg/acre) at flowering stage (40-45 days after sowing) to ensure proper pod development', 'शेंगांच्या योग्य विकासासाठी फूल धारणा अवस्थेत (पेरणीनंतर ४०-४५ दिवसांनी) जिप्सम (२०० किलो/एकर) टाकावे')
      
      .replace('Raise seedlings in nursery beds for 40-45 days', 'रोपवाटिकेत ४०-४५ दिवस रोपे तयार करावीत')
      .replace('Transplant in ridges/furrows at 15x10 cm spacing', 'सरी-वरंब्यावर १५x१० सेमी अंतरावर लावणी करावी')
      .replace('Requires light, well-drained soils', 'हलकी, पाण्याचा निचरा होणारी जमीन लागते')
      .replace('First weeding and light irrigation at 15 days post transplant', 'पुनर्लागवडीनंतर १५ दिवसांनी पहिली खुरपणी आणि हलके पाणी द्यावे')
      
      .replace('Raise nursery for 30 days', '३० दिवस रोपवाटिका तयार करा')
      .replace('Transplant at 60x45 cm spacing', '६०x४५ सेमी अंतरावर पुनर्लागवड करावी')
      .replace('Staking with bamboo poles is necessary at 30-35 days to support heavy fruiting', 'फळांच्या वजनामुळे झाडे पडू नयेत म्हणून ३०-३५ दिवसांनी बांबूच्या काठ्यांचा आधार देणे गरजेचे आहे')
      .replace('Drip irrigation and mulching sheets are highly recommended', 'ठिबक सिंचन आणि मल्चिंग पेपर वापरण्याची शिफारस केली जाते')
      
      .replace('Deep ploughing followed by harrowing', 'खोल नांगरणी आणि त्यानंतर कुळवणी')
      .replace('Spacing 60x20 cm', '६०x२० सेमी अंतर')
      .replace('Sow seeds at 5 cm depth', '५ सेमी खोलीवर बियाणे पेरावे')
      .replace('Seed treatment with Metalaxyl (4g/kg) against downy mildew', 'केवडा रोगाच्या प्रतिबंधासाठी मेटलॅक्सिल (४ ग्रॅम/किलो) सह बीजप्रक्रिया')
      .replace('First earthing up at 30 days', '३० दिवसांनी पहिली भरणी करणे')
      
      .replace('Requires light sandy loam soil', 'हलकी वालुकामय लोम जमीन लागते')
      .replace('Spacing 45x15 cm', '४५x१५ सेमी अंतर')
      .replace('Sowing depth of 2-3 cm', '२-३ सेमी खोलीवर पेरणी')
      .replace('Thrives in low moisture', 'कमी पाण्यातही चांगले उत्पादन येते')
      .replace('First inter-culturing and thinning at 15-20 days after sowing', 'पेरणीनंतर १५-२० दिवसांनी विरळणी आणि कोळपणी करावी')
      
      .replace('Sowing in well-drained clayey soils', 'उत्तम निचरा होणाऱ्या चिकणमातीत पेरणी')
      .replace('Seed treatment with Sulfur (3g/kg) for grain smut prevention', 'काणी रोगाच्या प्रतिबंधासाठी गंधक (३ ग्रॅम/किलो) सह बीजप्रक्रिया')
      .replace('First weeding and inter-culturing at 25-30 days', '२५-३० दिवसांनी पहिली खुरपणी आणि कोळपणी करावी')
      
      .replace('Requires training on Y-trellis or Bower system', 'वाय-ट्रेलीस किंवा मंडप पद्धतीवर वेली चढवणे आवश्यक')
      .replace('Spacing 3x1.8 meters', '३x१.८ मीटर अंतर')
      .replace('Pruning twice a year: Foundation pruning in April and Fruit pruning in October', 'वर्षातून दोनदा छाटणी: एप्रिलमध्ये खरड छाटणी आणि ऑक्टोबरमध्ये गोड छाटणी')
      .replace('Keep canopy open for sunlight', 'सूर्यप्रकाशासाठी झाडाची सावली मोकळी ठेवावी')
      
      .replace('Spacing of 4.5 x 3 meters', '४.५ x ३ मीटर अंतर')
      .replace('Sowing in pits of 60x60x60 cm', '६०x६०x६० सेमी आकाराच्या खड्ड्यात लागवड')
      .replace('Bahar management (Ambe/Mrig/Hasta bahar selection) based on water availability', 'पाण्याच्या उपलब्धतेनुसार बहार व्यवस्थापन करावे')
      .replace('Pruning after harvest is necessary', 'काढणीनंतर फांद्यांची छाटणी करणे गरजेचे आहे')
      
      .replace('Planting spacing of 10x10 meters (or 5x5 meters for high density)', '१०x१० मीटर अंतर (किंवा सघन लागवडीसाठी ५x५ मीटर)')
      .replace('Pit size of 1x1x1 meter filled with organic manure and bone meal', '१x१x१ मीटर आकाराचा खड्डा सेंद्रिय खत आणि बोन मीलने भरावा')
      .replace('Regular basin cleanings and mulching during dry seasons', 'कोरड्या हंगामात नियमित आळे साफ करणे आणि आच्छादन करणे')
      
      .replace('Spacing of 1.8x1.8 meters', '१.८x१.८ मीटर अंतर')
      .replace('Plant tissue culture plantlets in pits', 'खड्ड्यांमध्ये उती संवर्धन रोपे लावावीत')
      .replace('High requirements of Nitrogen and Potassium', 'नायट्रोजन आणि पोटॅशियमची जास्त गरज')
      .replace('Provide windbreak trees on borders', 'सीमांवर वारा रोखणारी झाडे लावावीत')
      .replace('Earthing up at 3-4 months to support stem', 'खोडाला आधार देण्यासाठी ३-४ महिन्यांनी मातीची भर द्यावी')
      
      .replace('Broad bed furrow (BBF) method is best', 'रुंद वरंबा सरी (BBF) पद्धत सर्वोत्तम आहे')
      .replace('Spacing of 30x15 cm on raised beds', 'गादीवाफ्यावर ३०x१५ सेमी अंतर')
      .replace('Mother rhizome sowing is preferred', 'मातृकंद लावण्यास प्राधान्य द्यावे')
      .replace('Mulching with leaves right after planting to retain moisture', 'लागवडीनंतर ओलावा टिकवून ठेवण्यासाठी पानांचे आच्छादन करावे')
      
      .replace('Grows best in partial shade', 'अंशतः सावलीत उत्तम वाढते')
      .replace('Sowing on raised beds of 15 cm height at 30x20 cm spacing', '१५ सेमी उंचीच्या गादीवाफ्यावर ३०x२० सेमी अंतरावर लागवड')
      .replace('Excellent drainage is essential to prevent rhizome rot', 'कंद सडणे टाळण्यासाठी पाण्याचा उत्कृष्ट निचरा असणे आवश्यक आहे')
      .replace('Organic mulching at sowing, 45, and 90 days', 'लागवडीच्या वेळी, ४५ व्या आणि ९० व्या दिवशी सेंद्रिय आच्छादन करावे')
      
      .replace('Transplant 30-35 days old seedlings', '३०-३५ दिवसांची रोपे पुनर्लागवड करावीत')
      .replace('Spacing 60x45 cm', '६०x४५ सेमी अंतर')
      .replace('Requires high potassium and calcium to prevent blossom end rot', 'फळ कुजणे रोखण्यासाठी जास्त पोटॅशियम आणि कॅल्शियमची आवश्यकता असते')
      .replace('Disease preventive sprays starting at 15 days post transplant', 'पुनर्लागवडीनंतर १५ दिवसांपासून रोग प्रतिबंधक फवारण्या सुरू कराव्यात');
  }

  return translated;
};

export const CropDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();

  const [crop, setCrop] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'master_chart' | 'ai_schedule' | 'fertilizer' | 'spray' | 'irrigation' | 'pests' | 'diseases'>('master_chart');

  // Edit Crop fields state
  const [isEditing, setIsEditing] = useState(false);
  const [isVarietyOpen, setIsVarietyOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    sowingDate: '',
    area: '',
    variety: '',
    farmingType: 'irrigated',
    status: 'active'
  });

  const getVarietySuggestions = () => {
    if (!crop || !crop.crop_master) return [];
    const trans = cropTranslations[crop.crop_master.name]?.[i18n.language as 'mr' | 'hi'];
    const rawVarieties = trans?.varieties || crop.crop_master.varieties || '';

    if (!rawVarieties) return [];
    return rawVarieties
      .split(/,\s*(?![^()]*\))/)
      .map((v: string) => v.trim())
      .filter(Boolean);
  };

  const suggestions = getVarietySuggestions();
  const filteredSuggestions = suggestions.filter((v: string) =>
    v.toLowerCase().includes(editForm.variety.toLowerCase())
  );

  const handleEditClick = () => {
    if (!crop) return;
    setEditForm({
      sowingDate: crop.sowing_date,
      area: crop.area || '',
      variety: crop.variety || '',
      farmingType: crop.farming_type || 'irrigated',
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
        farmingType: editForm.farmingType,
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

  const trans = cropTranslations[crop.crop_master.name]?.[i18n.language as 'mr' | 'hi'];
  const description = trans?.description || crop.crop_master.description;
  const varieties = trans?.varieties || crop.crop_master.varieties;
  const seedBrands = trans?.seedBrands || recommendations.seedBrands;
  const category = trans?.category || crop.crop_master.category;
  const expectedYield = trans?.expectedYield || crop.crop_master.expected_yield;
  const cultivationGuide = translateGuideAndText(recommendations.cultivationGuide, i18n.language);

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
              <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-2 items-center">
                <span>{i18n.language === 'mr' ? 'पेरणीची तारीख' : i18n.language === 'hi' ? 'बुवाई की तारीख' : 'Sown on'}: {crop.sowing_date}</span>
                <span>•</span>
                <span>{crop.area ? `${crop.area} ${i18n.language === 'mr' ? 'एकर' : i18n.language === 'hi' ? 'एकड़' : 'Acres'}` : (i18n.language === 'mr' ? 'क्षेत्रफळ निर्दिष्ट नाही' : i18n.language === 'hi' ? 'कोई क्षेत्र निर्दिष्ट नहीं' : 'No area specified')}</span>
                <span>•</span>
                <span className="font-semibold text-primary">{crop.farming_type === 'rainfed' ? (i18n.language === 'mr' ? 'जिरायती/कोरडवाहू' : i18n.language === 'hi' ? 'वर्षा आधारित' : 'Rainfed') : (i18n.language === 'mr' ? 'बागायती' : i18n.language === 'hi' ? 'सिंचित' : 'Irrigated')}</span>
              </div>
              <button 
                onClick={handleEditClick}
                className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-lg mt-2 hover:bg-primary/20 transition-all flex items-center gap-1.5"
              >
                ✏️ {i18n.language === 'mr' ? 'तपशील बदला' : i18n.language === 'hi' ? 'विवरण बदलें' : 'Edit Details'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50 text-center">
              <span className="block text-xs font-bold text-gray-400 uppercase">{t('cropAge')}</span>
              <span className="text-lg font-black text-primary mt-1 block">{recommendations.daysSinceSowing} {t('days')}</span>
            </div>
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50 text-center">
              <span className="block text-xs font-bold text-gray-400 uppercase">{t('expectedHarvest')}</span>
              <span className="text-sm font-black text-primary mt-1 block">{recommendations.harvestDate}</span>
            </div>
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50 text-center col-span-2 sm:col-span-1">
              <span className="block text-xs font-bold text-gray-400 uppercase">{t('currentStage')}</span>
              <span className="text-xs font-black text-primary mt-1 block truncate">
                {translateStageName(recommendations.currentStage?.stageName || 'Sowing', i18n.language)}
              </span>
            </div>
          </div>
        </div>

        {/* Crop Information Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            ℹ️ {i18n.language === 'mr' ? 'पिकाची माहिती आणि मशागत मार्गदर्शिका' : i18n.language === 'hi' ? 'फसल की जानकारी और जुताई गाइड' : 'Crop Information & Cultivation Guide'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-800 block mb-1">{i18n.language === 'mr' ? 'वर्णन' : i18n.language === 'hi' ? 'विवरण' : 'Description'}:</span>
                {description || (i18n.language === 'mr' ? 'माहिती उपलब्ध नाही.' : i18n.language === 'hi' ? 'विवरण उपलब्ध नहीं है।' : 'No description available.')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-800 block mb-1">{i18n.language === 'mr' ? 'लागवड व मशागत मार्गदर्शिका' : i18n.language === 'hi' ? 'जुताई व खेती गाइड' : 'Cultivation Guide'}:</span>
                {cultivationGuide || (i18n.language === 'mr' ? 'सामान्य मशागत पद्धती सुचवल्या आहेत.' : i18n.language === 'hi' ? 'सामान्य कृषि पद्धतियां अनुशंसित हैं।' : 'General tillage practices recommended.')}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-bold text-gray-800 block">{i18n.language === 'mr' ? 'शिफारस केलेल्या जाती' : i18n.language === 'hi' ? 'अनुशंसित किस्में' : 'Recommended Varieties'}:</span>
                <span className="text-primary font-semibold block mt-1">{varieties || (i18n.language === 'mr' ? 'उपलब्ध नाही' : i18n.language === 'hi' ? 'उपलब्ध नहीं' : 'N/A')}</span>
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-gray-800 block">{i18n.language === 'mr' ? 'प्रमुख बियाणे कंपन्या व ब्रँड्स' : i18n.language === 'hi' ? 'प्रमुख बीज कंपनियां और ब्रांड' : 'Top Seed Companies & Brands'}:</span>
                <span className="text-gray-750 font-semibold block mt-1">{seedBrands || (i18n.language === 'mr' ? 'उपलब्ध नाही' : i18n.language === 'hi' ? 'उपलब्ध नहीं' : 'N/A')}</span>
              </p>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">{i18n.language === 'mr' ? 'वर्ग' : i18n.language === 'hi' ? 'श्रेणी' : 'Category'}</span>
                  <span className="text-gray-700 font-bold">{category}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">{i18n.language === 'mr' ? 'अपेक्षित उत्पन्न' : i18n.language === 'hi' ? 'अपेक्षित उपज' : 'Expected Yield'}</span>
                  <span className="text-gray-700 font-bold">{expectedYield}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar timeline */}
        {recommendations.currentStage && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> {i18n.language === 'mr' ? 'चालू टप्प्याची प्रगती' : i18n.language === 'hi' ? 'वर्तमान चरण की प्रगति' : 'Active Stage Progress'}
            </h3>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (recommendations.daysSinceSowing / crop.crop_master.duration_days) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500 font-semibold">
              <span>{i18n.language === 'mr' ? 'पेरणी (दिवस ०)' : i18n.language === 'hi' ? 'बुवाई (दिन 0)' : 'Sowing (Day 0)'}</span>
              <span>{translateStageName(recommendations.currentStage.stageName, i18n.language)}</span>
              <span>{i18n.language === 'mr' ? `काढणी (दिवस ${crop.crop_master.duration_days})` : i18n.language === 'hi' ? `कटाई (दिन ${crop.crop_master.duration_days})` : `Harvest (Day ${crop.crop_master.duration_days})`}</span>
            </div>
          </div>
        )}

        {/* Tabs and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation tab links */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-1">
            {[
              { id: 'master_chart', label: i18n.language === 'mr' ? 'संपूर्ण वेळापत्रक' : i18n.language === 'hi' ? 'संपूर्ण अनुसूची' : 'Master Chart', icon: Calendar },
              { id: 'ai_schedule', label: i18n.language === 'mr' ? 'AI स्मार्ट वेळापत्रक' : i18n.language === 'hi' ? 'AI स्मार्ट अनुसूची' : 'AI Smart Schedule', icon: Sparkles },
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
            {activeTab === 'master_chart' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{i18n.language === 'mr' ? 'संपूर्ण पीक वेळापत्रक' : i18n.language === 'hi' ? 'संपूर्ण फसल अनुसूची' : 'Master Crop Timeline'}</h3>
                </div>
                
                {/* Summary Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
                    <span className="block text-2xl font-black text-primary">{recommendations.allFertilizers?.length || 0}</span>
                    <span className="text-xs font-bold text-gray-600 uppercase mt-1">{i18n.language === 'mr' ? 'एकूण खत वेळा' : i18n.language === 'hi' ? 'कुल उर्वरक समय' : 'Fertilizer Times'}</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                    <span className="block text-2xl font-black text-amber-600">{recommendations.allSprays?.length || 0}</span>
                    <span className="text-xs font-bold text-gray-600 uppercase mt-1">{i18n.language === 'mr' ? 'एकूण फवारणी' : i18n.language === 'hi' ? 'कुल छिड़काव' : 'Spray Times'}</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                    <span className="block text-2xl font-black text-blue-600">{recommendations.allIrrigation?.length || 0}</span>
                    <span className="text-xs font-bold text-gray-600 uppercase mt-1">{i18n.language === 'mr' ? 'एकूण पाणी' : i18n.language === 'hi' ? 'कुल सिंचाई' : 'Watering Times'}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {recommendations.allStages?.map((stage: any, index: number) => {
                    const stageFerts = recommendations.allFertilizers?.filter((f: any) => f.stage_id === stage.id || f.stage_id === stage.stageId) || [];
                    const stageSprays = recommendations.allSprays?.filter((s: any) => s.stage_id === stage.id || s.stage_id === stage.stageId) || [];
                    const stageIrr = recommendations.allIrrigation?.filter((i: any) => i.stage_id === stage.id || i.stage_id === stage.stageId) || [];

                    return (
                      <div key={stage.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-100 text-green-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 font-bold">
                          {index + 1}
                        </div>
                        {/* Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
                            <h4 className="font-bold text-gray-900 text-base">{translateStageName(stage.stage_name || stage.stageName, i18n.language)}</h4>
                            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">Day {stage.start_day || stage.startDay}-{stage.end_day || stage.endDay}</span>
                          </div>
                          <div className="space-y-3">
                            {stageIrr.length > 0 && (
                              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                                <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5 mb-1"><Droplets className="w-3.5 h-3.5"/> {i18n.language === 'mr' ? 'पाणी व्यवस्थापन' : 'Irrigation'}</span>
                                {stageIrr.map((i: any) => <p key={i.id} className="text-sm text-gray-700">{i.water_requirement}</p>)}
                              </div>
                            )}
                            {stageFerts.length > 0 && (
                              <div className="bg-green-50/50 p-3 rounded-xl border border-green-100/50">
                                <span className="text-xs font-bold text-green-600 flex items-center gap-1.5 mb-1"><Sparkles className="w-3.5 h-3.5"/> {i18n.language === 'mr' ? 'खत व्यवस्थापन' : 'Fertilizer'}</span>
                                {stageFerts.map((f: any) => (
                                  <div key={f.id} className="mt-1">
                                    <p className="text-sm font-semibold text-gray-800">{f.fertilizer_name}</p>
                                    <p className="text-xs text-gray-500">{f.quantity}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                            {stageSprays.length > 0 && (
                              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                                <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5 mb-1"><Sprout className="w-3.5 h-3.5"/> {i18n.language === 'mr' ? 'फवारणी' : 'Spray'}</span>
                                {stageSprays.map((s: any) => <p key={s.id} className="text-sm text-gray-700">{s.spray_name}</p>)}
                              </div>
                            )}
                            {stageIrr.length === 0 && stageFerts.length === 0 && stageSprays.length === 0 && (
                              <p className="text-sm text-gray-400 italic">No specific activities scheduled for this stage.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            
            {activeTab === 'ai_schedule' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  {i18n.language === 'mr' ? 'AI स्मार्ट कृषी वेळापत्रक आणि मशागत' : 'AI Smart Farming Schedule & Tillage'}
                </h3>
                {!crop.ai_schedule_data ? (
                  <div className="p-8 text-center bg-blue-50/50 rounded-2xl border border-blue-100">
                    <p className="text-blue-800 font-medium">AI schedule is being generated... Check back in a minute!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                       <h4 className="font-bold text-green-800 text-xl mb-4 border-b border-green-200 pb-2">{crop.ai_schedule_data.crop_info?.name}</h4>
                       
                       {crop.ai_schedule_data.crop_info?.pre_sowing_tillage && (
                         <div className="mb-4">
                           <h5 className="font-bold text-green-900 mb-1 flex items-center gap-2"><Sprout className="w-4 h-4"/> पूर्व मशागत (Pre-Sowing Tillage)</h5>
                           <p className="text-gray-700 bg-white p-3 rounded-lg border border-green-100">{crop.ai_schedule_data.crop_info.pre_sowing_tillage}</p>
                         </div>
                       )}
                       
                       {crop.ai_schedule_data.crop_info?.sowing_method && (
                         <div className="mb-4">
                           <h5 className="font-bold text-green-900 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4"/> पेरणी पद्धत (Sowing Method)</h5>
                           <p className="text-gray-700 bg-white p-3 rounded-lg border border-green-100">{crop.ai_schedule_data.crop_info.sowing_method}</p>
                         </div>
                       )}

                       <div className="mt-4">
                         <h5 className="font-bold text-green-900 mb-1">सामान्य सल्ला (General Advice)</h5>
                         <p className="text-gray-700">{crop.ai_schedule_data.crop_info?.general_advice}</p>
                       </div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-gray-800 mt-8 mb-4 border-b pb-2">वाढीचे टप्पे आणि वेळापत्रक (Growth Stages & Schedule)</h4>
                    
                    <div className="space-y-6">
                      {crop.ai_schedule_data.stages?.map((stage: any, index: number) => (
                        <div key={index} className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                            <h5 className="font-extrabold text-gray-900 text-lg text-primary">{stage.stage_name}</h5>
                            <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-xs">Day {stage.start_day} - {stage.end_day}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                              <p className="text-xs font-bold text-blue-800 uppercase mb-1 flex items-center gap-1"><Droplets className="w-3 h-3"/> Water</p>
                              <p className="text-sm text-gray-800">{stage.water_requirement}</p>
                            </div>
                            <div className="bg-green-50/50 p-3 rounded-lg border border-green-100/50">
                              <p className="text-xs font-bold text-green-800 uppercase mb-1">Fertilizer (खत)</p>
                              <p className="text-sm text-gray-800">{stage.fertilizer_advice}</p>
                            </div>
                            <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100/50">
                              <p className="text-xs font-bold text-orange-800 uppercase mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Spray (फवारणी)</p>
                              <p className="text-sm text-gray-800">{stage.spray_advice}</p>
                            </div>
                            {stage.intercultural_operations && (
                              <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100/50">
                                <p className="text-xs font-bold text-purple-800 uppercase mb-1">
                                  {i18n.language === 'mr' ? 'मशागत' : i18n.language === 'hi' ? 'निराई/जुताई' : 'Weeding'}
                                </p>
                                <p className="text-sm text-gray-800">{stage.intercultural_operations}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'fertilizer' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">{i18n.language === 'mr' ? 'खत व्यवस्थापन वेळापत्रक' : i18n.language === 'hi' ? 'उर्वरक प्रबंधन अनुसूची' : 'Complete Fertilizer Schedule'}</h3>
                {(!recommendations.allFertilizers || recommendations.allFertilizers.length === 0) ? (
                  <p className="text-gray-400 text-sm">No fertilizer recommendations required.</p>
                ) : (
                  <div>
                    {recommendations.allStages.map((stage: any) => {
                      const stageFerts = recommendations.allFertilizers.filter((f: any) => f.stage_id === stage.id || f.stage_id === stage.stageId);
                      if (stageFerts.length === 0) return null;
                      return (
                        <div key={stage.id} className="mb-8 last:mb-0">
                          <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
                            {translateStageName(stage.stage_name || stage.stageName, i18n.language)} <span className="text-gray-400 text-sm font-normal ml-2">(Day {stage.start_day || stage.startDay} - {stage.end_day || stage.endDay})</span>
                          </h4>
                          <div className="space-y-4">
                            {stageFerts.map((f: any) => (
                              <div key={f.id} className="p-4 rounded-xl bg-green-50/20 border border-green-100/50">
                                <h4 className="font-extrabold text-gray-900">{f.fertilizer_name}</h4>
                                <p className="text-sm text-gray-600 mt-1">Recommended Quantity: <span className="font-bold text-primary">{f.quantity}</span></p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'spray' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">{i18n.language === 'mr' ? 'फवारणी वेळापत्रक' : i18n.language === 'hi' ? 'छिड़काव अनुसूची' : 'Complete Spray Schedule'}</h3>
                {(!recommendations.allSprays || recommendations.allSprays.length === 0) ? (
                  <p className="text-gray-400 text-sm">No sprays schedules defined.</p>
                ) : (
                  <div>
                    {recommendations.allStages.map((stage: any) => {
                      const stageSprays = recommendations.allSprays.filter((s: any) => s.stage_id === stage.id || s.stage_id === stage.stageId);
                      if (stageSprays.length === 0) return null;
                      return (
                        <div key={stage.id} className="mb-8 last:mb-0">
                          <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
                            {translateStageName(stage.stage_name || stage.stageName, i18n.language)} <span className="text-gray-400 text-sm font-normal ml-2">(Day {stage.start_day || stage.startDay} - {stage.end_day || stage.endDay})</span>
                          </h4>
                          <div className="space-y-4">
                            {stageSprays.map((s: any) => (
                              <div key={s.id} className="p-4 rounded-xl bg-green-50/20 border border-green-100/50">
                                <h4 className="font-extrabold text-gray-900">{s.spray_name}</h4>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'irrigation' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">{i18n.language === 'mr' ? 'पाणी व्यवस्थापन वेळापत्रक' : i18n.language === 'hi' ? 'सिंचाई अनुसूची' : 'Complete Irrigation Schedule'}</h3>
                {(!recommendations.allIrrigation || recommendations.allIrrigation.length === 0) ? (
                  <p className="text-gray-400 text-sm">
                    {i18n.language === 'mr' ? 'योग्य पाऊस पुरेसा आहे. कोणतेही अतिरिक्त पाणी वेळापत्रक सक्रिय नाही.' : i18n.language === 'hi' ? 'सामान्य वर्षा पर्याप्त है। कोई अतिरिक्त सिंचाई कार्यक्रम सक्रिय नहीं है।' : 'Standard rainfall suffices. No extra irrigation schedules active.'}
                  </p>
                ) : (
                  <div>
                    {recommendations.allStages.map((stage: any) => {
                      const stageIrr = recommendations.allIrrigation.filter((i: any) => i.stage_id === stage.id || i.stage_id === stage.stageId);
                      if (stageIrr.length === 0) return null;
                      return (
                        <div key={stage.id} className="mb-8 last:mb-0">
                          <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4">
                            {translateStageName(stage.stage_name || stage.stageName, i18n.language)} <span className="text-gray-400 text-sm font-normal ml-2">(Day {stage.start_day || stage.startDay} - {stage.end_day || stage.endDay})</span>
                          </h4>
                          <div className="space-y-4">
                            {stageIrr.map((i: any) => (
                              <div key={i.id} className="p-4 rounded-xl bg-green-50/20 border border-green-100/50">
                                <h4 className="font-extrabold text-gray-900">Water Requirement:</h4>
                                <p className="text-sm text-gray-600 mt-1">{i.water_requirement}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pests' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">
                  {i18n.language === 'mr' ? 'लक्ष ठेवण्यासारख्या किडी' : i18n.language === 'hi' ? 'ध्यान देने योग्य कीट' : 'Pests to watch out for'}
                </h3>
                {recommendations.pests.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    {i18n.language === 'mr' ? 'या पिकासाठी कोणत्याही सामान्य किडींची नोंद नाही.' : i18n.language === 'hi' ? 'इस फसल के लिए कोई सामान्य कीट नहीं बताया गया है।' : 'No common pests reported for this crop type.'}
                  </p>
                ) : (
                  <div className="space-y-6">
                    {recommendations.pests.map((p: any) => (
                      <div key={p.id} className="p-5 rounded-xl border border-red-100 bg-red-50/10">
                        <h4 className="font-extrabold text-red-700 text-lg">{p.name}</h4>
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-bold">{i18n.language === 'mr' ? 'लक्षणे' : i18n.language === 'hi' ? 'लक्षण' : 'Symptoms'}:</span> {p.symptoms}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-bold">{i18n.language === 'mr' ? 'नियंत्रण पद्धत' : i18n.language === 'hi' ? 'नियंत्रण विधि' : 'Control Method'}:</span> {p.control_method}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'diseases' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">
                  {i18n.language === 'mr' ? 'रोगाचा धोका आणि प्रतिबंध' : i18n.language === 'hi' ? 'रोग का खतरा और रोकथाम' : 'Diseases risk & prevention'}
                </h3>
                {recommendations.diseases.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    {i18n.language === 'mr' ? 'या पिकासाठी कोणत्याही सामान्य रोगांची नोंद नाही.' : i18n.language === 'hi' ? 'इस फसल के लिए कोई सामान्य बीमारी नहीं बताई गई है।' : 'No common diseases reported for this crop type.'}
                  </p>
                ) : (
                  <div className="space-y-6">
                    {recommendations.diseases.map((d: any) => (
                      <div key={d.id} className="p-5 rounded-xl border border-red-100 bg-red-50/10">
                        <h4 className="font-extrabold text-red-700 text-lg">{d.name}</h4>
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-bold">{i18n.language === 'mr' ? 'लक्षणे' : i18n.language === 'hi' ? 'लक्षण' : 'Symptoms'}:</span> {d.symptoms}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-bold">{i18n.language === 'mr' ? 'उपचार / उपाय' : i18n.language === 'hi' ? 'उपचार / उपाय' : 'Treatment'}:</span> {d.treatment}
                        </p>
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
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {i18n.language === 'mr' ? 'पीक तपशील सुधारा' : i18n.language === 'hi' ? 'फसल विवरण संशोधित करें' : 'Edit Crop Details'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {i18n.language === 'mr' ? 'नोंदणी केलेल्या पिकाचा तपशील बदला. पेरणीची तारीख बदलल्यास वेळापत्रक पुन्हा मोजले जाईल.' : i18n.language === 'hi' ? 'अपनी पंजीकृत फसल के विवरण को संशोधित करें। बुवाई की तारीख बदलने से चरणों की समयरेखा की पुनर्गणना होगी।' : 'Modify details for your registered crop. Sowing date shifts will recalculate the stages timeline.'}
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                  {i18n.language === 'mr' ? 'पेरणीची तारीख' : i18n.language === 'hi' ? 'बुवाई की तारीख' : 'Sowing Date'}
                </label>
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
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                    {i18n.language === 'mr' ? 'क्षेत्रफळ (एकर)' : i18n.language === 'hi' ? 'क्षेत्रफल (एकड़)' : 'Area (Acres)'}
                  </label>
                  <input 
                    type="number"
                    step="0.1"
                    value={editForm.area}
                    onChange={e => setEditForm({ ...editForm, area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                    {i18n.language === 'mr' ? 'जात / वाण' : i18n.language === 'hi' ? 'किस्म (वैरायटी)' : 'Variety'}
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={editForm.variety}
                      onChange={e => setEditForm({ ...editForm, variety: e.target.value })}
                      onFocus={() => setIsVarietyOpen(true)}
                      onBlur={() => {
                        // Timeout to allow clicking suggestions list items
                        setTimeout(() => setIsVarietyOpen(false), 200);
                      }}
                      className="w-full pr-8 pl-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                    />
                    {suggestions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsVarietyOpen(!isVarietyOpen)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    )}
                    
                    {isVarietyOpen && filteredSuggestions.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-150 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                        {filteredSuggestions.map((v: string, idx: number) => (
                          <button
                            key={idx}
                            type="button"
                            onMouseDown={() => {
                              setEditForm(f => ({ ...f, variety: v }));
                              setIsVarietyOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors font-medium text-gray-800 text-sm ${
                              editForm.variety === v ? 'bg-primary/5 text-primary border-l-4 border-primary' : ''
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                    {i18n.language === 'mr' ? 'शेतीचा प्रकार' : i18n.language === 'hi' ? 'खेती का प्रकार' : 'Farming Type'}
                  </label>
                  <select
                    value={editForm.farmingType}
                    onChange={e => setEditForm({ ...editForm, farmingType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary bg-white font-medium"
                  >
                    <option value="irrigated">{i18n.language === 'mr' ? 'बागायती (Irrigated)' : i18n.language === 'hi' ? 'सिंचित (Irrigated)' : 'Irrigated'}</option>
                    <option value="rainfed">{i18n.language === 'mr' ? 'जिरायती (Rainfed)' : i18n.language === 'hi' ? 'वर्षा आधारित (Rainfed)' : 'Rainfed'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">
                    {i18n.language === 'mr' ? 'पिकाची स्थिती' : i18n.language === 'hi' ? 'फसल की स्थिति' : 'Crop Status'}
                  </label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary bg-white font-medium"
                  >
                    <option value="active">{i18n.language === 'mr' ? 'सक्रिय (Active)' : i18n.language === 'hi' ? 'सक्रिय (Active)' : 'Active'}</option>
                    <option value="harvested">{i18n.language === 'mr' ? 'काढणी झालेले' : i18n.language === 'hi' ? 'कटी हुई' : 'Harvested'}</option>
                    <option value="abandoned">{i18n.language === 'mr' ? 'सोडून दिलेले' : i18n.language === 'hi' ? 'छोड़ी हुई' : 'Abandoned'}</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3.5 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  {i18n.language === 'mr' ? 'रद्द करा' : i18n.language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button 
                  type="submit"
                  className="w-2/3 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                >
                  {i18n.language === 'mr' ? 'बदल जतन करा' : i18n.language === 'hi' ? 'बदलाव सहेजें' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
