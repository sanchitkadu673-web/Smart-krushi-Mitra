import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Navbar } from '../components/navigation/Navbar';
import { ShieldCheck, CloudSun, CalendarDays, Sprout, Milestone, HelpCircle, ArrowRight, Leaf, Users, Tractor, BarChart3, Star, MapPin, Building2, X, TrendingUp, Award, Zap, Globe, ChevronDown, Phone, Mail, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import imgCropSchedule from '../assets/images/crop_schedule.png';
import imgWeatherAdvisory from '../assets/images/weather_advisory.png';
import imgShopInventory from '../assets/images/shop_inventory.png';
import imgExpertAdvice from '../assets/images/expert_advice.png';
import imgDiseaseDiagnosis from '../assets/images/disease_diagnosis.png';

// ─── Animated Counter Hook ───────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Scroll-triggered section wrapper ────────────────────────────────────────
const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className="section-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// High-fidelity vector leaf components with green-emerald gradients
const MonsteraLeaf: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="monsteraGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#064e3b" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    <path d="M50,90 C45,75 48,50 50,15 C52,50 55,75 50,90 Z" fill="url(#monsteraGrad)" opacity="0.2" />
    <path d="M50,15 C20,20 10,45 20,75 C25,82 35,85 50,90 C65,85 75,82 80,75 C90,45 80,20 50,15 Z M35,32 L22,25 L38,42 L24,38 L42,54 L26,52 L45,67 L30,68 C35,76 42,80 50,83 C58,80 65,76 70,68 L55,67 L74,52 L58,54 L76,38 L62,42 L78,25 L65,32 Z" fill="url(#monsteraGrad)" />
  </svg>
);

const FernLeaf: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="fernGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#065f46" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#a7f3d0" />
      </linearGradient>
    </defs>
    <path d="M50,90 Q45,60 50,10" stroke="url(#fernGrad)" strokeWidth="3" fill="none" />
    <path d="M50,80 Q30,75 25,70 Q30,83 50,83" fill="url(#fernGrad)" />
    <path d="M50,80 Q70,75 75,70 Q70,83 50,83" fill="url(#fernGrad)" />
    <path d="M50,70 Q25,63 20,55 Q28,72 50,72" fill="url(#fernGrad)" />
    <path d="M50,70 Q75,63 80,55 Q72,72 50,72" fill="url(#fernGrad)" />
    <path d="M50,55 Q20,46 15,35 Q25,56 50,56" fill="url(#fernGrad)" />
    <path d="M50,55 Q80,46 85,35 Q75,56 50,56" fill="url(#fernGrad)" />
    <path d="M50,40 Q22,28 18,15 Q25,38 50,39" fill="url(#fernGrad)" />
    <path d="M50,40 Q78,28 82,15 Q75,38 50,39" fill="url(#fernGrad)" />
  </svg>
);

const CloverLeaf: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="cloverGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="60%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#86efac" />
      </linearGradient>
    </defs>
    <g transform="translate(50,45)">
      <path d="M0,0 C-15,-25 -35,-15 -25,5 C-15,25 0,0 0,0" fill="url(#cloverGrad)" />
      <path d="M0,0 C-25,15 -15,35 5,25 C25,15 0,0 0,0" fill="url(#cloverGrad)" />
      <path d="M0,0 C15,25 35,15 25,-5 C15,-25 0,0 0,0" fill="url(#cloverGrad)" />
      <path d="M0,0 C25,-15 15,-35 -5,-25 C-25,-15 0,0 0,0" fill="url(#cloverGrad)" />
    </g>
    <path d="M50,45 Q48,70 35,85" stroke="url(#cloverGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
  </svg>
);

const MapleLeaf: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="mapleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#b45309" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    <path d="M50,85 L50,55 M50,55 L25,45 M50,55 L75,45 M50,55 L35,68 M50,55 L65,68" stroke="url(#mapleGrad)" strokeWidth="2.5" />
    <path d="M50,15 L55,28 L68,22 L65,35 L78,35 L70,45 L85,55 L68,58 L72,72 L55,65 L50,80 L45,65 L28,72 L32,58 L15,55 L30,45 L22,35 L35,35 L32,22 L45,28 Z" fill="url(#mapleGrad)" />
  </svg>
);

const SimpleLeaf: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <defs>
      <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#047857" />
        <stop offset="60%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
    </defs>
    <path d="M15,85 C35,80 50,60 85,15 C60,50 80,35 15,85 Z" fill="url(#leafGrad)" />
    <path d="M15,85 Q40,65 85,15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />
  </svg>
);

interface ShowcaseCard {
  img: string;
  title: string;
  desc: string;
  details: {
    en: string;
    mr: string;
    hi: string;
  };
  benefits: {
    en: string[];
    mr: string[];
    hi: string[];
  };
}

export const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { profile } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [activeShowcaseCard, setActiveShowcaseCard] = useState<ShowcaseCard | null>(null);
  const [activeEcosystemCard, setActiveEcosystemCard] = useState<any | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [settings, setSettings] = useState<any>(null);

  // Fetch dynamic landing page settings
  useEffect(() => {
    axios.get('/api/landing-page')
      .then(res => {
        if (res.data) {
          setSettings(res.data);
        }
      })
      .catch(err => {
        console.error('Failed to load landing page settings:', err);
      });
  }, []);

  const getDynamicText = (keyPrefix: string) => {
    if (!settings) return null;
    // Map code like 'mr-IN' or 'mr' to 'mr'
    const currentLang = i18n.language.split('-')[0];
    const key = `${keyPrefix}_${currentLang}`;
    return settings[key] || null;
  };

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stats section intersection observer
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Counters
  const farmersCount   = useCountUp(12000, 2000, statsVisible);
  const shopsCount     = useCountUp(480,   1800, statsVisible);
  const cropsCount     = useCountUp(38,    1600, statsVisible);
  const alertsCount    = useCountUp(95000, 2200, statsVisible);

  const lang = i18n.language;

  return (
    <div className="min-h-screen bg-[#F7FAF4] dark:bg-slate-950 font-sans selection:bg-[#4CAF50]/30 text-[#1A2E1A] dark:text-slate-100">
      <Navbar />
      
      {/* Dynamic Hero Section - Lush Forest & Sunlight rays theme */}
      <section className="relative overflow-hidden pt-36 pb-32 px-4 md:px-8 flex flex-col items-center text-center bg-gradient-to-b from-[#4CAF50]/10 via-[#F7FAF4] to-[#F7FAF4] dark:from-emerald-950/20 dark:to-slate-950">
        
        {/* Sun-Dappled Canopy Sunrays overlay */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_0%,transparent_0deg,rgba(245,158,11,0.06)_15deg,transparent_30deg,rgba(76,175,80,0.04)_45deg,transparent_60deg,rgba(245,158,11,0.06)_90deg,transparent_120deg,rgba(76,175,80,0.03)_150deg,transparent_180deg)] dark:bg-[conic-gradient(from_0deg_at_50%_0%,transparent_0deg,rgba(245,158,11,0.03)_15deg,transparent_30deg,rgba(76,175,80,0.02)_45deg,transparent_60deg,rgba(245,158,11,0.03)_90deg,transparent_120deg,rgba(76,175,80,0.01)_150deg,transparent_180deg)] opacity-80 animate-sunrays pointer-events-none origin-top z-0"></div>

        {/* Animated Background Gradients - Rich Greenery & Sunlight Bloom */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(76,175,80,0.35)_0%,transparent_70%)] rounded-full blur-[80px] animate-pulse-glow"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(27,94,32,0.3)_0%,transparent_70%)] rounded-full blur-[90px] animate-pulse-glow [animation-delay:2s]"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        ></div>
        <div 
          className="absolute top-[15%] right-[10%] w-[550px] h-[550px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.25)_0%,transparent_75%)] rounded-full blur-[100px] animate-pulse [animation-delay:4s]"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(247,250,244,0.5)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.8)_100%)] z-0 pointer-events-none"></div>

        {/* Drifting Pollen / Fireflies */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-400/40 dark:bg-yellow-300/20 blur-[1px] animate-pollen"
              style={{
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${12 + Math.random() * 8}s`,
              }}
            ></div>
          ))}
        </div>
 
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 bg-[#4CAF50]/12 dark:bg-[#4CAF50]/20 border border-[#4CAF50]/25 text-[#1B5E20] dark:text-[#81c784] font-extrabold text-sm px-5 py-2.5 rounded-full mb-8 shadow-md hover:scale-105 transition-all cursor-default backdrop-blur-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1B5E20]"></span>
            </span>
            {t('tagline') || 'Empowering Farmers with Technology'}
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#1A2E1A] dark:text-white tracking-tight leading-[1.1] mb-8 drop-shadow-sm">
            {getDynamicText('hero_title') || (
              <>
                {t('heroGrowPart1')}<span className="text-[#4CAF50]">{t('heroGrowPart2')}</span> <br className="hidden sm:block" />
                {t('heroEarnPart1')}<span className="text-[#F59E0B]">{t('heroEarnPart2')}</span>
              </>
            )}
          </h1>
          
          <p className="text-lg md:text-xl text-[#1A2E1A]/80 dark:text-slate-350 max-w-2xl leading-relaxed mb-10 font-bold">
            {getDynamicText('hero_description') || t('heroDescription') || 'Smart Krushi Mitra is your complete digital farming assistant. Manage crops, get AI-powered schedules, connect with experts, and find nearby agriculture shops.'}
          </p>
 
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
            {profile ? (
              <Link to="/dashboard" className="group relative inline-flex items-center justify-center bg-[#1B5E20] hover:bg-[#124115] text-[#F7FAF4] font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-[#1B5E20]/30 transition-all overflow-hidden border border-[#1B5E20]/20">
                <span className="relative z-10 flex items-center gap-2">
                  {t('dashboard') || 'Go to Dashboard'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : (
              <>
                <button 
                  onClick={() => setShowRoleModal(true)}
                  className="group relative inline-flex items-center justify-center bg-[#1B5E20] hover:bg-[#124115] text-[#F7FAF4] font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-[#1B5E20]/30 transition-all overflow-hidden cursor-pointer border border-[#1B5E20]/20"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    {t('getStartedBtn') || 'Get Started Free'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <Link to="/login" className="inline-flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-2 border-slate-200/80 dark:border-slate-800 hover:border-[#1B5E20] text-[#1A2E1A] dark:text-[#F7FAF4] hover:text-[#1B5E20] font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-sm">
                  {t('login') || 'Login to Account'}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Floating 3D Background Greenery - Custom High-fidelity SVG components */}
        <MonsteraLeaf className="absolute top-[12%] left-[4%] w-24 h-24 opacity-35 dark:opacity-20 pointer-events-none select-none animate-drift-slow filter drop-shadow-lg" />
        <FernLeaf className="absolute bottom-[18%] right-[6%] w-28 h-28 opacity-40 dark:opacity-25 pointer-events-none select-none animate-drift-fast filter drop-shadow-lg" />
        <CloverLeaf className="absolute top-[28%] right-[8%] w-16 h-16 opacity-35 dark:opacity-20 pointer-events-none select-none animate-float filter drop-shadow-md" />
        <SimpleLeaf className="absolute bottom-[26%] left-[10%] w-20 h-20 opacity-30 dark:opacity-15 pointer-events-none select-none animate-float-delayed filter drop-shadow-md" />
        <MapleLeaf className="absolute top-[6%] right-[22%] w-14 h-14 opacity-25 dark:opacity-15 pointer-events-none select-none animate-drift-slow filter drop-shadow-sm [animation-duration:20s]" />
        <MonsteraLeaf className="absolute bottom-[8%] left-[2%] w-28 h-28 opacity-25 dark:opacity-15 pointer-events-none select-none animate-drift-fast filter drop-shadow-lg [animation-duration:24s]" />
        <FernLeaf className="absolute top-[38%] left-[24%] w-20 h-20 opacity-20 dark:opacity-10 pointer-events-none select-none animate-sway filter drop-shadow-md" />
        <SimpleLeaf className="absolute bottom-[38%] right-[24%] w-16 h-16 opacity-25 dark:opacity-12 pointer-events-none select-none animate-sway filter drop-shadow-md [animation-delay:2s]" />

        {/* Rolling Green Hills vector landscape overlay */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[100px] translate-y-1">
            <defs>
              <linearGradient id="hill1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="text-emerald-100/30 dark:text-emerald-950/15" stopColor="currentColor" />
                <stop offset="100%" className="text-green-200/40 dark:text-emerald-900/10" stopColor="currentColor" />
              </linearGradient>
              <linearGradient id="hill2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="text-green-200/50 dark:text-emerald-950/30" stopColor="currentColor" />
                <stop offset="100%" className="text-emerald-300/30 dark:text-green-950/20" stopColor="currentColor" />
              </linearGradient>
            </defs>
            <path d="M0,60 C150,90 350,30 500,70 C650,110 850,50 1200,80 L1200,120 L0,120 Z" fill="url(#hill1)" />
            <path d="M0,80 C200,40 400,90 600,50 C800,10 C1000,70 1200,40 L1200,120 L0,120 Z" fill="url(#hill2)" />
          </svg>
        </div>

        {/* 3D Dashboard Mockup Preview - Multi-layered Overlapping Cards */}
        <div className="relative w-full max-w-5xl mx-auto mt-16 z-10 perspective-1000 preserve-3d min-h-[520px] md:min-h-[440px] px-4">
          <div className="absolute inset-x-0 bottom-[-40px] h-32 bg-slate-500/10 dark:bg-black/20 rounded-[4rem] blur-3xl pointer-events-none"></div>
          
          {/* Subtle Green/Amber Background Glows behind the cards */}
          <div className="absolute top-12 left-1/4 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(76,175,80,0.18)_0%,transparent_70%)] rounded-full blur-[60px] animate-pulse pointer-events-none z-0"></div>
          <div className="absolute bottom-8 right-1/4 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_70%)] rounded-full blur-[70px] animate-pulse [animation-delay:2s] pointer-events-none z-0"></div>

          <div className="relative w-full min-h-[520px] md:min-h-[440px] preserve-3d">
            {/* 1. Crop Dashboard Panel (Left/Center) */}
            <div className="relative md:absolute md:left-4 md:top-4 w-full md:w-[58%] bg-white/90 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-premium-3d backdrop-blur-md layer-depth-1 hover:layer-depth-2 transition-all duration-500 z-10 preserve-3d">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#4CAF50]/10 text-[#1B5E20] dark:text-[#4CAF50] rounded-xl flex items-center justify-center shrink-0">
                  <Sprout className="w-6 h-6 animate-float" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-black text-sm text-[#1B5E20] dark:text-[#4CAF50]">
                    {i18n.language === 'mr' ? 'सोयाबीन' : i18n.language === 'hi' ? 'सोयाबीन' : 'Soybean'}
                  </h4>
                  <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500">
                    {i18n.language === 'mr' ? 'साप्ताहिक कामगिरी निर्देशांक' : i18n.language === 'hi' ? 'साप्ताहिक प्रदर्शन सूचकांक' : 'Weekly Performance Index'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#1B5E20] dark:text-[#4CAF50] bg-[#4CAF50]/15 px-3 py-1 rounded-full">
                  {t('active') || 'Active'}
                </span>
              </div>
              
              {/* Graph inside Dashboard */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                  <span>
                    {i18n.language === 'mr' ? 'साप्ताहिक पीक वाढ' : i18n.language === 'hi' ? 'साप्ताहिक फसल वृद्धि' : 'Weekly Crop Growth'}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {i18n.language === 'mr' ? '+१५% या आठवड्यात' : i18n.language === 'hi' ? '+15% इस सप्ताह' : '+15% this week'}
                  </span>
                </div>
                <div className="h-32 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'W1', growth: 30 },
                      { name: 'W2', growth: 45 },
                      { name: 'W3', growth: 60 },
                      { name: 'W4', growth: 50 },
                      { name: 'W5', growth: 75 },
                      { name: 'W6', growth: 70 },
                      { name: 'W7', growth: 90 },
                      { name: 'W8', growth: 95 }
                    ]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1B5E20" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: 'none', 
                          borderRadius: '12px', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
                        }}
                        labelStyle={{ fontWeight: 'bold', color: '#1B5E20', fontSize: '10px' }}
                        itemStyle={{ fontSize: '10px', color: '#334155' }}
                      />
                      <Area type="monotone" dataKey="growth" stroke="#1B5E20" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGrowth)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 2. Weather Card (Top Right, Overlapping) */}
            <div className="relative md:absolute md:right-12 md:-top-6 w-full md:w-[36%] bg-gradient-to-br from-[#1B5E20] to-[#0a2e10] p-6 rounded-3xl shadow-premium-3d text-white layer-depth-3 hover:layer-depth-4 transition-all duration-500 z-30 preserve-3d overflow-hidden mt-6 md:mt-0 text-left">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse-glow"></div>
              <CloudSun className="w-12 h-12 mb-4 text-[#F59E0B] animate-float" />
              <div>
                <div className="text-4xl font-black tracking-tight text-[#F7FAF4]">28°C</div>
                <div className="text-[#4CAF50] font-bold mt-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#F59E0B]" /> {i18n.language === 'mr' ? 'पुणे, भारत' : i18n.language === 'hi' ? 'पुणे, भारत' : 'Pune, IN'}
                </div>
              </div>
            </div>

            {/* 3. Alert Card (Bottom Right, Overlapping with Left Border Accent) */}
            <div className="relative md:absolute md:right-4 md:bottom-4 w-full md:w-[44%] bg-white/95 dark:bg-slate-900/90 p-5 rounded-2xl border-l-4 border-[#4CAF50] border-y border-r border-slate-200/80 dark:border-slate-800 shadow-premium-3d backdrop-blur-md layer-depth-2 hover:layer-depth-3 transition-all duration-500 z-20 flex gap-4 mt-6 md:mt-0 text-left">
              <div className="p-3 bg-[#4CAF50]/10 text-[#1B5E20] dark:text-[#4CAF50] rounded-xl h-fit shrink-0">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1 py-0.5 text-left">
                <h5 className="font-bold text-xs text-[#1B5E20] dark:text-[#4CAF50] mb-0.5">
                  {t('alertCardTitle') || 'Expert Verified'}
                </h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-normal">
                  {t('alertCardDesc') || 'All schedules are certified by agriculture experts.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
           LIVE STATS COUNTER SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#1a4a20]">
        {/* Background mesh pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4CAF50]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 font-bold text-xs px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse"></span>
              {lang === 'mr' ? 'लाईव्ह आकडेवारी' : lang === 'hi' ? 'लाइव डेटा' : 'Live Platform Data'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              {lang === 'mr' ? 'शेतकऱ्यांनी विश्वास ठेवलेले' : lang === 'hi' ? 'किसानों का भरोसा' : 'Trusted by Farmers Across India'}
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              {lang === 'mr' ? 'संख्या जी आमची कामगिरी सांगतात' : lang === 'hi' ? 'संख्याएं जो हमारी उपलब्धि बताती हैं' : 'Numbers that speak for our impact'}
            </p>
          </div>

          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Users className="w-7 h-7" />, value: farmersCount, suffix: '+', label: lang === 'mr' ? 'नोंदणीकृत शेतकरी' : lang === 'hi' ? 'पंजीकृत किसान' : 'Registered Farmers', color: 'from-green-400/20 to-green-300/10' },
              { icon: <Building2 className="w-7 h-7" />, value: shopsCount, suffix: '+', label: lang === 'mr' ? 'कृषी केंद्रे' : lang === 'hi' ? 'कृषि केंद्र' : 'Agriculture Shops', color: 'from-amber-400/20 to-amber-300/10' },
              { icon: <Sprout className="w-7 h-7" />, value: cropsCount, suffix: '+', label: lang === 'mr' ? 'पीक प्रकार' : lang === 'hi' ? 'फसल प्रकार' : 'Crop Varieties', color: 'from-emerald-400/20 to-emerald-300/10' },
              { icon: <Zap className="w-7 h-7" />, value: alertsCount, suffix: '+', label: lang === 'mr' ? 'इशारे पाठवले' : lang === 'hi' ? 'अलर्ट भेजे' : 'Alerts Sent', color: 'from-lime-400/20 to-lime-300/10' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`relative group glass-card rounded-3xl p-6 text-center overflow-hidden border border-white/20 backdrop-blur-md`}
                style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))`, animationDelay: `${i * 150}ms` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/15 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-1 tabular-nums">
                  {statsVisible ? stat.value.toLocaleString('en-IN') : '0'}
                  <span className="text-[#4CAF50]">{stat.suffix}</span>
                </div>
                <p className="text-white/60 text-sm font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Process Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E1A] dark:text-[#F7FAF4] tracking-tight">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {i18n.language === 'mr' ? 'स्मार्ट कृषी मित्र वर नोंदणी करण्याची सोपी पद्धत' : i18n.language === 'hi' ? 'स्मार्ट कृषि मित्र पर पंजीकरण की आसान प्रक्रिया' : 'Simple steps to register and start growing smart'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group relative">
              <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950/30 text-green-600 flex items-center justify-center font-black text-xl mb-4 shadow-sm border border-green-100 dark:border-green-900 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('step1Title')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">{t('step1Desc')}</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center font-black text-xl mb-4 shadow-sm border border-amber-100 dark:border-amber-900 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('step2Title')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">{t('step2Desc')}</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group relative">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center font-black text-xl mb-4 shadow-sm border border-blue-100 dark:border-blue-900 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('step3Title')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">{t('step3Desc')}</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group relative">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center font-black text-xl mb-4 shadow-sm border border-purple-100 dark:border-purple-900 group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('step4Title')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">{t('step4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
           FEATURES GRID — Enhanced with scroll animations
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative bg-[#F7FAF4] dark:bg-slate-950">
        <div className="absolute top-40 right-0 w-72 h-72 bg-[#4CAF50]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-0 w-60 h-60 bg-[#F59E0B]/5 rounded-full blur-3xl -z-10"></div>

        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#1B5E20] dark:text-[#4CAF50] font-bold text-xs px-4 py-1.5 rounded-full mb-4">
              <Zap className="w-3.5 h-3.5" />
              {lang === 'mr' ? 'आमची वैशिष्ट्ये' : lang === 'hi' ? 'हमारी विशेषताएं' : 'Platform Features'}
            </span>
            <h2 className="text-4xl font-black text-[#1A2E1A] dark:text-[#F7FAF4] mb-4">{t('keyFeaturesTitle') || 'Everything you need to succeed'}</h2>
            <p className="text-xl text-[#1A2E1A]/60 dark:text-slate-400">
              {lang === 'mr' ? 'आधुनिक भारतीय शेतकऱ्यासाठी तयार केलेली शक्तिशाली वैशिष्ट्ये.' : lang === 'hi' ? 'आधुनिक भारतीय किसान के लिए बनाई गई शक्तिशाली विशेषताएं।' : 'Powerful features designed specifically for the modern Indian farmer.'}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <CalendarDays className="w-8 h-8" />,
              title: t('feat1Title') || 'Smart Schedules',
              desc: t('feat1Desc'),
              color: 'from-emerald-500 to-green-400',
              bg: 'bg-emerald-50 dark:bg-emerald-950/30',
              iconColor: 'text-emerald-700 dark:text-emerald-400',
              accent: '#4CAF50',
              img: '',
              details: {
                en: "Automated Crop Stage Calculator computes the exact developmental stage of your crop based on its sowing date. This helps you understand when the crop is in vegetative, flowering, or maturity stages without reference to manual sheets.",
                mr: "स्वयंचलित पीक वाढ मोजणी यंत्र तुमच्या पिकाची पेरणीच्या तारखेनुसार अचूक वाढीची अवस्था मोजते. यामुळे तुम्हाला मॅन्युअल पत्रके न पाहता पीक शाकीय वाढीच्या, फुलोऱ्याच्या किंवा परिपक्वतेच्या टप्प्यात कधी आहे हे समजण्यास मदत होते.",
                hi: "स्वचालित फसल चरण कैलकुलेटर आपकी बुवाई की तारीख के आधार पर आपकी फसल के विकास के सटीक चरण की गणना करता है। यह आपको संदर्भ पुस्तिकाओं के बिना यह समझने में मदद करता है कि फसल वानस्पतिक, पुष्पन या परिपक्वता अवस्था में कब है।"
              },
              benefits: {
                en: ["No manual calculations or guesswork required", "Automatic milestone tracking from sowing to harvest", "Timely agricultural actions based on precise stages"],
                mr: ["कोणत्याही मॅन्युअल मोजणी किंवा तर्काची गरज नाही", "पेरणीपासून काढणीपर्यंत स्वयंचलित लक्ष्यांचा मागोवा", "अचूक टप्प्यांवर आधारित वेळेवर कृषी कृती"],
                hi: ["किसी भी मैन्युअल गणना या अनुमान की आवश्यकता नहीं है", "बुवाई से लेकर कटाई तक स्वचालित मील के पत्थर की ट्रैकिंग", "सटीक चरणों के आधार पर समय पर कृषि कार्य"]
              }
            },
            {
              icon: <Sprout className="w-8 h-8" />,
              title: t('feat2Title') || 'Crop Management',
              desc: t('feat2Desc'),
              color: 'from-green-600 to-teal-500',
              bg: 'bg-green-50 dark:bg-green-950/30',
              iconColor: 'text-green-700 dark:text-green-400',
              accent: '#059669',
              img: '',
              details: {
                en: "Get customized fertilizer and prevention spray recommendations based on the active growth stage of your crops. Boost yield and prevent common deficiencies and diseases before they manifest.",
                mr: "तुमच्या पिकांच्या सक्रिय वाढीच्या टप्प्यावर आधारित कस्टमाइज्ड खते आणि प्रतिबंधात्मक फवारणीच्या शिफारसी मिळवा. पिकाचे उत्पादन वाढवा आणि सामान्य कमतरता व रोग उद्भवण्यापूर्वीच रोखा.",
                hi: "अपनी फसलों के सक्रिय विकास चरण के आधार पर अनुकूलित उर्वरक और निवारक छिड़काव की सिफारिशें प्राप्त करें। उपज बढ़ाएं और सामान्य कमियों और रोगों को प्रकट होने से पहले रोकें।"
              },
              benefits: {
                en: ["Stage-specific fertilizer dosage guidance", "Disease prevention through timed sprays", "Optimized fertilizer utilization to reduce overall cultivation costs"],
                mr: ["टप्प्यानुसार खतांच्या मात्रेचे अचूक मार्गदर्शन", "वेळेवर फवारणीद्वारे रोग प्रतिबंध", "शेतीचा एकूण खर्च कमी करण्यासाठी खतांचा इष्टतम वापर"],
                hi: ["चरण-विशिष्ट उर्वरक खुराक मार्गदर्शन", "समय पर छिड़काव के माध्यम से रोग की रोकथाम", "कुल खेती की लागत को कम करने के लिए उर्वरक का इष्टतम उपयोग"]
              }
            },
            {
              icon: <CloudSun className="w-8 h-8" />,
              title: t('feat3Title') || 'Weather Alerts',
              desc: t('feat3Desc'),
              color: 'from-amber-500 to-yellow-400',
              bg: 'bg-amber-50 dark:bg-amber-950/30',
              iconColor: 'text-amber-700 dark:text-amber-400',
              accent: '#F59E0B',
              img: '',
              details: {
                en: "Get precise weather warnings customized for your Taluka/Village. Our automated scanner analyzes cloud cover and rain forecasts to warn you against spraying or applying fertilizers when rain is imminent.",
                mr: "तुमच्या तालुक्यासाठी/गावासाठी कस्टमाइज्ड अचूक हवामान इशारे मिळवा. आमची स्वयंचलित प्रणाली ढगांचे आच्छादन आणि पावसाच्या अंदाजाचे विश्लेषण करून पाऊस पडणार असल्यास फवारणी किंवा खत न देण्याचा इशारा देते.",
                hi: "अपने तालुका/गाँव के लिए अनुकूलित सटीक मौसम चेतावनी प्राप्त करें। हमारा स्वचालित स्कैनर बादलों के आवरण और बारिश के पूर्वानुमान का विश्लेषण करता है ताकि बारिश होने पर छिड़काव या उर्वरक न लगाने की चेतावनी दी जा सके।"
              },
              benefits: {
                en: ["Rain and storm forecasts up to 3 days in advance", "Prevent chemical and spray wash-off by postponing applications", "Real-time alerts customized to location"],
                mr: ["३ दिवस आधीच पावसाचा आणि वादळाचा अचूक अंदाज", "फवारणी वाहून जाणे टाळण्यासाठी कामे पुढे ढकलण्याचा सल्ला", "तुमच्या स्थानानुसार रिअल-टाइम इशारे"],
                hi: ["3 दिन पहले तक बारिश और तूफान का सटीक पूर्वानुमान", "छिड़काव के बह जाने से बचने के लिए कार्यों को स्थगित करने की सलाह", "आपके स्थान के अनुसार रीयल-टाइम अलर्ट"]
              }
            },
            {
              icon: <MapPin className="w-8 h-8" />,
              title: t('feat4Title') || 'Nearby Shops',
              desc: t('feat4Desc'),
              color: 'from-blue-500 to-cyan-400',
              bg: 'bg-blue-50 dark:bg-blue-950/30',
              iconColor: 'text-blue-700 dark:text-blue-400',
              accent: '#3B82F6',
              img: '',
              details: {
                en: "Browse and discover licensed Krushi Seva Kendra and agro dealers near your taluka. Verify availability of seeds, fertilizers, and pesticide brands along with official prices before visiting the store.",
                mr: "तुमच्या तालुक्या जवळील परवानाधारक कृषी सेवा केंद्रे आणि विक्रेते शोधा. दुकानात जाण्यापूर्वी बियाणे, खते आणि कीटकनाशक ब्रँड्सची उपलब्धता आणि अधिकृत किमती तपासा.",
                hi: "अपने तालुका के पास लाइसेंस प्राप्त कृषि सेवा केंद्रों and डीलरों को खोजें। दुकान पर जाने से पहले बीजों, उर्वरकों और कीटनाशक ब्रांडों की उपलब्धता और आधिकारिक कीमतों की जांच करें।"
              },
              benefits: {
                en: ["Map and contact details of verified local shops", "Direct stock catalog verification", "Saves transport cost and prevents out-of-stock trips"],
                mr: ["प्रमाणित स्थानिक दुकानांचे नकाशे आणि संपर्क माहिती", "थेट स्टॉक कॅटलॉग तपासण्याची सुविधा", "वाहतूक खर्चाची बचत आणि रिक्त फेऱ्या टळतात"],
                hi: ["सत्यापित स्थानीय दुकानों के नक्शे और संपर्क विवरण", "सीधे स्टॉक कैटलॉग की जांच करने की सुविधा", "परिवहन लागत की बचत और खाली चक्करों से बचाव"]
              }
            },
            {
              icon: <Award className="w-8 h-8" />,
              title: t('feat5Title') || 'Expert Advice',
              desc: t('feat5Desc'),
              color: 'from-purple-500 to-violet-400',
              bg: 'bg-purple-50 dark:bg-purple-950/30',
              iconColor: 'text-purple-700 dark:text-purple-400',
              accent: '#8B5CF6',
              img: '',
              details: {
                en: "Ask agronomy experts and scientists for solutions to your crop problems. Upload photo logs of damaged leaves or pests to get verified organic and chemical treatments within a short span.",
                mr: "तुमच्या पिकांच्या समस्यांसाठी कृषी तज्ज्ञ आणि शास्त्रज्ञांकडून उत्तरे मिळवा. काही वेळातच प्रमाणित सेंद्रिय आणि रासायनिक उपाय मिळवण्यासाठी बाधित पानांचे किंवा किडींचे फोटो अपलोड करा.",
                hi: "अपनी फसल की समस्याओं के लिए कृषि विशेषज्ञों और वैज्ञानिकों से समाधान प्राप्त करें। कम समय में सत्यापित जैविक और रासायनिक उपचार प्राप्त करने के लिए प्रभावित पत्तियों या कीटों की तस्वीरें अपलोड करें।"
              },
              benefits: {
                en: ["Direct connectivity to certified agricultural experts", "Leaf symptom analysis and photo uploading", "Custom remedial action plans"],
                mr: ["प्रमाणित कृषी तज्ज्ञांशी थेट संपर्क", "पानांची लक्षणे तपासून अचूक मार्गदर्शन", "कस्टमाइज्ड उपाय योजना"],
                hi: ["प्रमाणित कृषि विशेषज्ञों से सीधे संपर्क", "पत्तियों के लक्षणों की जांच कर सटीक मार्गदर्शन", "अनुकूलित उपचारात्मक कार्य योजना"]
              }
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: t('feat6Title') || 'Market Insights',
              desc: t('feat6Desc'),
              color: 'from-orange-500 to-rose-400',
              bg: 'bg-orange-50 dark:bg-orange-950/30',
              iconColor: 'text-orange-700 dark:text-orange-400',
              accent: '#F97316',
              img: '',
              details: {
                en: "Access live APMC market rates (mandi bhav) for crops in major markets across Maharashtra. Track price trends, high/low indices, and demand signals to sell your produce at the maximum profit.",
                mr: "महाराष्ट्रातील प्रमुख बाजारपेठांमधील पिकांचे थेट APMC बाजारभाव (बाजार समिती दर) मिळवा. पिकाला जास्तीत जास्त नफा मिळवण्यासाठी किमतींचे ट्रेंड आणि मागणी तपासा.",
                hi: "महाराष्ट्र के प्रमुख बाजारों में फसलों के लाइव APMC बाजार भाव प्राप्त करें। फसल को अधिकतम लाभ पर बेचने के लिए मूल्य प्रवृत्तियों और मांग की जांच करें।"
              },
              benefits: {
                en: ["Live market rates from nearest Mandis", "Historical price comparison graphs", "Decision support on when and where to sell to maximize profit"],
                mr: ["जवळच्या बाजार समित्यांमधील थेट बाजारभाव", "किंमतींच्या ऐतिहासिक बदलांचे आलेख", "जास्तीत जास्त नफ्यासाठी केव्हा आणि कुठे विकावे याबद्दल मार्गदर्शन"],
                hi: ["निकटतम मंडियों से लाइव बाजार भाव", "मूल्य परिवर्तनों के ऐतिहासिक आलेख", "अधिकतम लाभ के लिए कब और कहाँ बेचना है, इस पर निर्णय मार्गदर्शन"]
              }
            }
          ].map((feat, idx) => (
            <ScrollReveal key={idx} delay={idx * 80}>
              <div 
                onClick={() => setActiveShowcaseCard(feat as any)}
                className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-3 hover:scale-[1.02] overflow-hidden text-left h-full cursor-pointer"
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${feat.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 0%, ${feat.accent}10 0%, transparent 70%)` }}></div>
                {/* Icon */}
                <div className={`${feat.bg} ${feat.iconColor} p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1A2E1A] dark:text-[#F7FAF4]">{feat.title}</h3>
                <p className="text-[#1A2E1A]/65 dark:text-slate-400 leading-relaxed text-sm font-medium">{feat.desc}</p>
                {/* Learn more link */}
                <div className="mt-6 flex items-center gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300" style={{ color: feat.accent }}>
                  {lang === 'mr' ? 'अधिक जाणून घ्या' : lang === 'hi' ? 'और जानें' : 'Learn more'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
      {/* Smart Krushi Mitra in Action Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-[#1A2E1A] dark:text-[#F7FAF4] mb-4">
              {i18n.language === 'mr' ? 'स्मार्ट कृषी मित्र कार्यात' : i18n.language === 'hi' ? 'स्मार्ट कृषि मित्र कार्यप्रणाली' : 'Smart Krushi Mitra in Action'}
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
              {i18n.language === 'mr' ? 'आपले प्लॅटफॉर्म शेतकरी आणि दुकानदार दोघांना कसे सक्षम बनवते ते पहा.' : i18n.language === 'hi' ? 'देखें कि हमारा प्लेटफॉर्म किसानों और दुकानदारों दोनों को कैसे सशक्त बनाता है।' : 'See how our platform empowers farmers and shop owners in their daily activities.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                img: imgCropSchedule,
                title: i18n.language === 'mr' ? 'AI पीक वेळापत्रक' : i18n.language === 'hi' ? 'AI फसल अनुसूची' : 'AI Crop Calendars',
                desc: i18n.language === 'mr' ? 'पेरणीच्या तारखेनुसार खते, फवारणी आणि पाण्याच्या व्यवस्थापनाचे वेळापत्रक.' : i18n.language === 'hi' ? 'बुवाई की तारीख के अनुसार उर्वरक, छिड़काव और पानी के प्रबंधन का कार्यक्रम।' : 'Step-by-step schedules for seed sowing, fertilizers, spraying, and irrigation based on sowing date.',
                details: {
                  en: 'Get a personalized step-by-step crop calendar from sowing to harvesting based on your sowing date. The system automatically computes exact dates for seed treatment, fertilizer applications, pest spraying, and watering schedules.',
                  mr: 'तुमच्या पेरणीच्या तारखेनुसार बियाण्यांच्या प्रक्रियेपासून ते काढणीपर्यंतचे वैयक्तिकृत पीक वेळापत्रक मिळवा. सिस्टीम स्वयंचलितपणे खते देणे, फवारणी आणि पाण्याच्या व्यवस्थापनाच्या योग्य तारखा मोजते.',
                  hi: 'बुवाई की तारीख के आधार पर बीज उपचार से लेकर कटाई तक का व्यक्तिगत फसल कैलेंडर प्राप्त करें। सिस्टम स्वचालित रूप से उर्वरक, छिड़काव और सिंचाई के प्रबंधन की सटीक तारीखों की गणना करता है।'
                },
                benefits: {
                  en: [
                    'Personalized schedules based on crop variety and sowing date.',
                    'Timely notifications for critical tasks (sowing, watering, fertilizing).',
                    'Expert-approved recommendations to increase crop yield.'
                  ],
                  mr: [
                    'पीक वाण आणि पेरणीच्या तारखेवर आधारित वैयक्तिकृत वेळापत्रक.',
                    'महत्त्वपूर्ण कामांसाठी (पेरणी, पाणी, खते) वेळेवर सूचना.',
                    'पिकाचे उत्पादन वाढवण्यासाठी तज्ज्ञ-प्रमाणित शिफारसी.'
                  ],
                  hi: [
                    'फसल की विविधता और बुवाई की तारीख के आधार पर व्यक्तिगत समय सारणी.',
                    'महत्वपूर्ण कार्यों (बुवाई, सिंचाई, उर्वरक) के लिए समय पर सूचनाएं.',
                    'फसल की उपज बढ़ाने के लिए विशेषज्ञों द्वारा प्रमाणित सिफारिशें.'
                  ]
                }
              },
              {
                img: imgWeatherAdvisory,
                title: i18n.language === 'mr' ? 'हवामान व पीक सल्ला' : i18n.language === 'hi' ? 'मौसम और फसल सलाह' : 'Weather Insights & Alerts',
                desc: i18n.language === 'mr' ? 'पाऊस आणि हवामानाचा अचूक अंदाज, जेणेकरून औषधांची फवारणी वाया जाणार नाही.' : i18n.language === 'hi' ? 'बारिश और मौसम का सटीक पूर्वानुमान, ताकि कीटनाशकों का छिड़काव व्यर्थ न जाए।' : 'Real-time weather updates with automatic rain alerts to avoid spray washes and save costs.',
                details: {
                  en: 'Real-time hyper-local weather alerts tailored to your farming location. Stay ahead of sudden rains, heatwaves, or humidity shifts to protect your crops and avoid pesticide spray wash-offs.',
                  mr: 'तुमच्या शेतीच्या स्थानानुसार रिअल-टाइम हायपर-लोकल हवामान सल्ले. पिकांचे रक्षण करण्यासाठी आणि औषधांची फवारणी वाया जाण्यापासून वाचवण्यासाठी अचानक होणारा पाऊस, उष्णतेच्या लाटा किंवा आर्द्रतेतील बदलांची माहिती मिळवा.',
                  hi: 'आपके कृषि क्षेत्र के अनुसार रीयल-टाइम हाइपर-लोकल मौसम अलर्ट। फसलों की सुरक्षा के लिए और कीटनाशकों के छिड़काव को व्यर्थ जाने से बचाने के लिए अचानक बारिश, लू या आर्द्रता में बदलाव की जानकारी प्राप्त करें।'
                },
                benefits: {
                  en: [
                    'Accurate rain alerts up to 3 days in advance.',
                    'Preventive crop advisory actions generated by AI in Marathi/Hindi.',
                    'Protects cost of expensive pesticides by avoiding spray failure.'
                  ],
                  mr: [
                    '३ दिवस आधीच पावसाचा अचूक अंदाज आणि सूचना.',
                    'पिकांचे नुकसान टाळण्यासाठी एआय (AI) द्वारे स्थानिक भाषेत कृषी सल्ला.',
                    'फवारणी वाहून जाण्यापासून वाचवून महागड्या औषधांचा खर्च वाचतो.'
                  ],
                  hi: [
                    '3 दिन पहले ही बारिश का सटीक पूर्वानुमान और अलर्ट.',
                    'फसलों के नुकसान से बचने के लिए एआई द्वारा स्थानीय भाषा में कृषि सलाह.',
                    'छिड़काव धुलने से बचाकर महंगे कीटनाशकों की लागत की बचत.'
                  ]
                }
              },
              {
                img: imgShopInventory,
                title: i18n.language === 'mr' ? 'कृषी केंद्र साठा' : i18n.language === 'hi' ? 'कृषि केंद्र स्टॉक' : 'Real-time Shop Stock',
                desc: i18n.language === 'mr' ? 'जवळच्या कृषी केंद्रांमधील खते व बियाणांची उपलब्धता आणि दर घरबसल्या तपासा.' : i18n.language === 'hi' ? 'पास के कृषि केंद्रों में उर्वरकों और बीजों की उपलब्धता और कीमतें घर बैठे जांचें।' : 'Check local shop seed and fertilizer availability and prices in real-time before visiting.',
                details: {
                  en: 'Check fertilizer, seed, and pesticide inventory at verified nearby agriculture shops (Krushi Kendra) right from your home. Compare prices and verify availability before travelling to the shop.',
                  mr: 'तुमच्या घरामधूनच जवळच्या प्रमाणित कृषी केंद्रांमधील खते, बियाणे आणि कीटकनाशकांच्या उपलब्धतेची माहिती मिळवा. दुकानात जाण्यापूर्वी किंमतींची तुलना करा आणि साठा असल्याची खात्री करा.',
                  hi: 'अपने घर से ही नजदीकी प्रमाणित कृषि केंद्रों में उर्वरक, बीज और कीटनाशकों की उपलब्धता की जांच करें। दुकान पर जाने से पहले कीमतों की तुलना करें और स्टॉक की पुष्टि करें।'
                },
                benefits: {
                  en: [
                    'Real-time stock status of critical fertilizers like Urea, DAP, etc.',
                    'Transparent pricing display from local authorized dealers.',
                    'Saves precious travel time and transportation costs.'
                  ],
                  mr: [
                    'युरिया, डीएपी (DAP) यांसारख्या आवश्यक खतांची रिअल-टाइम उपलब्धता.',
                    'स्थानिक अधिकृत विक्रेत्यांकडून पारदर्शक दरांचे प्रदर्शन.',
                    'प्रवासाचा वेळ आणि वाहतूक खर्चाची बचत.'
                  ],
                  hi: [
                    'यूरिया, डीएपी जैसे आवश्यक उर्वरकों की रीयल-टाइम उपलब्धता.',
                    'स्थानीय अधिकृत डीलरों से पारदर्शी कीमतों का प्रदर्शन.',
                    'यात्रा के समय और परिवहन लागत की बचत.'
                  ]
                }
              },
              {
                img: imgExpertAdvice,
                title: i18n.language === 'mr' ? 'कृषी तज्ज्ञ मार्गदर्शन' : i18n.language === 'hi' ? 'कृषि विशेषज्ञ सलाह' : 'Expert Advisory Q&A',
                desc: i18n.language === 'mr' ? 'पिकावरील रोग व किडींच्या नियंत्रणासाठी थेट पात्र कृषी तज्ज्ञांकडून मार्गदर्शन मिळवा.' : i18n.language === 'hi' ? 'फसल के रोगों और कीटों के नियंत्रण के लिए सीधे योग्य कृषि विशेषज्ञों से सलाह लें।' : 'Connect directly with certified agriculture experts to solve crop diseases and receive instant remedies.',
                details: {
                  en: 'Connect directly with certified agricultural scientists and experienced extension officers. Post questions with pictures of your crop, ask about fertilization plans, and get personalized remedies within hours.',
                  mr: 'प्रमाणित कृषी शास्त्रज्ञ आणि अनुभवी कृषी तज्ज्ञांशी थेट संपर्क साधा. तुमच्या पिकाच्या फोटोंसह प्रश्न विचारा, खत व्यवस्थापनाबद्दल माहिती मिळवा आणि काही तासांत योग्य तोडगा मिळवा.',
                  hi: 'प्रमाणित कृषि वैज्ञानिकों और अनुभवी कृषि विशेषज्ञों से सीधे जुड़ें। अपनी फसल की तस्वीरों के साथ प्रश्न पूछें, उर्वरक प्रबंधन की जानकारी प्राप्त करें और कुछ ही घंटों में समाधान पाएं।'
                },
                benefits: {
                  en: [
                    'Verified agronomy experts providing tailored advice.',
                    'Option to attach crop photos for accurate remote diagnosis.',
                    'Practical chemical and organic solutions for best results.'
                  ],
                  mr: [
                    'वैयक्तिकृत सल्ला देणारे प्रमाणित कृषी तज्ज्ञ.',
                    'अचूक निदानासाठी पिकाचे फोटो जोडण्याची सुविधा.',
                    'सर्वोत्तम परिणामांसाठी रासायनिक आणि सेंद्रिय दोन्ही प्रकारचे उपाय.'
                  ],
                  hi: [
                    'व्यक्तिगत सलाह देने वाले प्रमाणित कृषि विशेषज्ञ.',
                    'सटीक निदान के लिए फसल की तस्वीरें संलग्न करने की सुविधा.',
                    'सर्वोत्तम परिणामों के लिए रासायनिक और जैविक दोनों प्रकार के समाधान.'
                  ]
                }
              },
              {
                img: imgDiseaseDiagnosis,
                title: i18n.language === 'mr' ? 'रोग व कीड नियंत्रण' : i18n.language === 'hi' ? 'रोग और कीट नियंत्रण' : 'Crop Disease Diagnosis',
                desc: i18n.language === 'mr' ? 'पिकांवरील विविध रोग आणि किडींचे फोटो पाहून त्वरित निदान करा आणि योग्य उपाय शोधा.' : i18n.language === 'hi' ? 'फसलों पर विभिन्न रोगों और कीटों की तस्वीरें देखकर तुरंत निदान करें और उचित उपचार खोजें।' : 'Searchable database outlining crop diseases, symptoms, and organic or chemical spray recommendations.',
                details: {
                  en: 'An extensive digital database of crop diseases, pests, and nutrient deficiencies. Browse symptoms, view high-quality reference images, and discover organic and chemical control recommendations.',
                  mr: 'पिकांवरील रोग, कीड आणि पोषक द्रव्यांच्या कमतरतेचा विस्तृत डिजिटल डेटाबेस. लक्षणांचा अभ्यास करा, उच्च-गुणवत्तेचे फोटो पहा आणि सेंद्रिय व रासायनिक नियंत्रणाचे मार्ग शोधा.',
                  hi: 'फसलों के रोगों, कीटों और पोषक तत्वों की कमी का एक व्यापक डिजिटल डेटाबेस। लक्षणों का अध्ययन करें, उच्च गुणवत्ता वाले संदर्भ चित्र देखें और जैविक व रासायनिक नियंत्रण के उपाय खोजें।'
                },
                benefits: {
                  en: [
                    'Comprehensive catalog of local crop diseases and pests.',
                    'Detailed symptom descriptions for easy manual comparison.',
                    'Safe, effective control measures with recommended chemical dosages.'
                  ],
                  mr: [
                    'स्थानिक पिकांचे रोग आणि किडींचा सर्वसमावेशक कॅटलॉग.',
                    'सुलभ पडताळणीसाठी सविस्तर लक्षणांचे वर्णन.',
                    'औषध प्रमाणासह सुरक्षित आणि प्रभावी नियंत्रण उपाय.'
                  ],
                  hi: [
                    'स्थानीय फसलों के रोगों और कीटों का व्यापक कैटलॉग.',
                    'आसान तुलना के लिए विस्तृत लक्षणों का वर्णन.',
                    'सुरक्षित और प्रभावी नियंत्रण उपाय एवं अनुशंसित रासायनिक खुराक.'
                  ]
                }
              }
            ].map((card, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveShowcaseCard(card)}
                className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden text-left flex flex-col justify-between h-full cursor-pointer"
              >
                <div>
                  <div className="relative overflow-hidden aspect-video sm:aspect-square">
                    <img 
                      src={card.img} 
                      alt={card.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-extrabold text-[#1A2E1A] dark:text-[#F7FAF4] group-hover:text-primary transition-colors leading-snug mb-2">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
           TESTIMONIALS MARQUEE
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-slate-900 overflow-hidden border-t border-slate-100 dark:border-slate-800">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#1B5E20] dark:text-[#4CAF50] font-bold text-xs px-4 py-1.5 rounded-full mb-4">
              <Star className="w-3.5 h-3.5 fill-current" />
              {lang === 'mr' ? 'शेतकऱ्यांचे अनुभव' : lang === 'hi' ? 'किसानों के अनुभव' : 'What Farmers Say'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A2E1A] dark:text-[#F7FAF4] mb-3">
              {lang === 'mr' ? '५ ⭐ रेटिंग – शेतकऱ्यांच्या मुखातून' : lang === 'hi' ? '5 ⭐ रेटिंग – किसानों की जुबान से' : 'Real Stories from Real Farmers'}
            </h2>
          </div>
        </ScrollReveal>

        {/* Marquee Row 1 - forward */}
        <div className="relative overflow-hidden mb-4">
          <div className="absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-white dark:from-slate-900 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white dark:from-slate-900 to-transparent pointer-events-none"></div>
          <div className="animate-marquee gap-4">
            {[
              { name: 'Ramesh Patil', location: lang === 'mr' ? 'नाशिक' : 'Nashik', msg: lang === 'mr' ? 'या ॲपमुळे माझे सोयाबीनचे उत्पन्न ३०% वाढले! हवामान इशारे खूपच उपयोगी आहेत.' : 'This app increased my soybean yield by 30%! The weather alerts are super helpful.', crop: '🌱 Soybean' },
              { name: 'Sunita Deshpande', location: lang === 'mr' ? 'पुणे' : 'Pune', msg: lang === 'mr' ? 'खत फवारणीचे वेळापत्रक आता आपोआप मिळते. पैशांची बचत झाली आणि कामही कमी झाले.' : 'Fertilizer schedules are now automatic. Saved money and reduced manual work.', crop: '🌾 Wheat' },
              { name: 'Vijay Shinde', location: lang === 'mr' ? 'कोल्हापूर' : 'Kolhapur', msg: lang === 'mr' ? 'जवळच्या कृषी केंद्रात युरिया आहे का हे घरूनच तपासता येते. खूप छान!' : 'I can check urea availability at nearby shops from home. Amazing feature!', crop: '🌽 Corn' },
              { name: 'Priya Kulkarni', location: lang === 'mr' ? 'सांगली' : 'Sangli', msg: lang === 'mr' ? 'मराठीत माहिती मिळाल्यामुळे वापर सोपा झाला. माझ्या आईलाही वापरता आले.' : 'Information in Marathi made it easy to use. Even my mother uses it.', crop: '🍇 Grapes' },
              { name: 'Mahesh Jadhav', location: lang === 'mr' ? 'अहमदनगर' : 'Ahmednagar', msg: lang === 'mr' ? 'रोग नियंत्रणाची माहिती खूप उपयोगाची आहे. तज्ज्ञांचे सल्ले मोफत मिळतात.' : 'Disease control info is very helpful. Expert advice available for free.', crop: '🌿 Sugarcane' },
              { name: 'Lata More', location: lang === 'mr' ? 'औरंगाबाद' : 'Aurangabad', msg: lang === 'mr' ? 'या ॲपने माझी शेती डिजिटल केली. आता नोंदी ठेवणे सोपे झाले आहे.' : 'This app digitized my farming. Keeping records is now much easier.', crop: '🌻 Sunflower' },
            ].concat([
              { name: 'Ramesh Patil', location: lang === 'mr' ? 'नाशिक' : 'Nashik', msg: lang === 'mr' ? 'या ॲपमुळे माझे सोयाबीनचे उत्पन्न ३०% वाढले! हवामान इशारे खूपच उपयोगी आहेत.' : 'This app increased my soybean yield by 30%! The weather alerts are super helpful.', crop: '🌱 Soybean' },
              { name: 'Sunita Deshpande', location: lang === 'mr' ? 'पुणे' : 'Pune', msg: lang === 'mr' ? 'खत फवारणीचे वेळापत्रक आता आपोआप मिळते. पैशांची बचत झाली आणि कामही कमी झाले.' : 'Fertilizer schedules are now automatic. Saved money and reduced manual work.', crop: '🌾 Wheat' },
              { name: 'Vijay Shinde', location: lang === 'mr' ? 'कोल्हापूर' : 'Kolhapur', msg: lang === 'mr' ? 'जवळच्या कृषी केंद्रात युरिया आहे का हे घरूनच तपासता येते. खूप छान!' : 'I can check urea availability at nearby shops from home. Amazing feature!', crop: '🌽 Corn' },
              { name: 'Priya Kulkarni', location: lang === 'mr' ? 'सांगली' : 'Sangli', msg: lang === 'mr' ? 'मराठीत माहिती मिळाल्यामुळे वापर सोपा झाला. माझ्या आईलाही वापरता आले.' : 'Information in Marathi made it easy to use. Even my mother uses it.', crop: '🍇 Grapes' },
              { name: 'Mahesh Jadhav', location: lang === 'mr' ? 'अहमदनगर' : 'Ahmednagar', msg: lang === 'mr' ? 'रोग नियंत्रणाची माहिती खूप उपयोगाची आहे. तज्ज्ञांचे सल्ले मोफत मिळतात.' : 'Disease control info is very helpful. Expert advice available for free.', crop: '🌿 Sugarcane' },
              { name: 'Lata More', location: lang === 'mr' ? 'औरंगाबाद' : 'Aurangabad', msg: lang === 'mr' ? 'या ॲपने माझी शेती डिजिटल केली. आता नोंदी ठेवणे सोपे झाले आहे.' : 'This app digitized my farming. Keeping records is now much easier.', crop: '🌻 Sunflower' },
            ]).map((t, i) => (
              <div key={i} className="shrink-0 w-80 bg-[#F7FAF4] dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 mx-2 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, si) => <Star key={si} className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />)}
                  <span className="ml-2 text-[10px] font-bold text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-0.5 rounded-full">{t.crop}</span>
                </div>
                <p className="text-sm text-[#1A2E1A]/80 dark:text-slate-300 leading-relaxed font-medium mb-4">"{t.msg}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1B5E20] text-white flex items-center justify-center text-xs font-black">{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-xs font-bold text-[#1A2E1A] dark:text-slate-200">{t.name}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Different Users Section */}
      <section className="py-24 bg-[#1A2E1A] text-[#F7FAF4] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F59E0B]/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-[#F7FAF4]">{t('ecosystemTitle')}</h2>
            <p className="text-xl text-[#F7FAF4]/70">{t('ecosystemDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                role: 'farmer',
                icon: <Tractor className="w-12 h-12 text-[#1B5E20] dark:text-[#4CAF50] mb-6" />,
                title: t('forFarmers'),
                bullets: [t('farmerBullet1'), t('farmerBullet2'), t('farmerBullet3')],
                desc: i18n.language === 'mr' 
                  ? 'स्मार्ट कृषी मित्र शेतकऱ्यांना वैज्ञानिक आणि आधुनिक शेती तंत्रज्ञान वापरण्यास मदत करते. तुमच्या पिकांची नोंद ठेवा, तज्ज्ञांचा सल्ला घ्या आणि आवश्यक वस्तू सहज मिळवा.'
                  : i18n.language === 'hi' 
                  ? 'स्मार्ट कृषि मित्र किसानों को वैज्ञानिक और आधुनिक कृषि तकनीक अपनाने में मदद करता है। अपनी फसलों का रिकॉर्ड रखें, विशेषज्ञों से सलाह लें और आवश्यक सामग्री आसानी से प्राप्त करें।'
                  : 'Smart Krushi Mitra helps farmers adopt scientific and modern agriculture techniques. Track your crop cycles, consult experts, and find resources easily.',
                steps: [
                  {
                    title: i18n.language === 'mr' ? '१. नोंदणी पूर्ण करा' : i18n.language === 'hi' ? '१. पंजीकरण पूरा करें' : '1. Complete Registration',
                    desc: i18n.language === 'mr' ? 'तुमचा मोबाईल नंबर वापरून शेतकरी म्हणून नोंदणी करा आणि आपला जिल्हा निवडा.' : i18n.language === 'hi' ? 'अपने मोबाइल नंबर का उपयोग करके किसान के रूप में पंजीकरण करें और अपना जिला चुनें।' : 'Register as a Farmer with your phone number and choose your district.'
                  },
                  {
                    title: i18n.language === 'mr' ? '२. पिकाची नोंदणी करा' : i18n.language === 'hi' ? '२. फसल की जानकारी दर्ज करें' : '2. Add Crop Records',
                    desc: i18n.language === 'mr' ? 'तुमच्या पिकाची माहिती (उदा. सोयाबीन, गहू), पेरणीची तारीख आणि क्षेत्र जोडून स्वयंचलित पीक वेळापत्रक मिळवा.' : i18n.language === 'hi' ? 'अपनी फसल का विवरण (जैसे सोयाबीन, गेहूं), बुवाई की तारीख और क्षेत्र जोड़कर स्वचालित फसल कैलेंडर प्राप्त करें।' : 'Add your crop details, sowing date, and area to automatically generate a step-by-step crop calendar.'
                  },
                  {
                    title: i18n.language === 'mr' ? '३. स्मार्ट शेती आणि खरेदी' : i18n.language === 'hi' ? '३. स्मार्ट खेती और खरीदारी' : '3. Smart Farming & Purchases',
                    desc: i18n.language === 'mr' ? 'दररोज एआय (AI) पीक सल्ला, हवामान इशारे मिळवा आणि थेट जवळील अधिकृत दुकानांमध्ये खतांचा साठा तपासा.' : i18n.language === 'hi' ? 'दैनिक एआई फसल सलाह, मौसम की चेतावनी प्राप्त करें और सीधे नजदीकी अधिकृत दुकानों में उर्वरकों का स्टॉक जांचें।' : 'Check daily AI crop advices, localized weather warnings, and direct fertilizer availability at nearby authorized shops.'
                  }
                ]
              },
              {
                role: 'shop_owner',
                icon: <Sprout className="w-12 h-12 text-[#1B5E20] dark:text-[#4CAF50] mb-6" />,
                title: t('forShopOwners'),
                bullets: [t('shopBullet1'), t('shopBullet2'), t('shopBullet3')],
                desc: i18n.language === 'mr' 
                  ? 'तुमचे कृषी सेवा केंद्र ऑनलाईन आणा. खते, बियाणे आणि औषधांचा साठा मॅनेज करा आणि परिसरातील शेतकऱ्यांशी थेट संपर्क साधा.'
                  : i18n.language === 'hi' 
                  ? 'अपनी कृषि खुदरा दुकान को ऑनलाइन लाएं। उर्वरक, बीज और कीटनाशकों के स्टॉक का प्रबंधन करें और स्थानीय किसानों से सीधे जुड़ें।'
                  : 'Put your agriculture retail store online. Manage your inventory of seeds, fertilizers, and pesticides, and let nearby farmers contact you directly.',
                steps: [
                  {
                    title: i18n.language === 'mr' ? '१. दुकान प्रोफाईल सेट करा' : i18n.language === 'hi' ? '१. दुकान प्रोफाइल सेट करें' : '1. Setup Shop Profile',
                    desc: i18n.language === 'mr' ? 'दुकानदार म्हणून नोंदणी करा, तुमच्या कृषी केंद्राचे नाव, परवाना क्रमांक आणि पत्ता नोंदवा.' : i18n.language === 'hi' ? 'दुकानदार के रूप में पंजीकरण करें, अपने कृषि केंद्र का नाम, लाइसेंस नंबर और पता दर्ज करें।' : 'Register as a Shop Owner, enter your business name, license numbers, and shop location.'
                  },
                  {
                    title: i18n.language === 'mr' ? '२. साठा ऑनलाईन नोंदवा' : i18n.language === 'hi' ? '२. स्टॉक दर्ज करें' : '2. List Live Stock',
                    desc: i18n.language === 'mr' ? 'तुमच्याकडे उपलब्ध असलेला खतांचा (युरिया, डीएपी) आणि बियाणांचा साठा दर व प्रमाणासह ऑनलाईन अपडेट करा.' : i18n.language === 'hi' ? 'अपने पास उपलब्ध उर्वरकों (यूरिया, डीएपी) और बीजों का स्टॉक दरों और मात्रा के साथ ऑनलाइन अपडेट करें।' : 'Update your inventory of fertilizers and seeds with real-time stock levels and market rates.'
                  },
                  {
                    title: i18n.language === 'mr' ? '३. शेतकऱ्यांशी संपर्क वाढवा' : i18n.language === 'hi' ? '३. किसानों से जुड़ें' : '3. Connect with Farmers',
                    desc: i18n.language === 'mr' ? 'परिसरातील शेतकरी थेट तुमच्या दुकानातील साठा आणि किंमती पाहून तुमच्याशी फोनवर संपर्क साधू शकतात.' : i18n.language === 'hi' ? 'आसपास के किसान सीधे आपकी दुकान में स्टॉक और कीमतें देखकर आपसे फोन पर संपर्क कर सकते हैं।' : 'Nearby farmers searching for materials can see your stock, prices, contact number, and drive directly to your store.'
                  }
                ]
              }
            ].map((ecoCard, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveEcosystemCard(ecoCard)}
                className="bg-[#F7FAF4] dark:bg-slate-900 border border-[#4CAF50]/20 dark:border-slate-800 p-8 rounded-3xl hover:bg-[#eef5e6] dark:hover:bg-slate-800/80 transition-all duration-300 text-left shadow-md hover:shadow-xl hover:-translate-y-1.5 cursor-pointer"
              >
                {ecoCard.icon}
                <h3 className="text-2xl font-bold mb-4 text-[#1A2E1A] dark:text-[#F7FAF4]">{ecoCard.title}</h3>
                <ul className="space-y-3 text-[#1A2E1A]/80 dark:text-slate-350">
                  {ecoCard.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#1B5E20] dark:text-[#4CAF50]" /> {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
           LIVE CROP PRICE TICKER
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1A2E1A] border-y border-[#4CAF50]/20 py-0 overflow-hidden">
        <div className="flex items-center">
          {/* Label Badge */}
          <div className="shrink-0 bg-[#4CAF50] text-white text-xs font-black px-4 py-3 flex items-center gap-2 z-10">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            {lang === 'mr' ? 'बाजारभाव' : lang === 'hi' ? 'मंडी भाव' : 'MANDI PRICE'}
          </div>
          {/* Scrolling Ticker */}
          <div className="overflow-hidden flex-1 relative">
            <div className="animate-marquee py-3">
              {[
                { crop: '🌱 Soybean',   mr: 'सोयाबीन',   price: '₹4,850', change: '+2.1%', up: true },
                { crop: '🌾 Wheat',     mr: 'गहू',        price: '₹2,280', change: '+0.8%', up: true },
                { crop: '🌽 Corn',      mr: 'मक्का',      price: '₹1,920', change: '-1.2%', up: false },
                { crop: '🌿 Cotton',    mr: 'कापूस',      price: '₹6,740', change: '+3.4%', up: true },
                { crop: '🍅 Tomato',    mr: 'टोमॅटो',    price: '₹1,150', change: '-2.8%', up: false },
                { crop: '🧅 Onion',     mr: 'कांदा',      price: '₹2,340', change: '+5.6%', up: true },
                { crop: '🫘 Chickpea',  mr: 'हरभरा',      price: '₹5,120', change: '+1.3%', up: true },
                { crop: '🌻 Sunflower', mr: 'सूर्यफूल',  price: '₹5,680', change: '+0.5%', up: true },
                { crop: '🌶️ Chilli',   mr: 'मिरची',      price: '₹8,200', change: '-0.9%', up: false },
                { crop: '🫚 Groundnut', mr: 'भुईमूग',     price: '₹5,450', change: '+2.7%', up: true },
              ].concat([
                { crop: '🌱 Soybean',   mr: 'सोयाबीन',   price: '₹4,850', change: '+2.1%', up: true },
                { crop: '🌾 Wheat',     mr: 'गहू',        price: '₹2,280', change: '+0.8%', up: true },
                { crop: '🌽 Corn',      mr: 'मक्का',      price: '₹1,920', change: '-1.2%', up: false },
                { crop: '🌿 Cotton',    mr: 'कापूस',      price: '₹6,740', change: '+3.4%', up: true },
                { crop: '🍅 Tomato',    mr: 'टोमॅटो',    price: '₹1,150', change: '-2.8%', up: false },
                { crop: '🧅 Onion',     mr: 'कांदा',      price: '₹2,340', change: '+5.6%', up: true },
                { crop: '🫘 Chickpea',  mr: 'हरभरा',      price: '₹5,120', change: '+1.3%', up: true },
                { crop: '🌻 Sunflower', mr: 'सूर्यफूल',  price: '₹5,680', change: '+0.5%', up: true },
                { crop: '🌶️ Chilli',   mr: 'मिरची',      price: '₹8,200', change: '-0.9%', up: false },
                { crop: '🫚 Groundnut', mr: 'भुईमूग',     price: '₹5,450', change: '+2.7%', up: true },
              ]).map((item, i) => (
                <div key={i} className="shrink-0 flex items-center gap-3 mx-6 text-white">
                  <span className="text-base">{item.crop.split(' ')[0]}</span>
                  <span className="font-bold text-sm">{lang === 'mr' ? item.mr : item.crop.split(' ').slice(1).join(' ')}</span>
                  <span className="font-black text-white">{item.price}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${item.up ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {item.change}
                  </span>
                  <span className="text-white/20 text-lg ml-2">|</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
           LIVE WEATHER ALERT TICKER
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#2D0A0A] border-b border-red-500/20 py-0 overflow-hidden">
        <div className="flex items-center">
          {/* Label Badge */}
          <div className="shrink-0 bg-[#D32F2F] text-white text-xs font-black px-4 py-3 flex items-center gap-2 z-10">
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
            <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
            {lang === 'mr' ? 'हवामान इशारा' : lang === 'hi' ? 'मौसम चेतावनी' : 'WEATHER ALERT'}
          </div>
          {/* Scrolling Ticker */}
          <div className="overflow-hidden flex-1 relative">
            <div className="animate-marquee py-3 flex whitespace-nowrap">
              {[
                {
                  mr: '🌦️ पुणे: पुढील २४ तासांत मुसळधार पावसाची शक्यता. काढणी केलेले पीक सुरक्षित ठिकाणी ठेवा.',
                  hi: '🌦️ पुणे: अगले 24 घंटों में भारी बारिश की संभावना। कटी हुई फसलों को सुरक्षित रखें।',
                  en: '🌦️ Pune: Heavy rainfall expected in the next 24 hours. Keep harvested crops safe.'
                },
                {
                  mr: '💨 नाशिक: ताशी ४० किमी वेगाने वारे वाहण्याची शक्यता. औषध फवारणी टाळावी.',
                  hi: '💨 नाशिक: 40 किमी/घंटा की रफ्तार से तेज हवाएं। कीटनाशक छिड़काव से बचें।',
                  en: '💨 Nashik: Strong winds up to 40 km/h. Avoid spraying pesticides.'
                },
                {
                  mr: '🌧️ कोल्हापूर: मध्यम ते मुसळधार पाऊस. शेतातून पाण्याचा निचरा योग्य ठेवा.',
                  hi: '🌧️ कोल्हापुर: मध्यम से भारी बारिश। खेतों में जल निकासी की उचित व्यवस्था करें।',
                  en: '🌧️ Kolhapur: Moderate to heavy rain showers. Ensure proper field drainage.'
                },
                {
                  mr: '☀️ नागपूर: तीव्र उष्णतेचा इशारा. जनावरांना सावलीत ठेवा व पिकांना पाणी द्या.',
                  hi: '☀️ नागपुर: अत्यधिक गर्मी की चेतावनी। पशुधन को छांव में रखें और फसलों की सिंचाई करें।',
                  en: '☀️ Nagpur: High temperature warning. Keep livestock in shade and irrigate crops.'
                }
              ].concat([
                {
                  mr: '🌦️ पुणे: पुढील २४ तासांत मुसळधार पावसाची शक्यता. काढणी केलेले पीक सुरक्षित ठिकाणी ठेवा.',
                  hi: '🌦️ पुणे: अगले 24 घंटों में भारी बारिश की संभावना। कटी हुई फसलों को सुरक्षित रखें।',
                  en: '🌦️ Pune: Heavy rainfall expected in the next 24 hours. Keep harvested crops safe.'
                },
                {
                  mr: '💨 नाशिक: ताशी ४० किमी वेगाने वारे वाहण्याची शक्यता. औषध फवारणी टाळावी.',
                  hi: '💨 नाशिक: 40 किमी/घंटा की रफ्तार से तेज हवाएं। कीटनाशक छिड़काव से बचें।',
                  en: '💨 Nashik: Strong winds up to 40 km/h. Avoid spraying pesticides.'
                },
                {
                  mr: '🌧️ कोल्हापूर: मध्यम ते मुसळधार पाऊस. शेतातून पाण्याचा निचरा योग्य ठेवा.',
                  hi: '🌧️ कोल्हापुर: मध्यम से भारी बारिश। खेतों में जल निकासी की उचित व्यवस्था करें।',
                  en: '🌧️ Kolhapur: Moderate to heavy rain showers. Ensure proper field drainage.'
                },
                {
                  mr: '☀️ नागपूर: तीव्र उष्णतेचा इशारा. जनावरांना सावलीत ठेवा व पिकांना पाणी द्या.',
                  hi: '☀️ नागपुर: अत्यधिक गर्मी की चेतावनी। पशुधन को छांव में रखें और फसलों की सिंचाई करें।',
                  en: '☀️ Nagpur: High temperature warning. Keep livestock in shade and irrigate crops.'
                }
              ]).map((item, i) => (
                <div key={i} className="shrink-0 flex items-center gap-3 mx-8 text-red-100 font-medium text-sm">
                  <span>{lang === 'mr' ? item.mr : lang === 'hi' ? item.hi : item.en}</span>
                  <span className="text-red-500/30 text-lg ml-4">|</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
           FAQ ACCORDION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#F7FAF4] dark:bg-slate-950 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#1B5E20] dark:text-[#4CAF50] font-bold text-xs px-4 py-1.5 rounded-full mb-4">
                <HelpCircle className="w-3.5 h-3.5" />
                {lang === 'mr' ? 'सामान्य प्रश्न' : lang === 'hi' ? 'सामान्य प्रश्न' : 'FAQ'}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[#1A2E1A] dark:text-[#F7FAF4] mb-3">
                {lang === 'mr' ? 'नेहमी विचारले जाणारे प्रश्न' : lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {lang === 'mr' ? 'तुमच्या मनातील प्रश्नांची उत्तरे येथे मिळवा.' : lang === 'hi' ? 'अपने मन के सवालों के जवाब यहाँ पाएं।' : 'Got questions? We have answers.'}
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {[
              {
                q: lang === 'mr' ? 'स्मार्ट कृषी मित्र वापरणे पूर्णपणे विनामूल्य आहे का?' : lang === 'hi' ? 'क्या स्मार्ट कृषि मित्र का उपयोग पूरी तरह मुफ्त है?' : 'Is Smart Krushi Mitra completely free to use?',
                a: lang === 'mr' ? 'होय! स्मार्ट कृषी मित्र शेतकरी आणि दुकानदार दोघांसाठी पूर्णपणे विनामूल्य आहे. नोंदणी, पीक वेळापत्रक, हवामान अंदाज आणि तज्ज्ञ सल्ला — सर्व सुविधा मोफत उपलब्ध आहेत.' : lang === 'hi' ? 'हाँ! स्मार्ट कृषि मित्र किसानों और दुकानदारों दोनों के लिए पूरी तरह मुफ्त है। पंजीकरण, फसल कैलेंडर, मौसम पूर्वानुमान और विशेषज्ञ सलाह — सभी सुविधाएं मुफ्त उपलब्ध हैं।' : 'Yes! Smart Krushi Mitra is 100% free for both farmers and shop owners. Registration, crop schedules, weather alerts, and expert advice — all features are completely free.',
              },
              {
                q: lang === 'mr' ? 'मला स्मार्टफोन नसेल तर मी हे वापरू शकतो का?' : lang === 'hi' ? 'क्या मैं बिना स्मार्टफोन के इसका उपयोग कर सकता हूं?' : 'Can I use it without a smartphone?',
                a: lang === 'mr' ? 'सध्या स्मार्ट कृषी मित्र वेब ब्राउझरवर उपलब्ध आहे. कोणत्याही Android किंवा iOS स्मार्टफोनच्या Chrome ब्राउझरवर तुम्ही ते वापरू शकता. पुढील काळात मोबाईल अ‍ॅप देखील येणार आहे.' : lang === 'hi' ? 'अभी स्मार्ट कृषि मित्र वेब ब्राउज़र पर उपलब्ध है। किसी भी Android या iOS स्मार्टफोन के Chrome ब्राउज़र पर आप इसका उपयोग कर सकते हैं। भविष्य में मोबाइल ऐप भी आने वाला है।' : 'Currently Smart Krushi Mitra is available on web browsers. You can use it on any Android or iOS smartphone via Chrome browser. A dedicated mobile app is coming soon!',
              },
              {
                q: lang === 'mr' ? 'AI पीक वेळापत्रक कसे तयार होते?' : lang === 'hi' ? 'AI फसल कैलेंडर कैसे बनता है?' : 'How is the AI crop schedule generated?',
                a: lang === 'mr' ? 'तुम्ही पिकाचे नाव, पेरणीची तारीख आणि क्षेत्रफळ टाकले की आमची AI प्रणाली बियाण्यांपासून काढणीपर्यंतचे संपूर्ण वेळापत्रक — खते, फवारणी, पाणी आणि प्रत्येक टप्प्यातील महत्त्वाच्या सूचना — आपोआप तयार करते.' : lang === 'hi' ? 'जब आप फसल का नाम, बुवाई की तारीख और क्षेत्रफल दर्ज करते हैं, तो हमारी AI प्रणाली बीज से कटाई तक का पूरा कार्यक्रम — उर्वरक, छिड़काव, सिंचाई और हर चरण के महत्वपूर्ण निर्देश — स्वचालित रूप से तैयार करती है।' : 'When you enter your crop name, sowing date, and field size, our AI system automatically generates a complete schedule from seed to harvest — including fertilizers, sprays, irrigation, and important alerts at every growth stage.',
              },
              {
                q: lang === 'mr' ? 'माझा डेटा सुरक्षित आहे का?' : lang === 'hi' ? 'क्या मेरा डेटा सुरक्षित है?' : 'Is my data safe and private?',
                a: lang === 'mr' ? 'हो! तुमची सर्व माहिती — मोबाईल नंबर, पीक माहिती आणि शेत डेटा — पूर्णपणे एनक्रिप्टेड आणि सुरक्षित आहे. आम्ही कधीही तुमचा डेटा तृतीय पक्षाला विकत नाही.' : lang === 'hi' ? 'हाँ! आपकी सभी जानकारी — मोबाइल नंबर, फसल जानकारी और खेत डेटा — पूरी तरह एन्क्रिप्टेड और सुरक्षित है। हम कभी भी आपका डेटा तीसरे पक्ष को नहीं बेचते।' : 'Yes! All your information — phone number, crop data, and farm details — is fully encrypted and secured. We never sell your data to any third party.',
              },
              {
                q: lang === 'mr' ? 'दुकानदार म्हणून नोंदणी करण्यासाठी काय लागते?' : lang === 'hi' ? 'दुकानदार के रूप में पंजीकरण के लिए क्या चाहिए?' : 'What do I need to register as a Shop Owner?',
                a: lang === 'mr' ? 'दुकानदार म्हणून नोंदणी करण्यासाठी तुमचे दुकानाचे नाव, कृषी परवाना क्रमांक, पत्ता आणि मोबाईल नंबर लागतो. नोंदणी केल्यानंतर प्रशासकाकडून मंजुरी मिळाल्यावर दुकान लाईव्ह होते.' : lang === 'hi' ? 'दुकानदार के रूप में पंजीकरण के लिए आपकी दुकान का नाम, कृषि लाइसेंस नंबर, पता और मोबाइल नंबर चाहिए। पंजीकरण के बाद प्रशासक से मंजूरी मिलने पर दुकान लाइव हो जाती है।' : 'To register as a Shop Owner, you need your shop name, agriculture license number, address, and mobile number. After registration, your shop goes live once approved by our admin.',
              },
              {
                q: lang === 'mr' ? 'हवामान इशारे किती अचूक असतात?' : lang === 'hi' ? 'मौसम अलर्ट कितने सटीक होते हैं?' : 'How accurate are the weather alerts?',
                a: lang === 'mr' ? 'आम्ही IMD (भारतीय हवामान विभाग) आणि OpenWeather API डेटा वापरतो. तुमच्या जिल्ह्यासाठी ३ ते ५ दिवसांचा अचूक अंदाज मिळतो आणि पावसाचा धोका असल्यास फवारणी न करण्याची स्वयंचलित सूचना येते.' : lang === 'hi' ? 'हम IMD (भारतीय मौसम विभाग) और OpenWeather API डेटा का उपयोग करते हैं। आपके जिले के लिए 3 से 5 दिनों का सटीक पूर्वानुमान मिलता है और बारिश का खतरा होने पर छिड़काव न करने की स्वचालित सूचना आती है।' : 'We use IMD (India Meteorological Department) and OpenWeather API data. You get accurate 3-5 day forecasts for your district, and automatic alerts are sent if rain risk is detected to avoid spray wash-off.',
              },
            ].map((faq, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left group cursor-pointer"
                  >
                    <span className="font-bold text-[#1A2E1A] dark:text-white pr-4 text-sm md:text-base leading-snug group-hover:text-[#1B5E20] dark:group-hover:text-[#4CAF50] transition-colors">
                      {faq.q}
                    </span>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openFaq === i
                        ? 'bg-[#1B5E20] text-white rotate-180'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>
                  <div
                    style={{
                      maxHeight: openFaq === i ? '300px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.4s cubic-bezier(0.2,0.8,0.2,1)'
                    }}
                  >
                    <div className="px-6 pb-6">
                      <div className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>


        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
           CTA SECTION — Vibrant Gradient with Animated Background
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d3b18] via-[#1B5E20] to-[#2d5a0e]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '28px 28px' }}></div>
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#4CAF50]/20 rounded-full blur-[100px] animate-pulse-glow"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-[100px] animate-pulse-glow [animation-delay:3s]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <ScrollReveal>
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 font-bold text-xs px-5 py-2 rounded-full mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-ping"></span>
              {lang === 'mr' ? 'आजच सुरू करा – विनामूल्य' : lang === 'hi' ? 'आज शुरू करें – मुफ्त' : 'Start Today — Completely Free'}
            </span>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              {getDynamicText('cta_title') || (
                <>
                  {lang === 'mr' ? 'तुमची शेती' : lang === 'hi' ? 'आपकी खेती को' : 'Transform Your'}{' '}
                  <span className="text-gradient-green">
                    {lang === 'mr' ? 'बदला' : lang === 'hi' ? 'बदलें' : 'Farming'}
                  </span>
                  <br />
                  {lang === 'mr' ? 'आजपासूनच!' : lang === 'hi' ? 'आज से ही!' : 'Starting Today!'}
                </>
              )}
            </h2>
            <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              {getDynamicText('cta_description') || t('ctaDesc') || 'Join thousands of farmers who are already increasing their yield and profits with Smart Krushi Mitra.'}
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowRoleModal(true)}
                className="btn-shimmer group inline-flex items-center gap-3 bg-white text-[#1B5E20] font-black text-lg px-10 py-5 rounded-2xl shadow-2xl hover:shadow-white/20 transition-all hover:-translate-y-1.5 hover:scale-105 cursor-pointer"
              >
                <Sprout className="w-6 h-6" />
                {t('ctaBtn')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-bold text-lg px-8 py-5 rounded-2xl hover:bg-white/20 backdrop-blur-sm transition-all hover:-translate-y-1 cursor-pointer"
              >
                {t('login')}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
              {[
                { icon: '🔒', text: lang === 'mr' ? '१०० % सुरक्षित' : '100% Secure' },
                { icon: '⚡', text: lang === 'mr' ? 'झटपट सेटअप' : 'Quick Setup' },
                { icon: '🌐', text: lang === 'mr' ? 'मराठी / हिंदी / English' : 'Marathi / Hindi / English' },
                { icon: '💚', text: lang === 'mr' ? 'विनामूल्य' : 'Free Forever' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-white/60 text-sm font-semibold">
                  <span className="text-lg">{badge.icon}</span>{badge.text}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
           RICH MULTI-COLUMN FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0d1f0e] text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Top grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-[#4CAF50] rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black">{t('appName')}</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                {lang === 'mr'
                  ? 'भारतीय शेतकऱ्यांना डिजिटल तंत्रज्ञानाने सशक्त करणे. पेरणीपासून काढणीपर्यंत तुमचा विश्वासू साथी.'
                  : lang === 'hi'
                  ? 'भारतीय किसानों को डिजिटल तकनीक से सशक्त बनाना। बुवाई से कटाई तक आपका विश्वसनीय साथी।'
                  : 'Empowering Indian farmers with digital technology. Your trusted companion from sowing to harvest.'}
              </p>
              {/* App download badges */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 w-fit cursor-pointer hover:bg-white/12 transition-colors">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="text-[10px] text-white/50 font-medium">{lang === 'mr' ? 'लवकरच येत आहे' : 'Coming Soon'}</p>
                    <p className="text-sm font-bold">Android App</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/8 border border-white/10 rounded-xl px-4 py-2.5 w-fit cursor-pointer hover:bg-white/12 transition-colors">
                  <span className="text-2xl">🍎</span>
                  <div>
                    <p className="text-[10px] text-white/50 font-medium">{lang === 'mr' ? 'लवकरच येत आहे' : 'Coming Soon'}</p>
                    <p className="text-sm font-bold">iOS App</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-white/40 mb-5">
                {lang === 'mr' ? 'जलद दुवे' : lang === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
              </h4>
              <ul className="space-y-3">
                {[
                  { label: lang === 'mr' ? 'मुख्यपृष्ठ' : lang === 'hi' ? 'होम' : 'Home', to: '/' },
                  { label: lang === 'mr' ? 'डॅशबोर्ड' : lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard', to: '/dashboard' },
                  { label: lang === 'mr' ? 'लॉगिन' : lang === 'hi' ? 'लॉगिन' : 'Login', to: '/login' },
                  { label: lang === 'mr' ? 'नोंदणी करा' : lang === 'hi' ? 'पंजीकरण' : 'Register', to: '/register' },
                  { label: lang === 'mr' ? 'सूचना' : lang === 'hi' ? 'सूचनाएं' : 'Notifications', to: '/notifications' },
                ].map((link, i) => (
                  <li key={i}>
                    <Link to={link.to} className="text-sm text-white/55 hover:text-white font-medium transition-colors flex items-center gap-1.5 group">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-white/40 mb-5">
                {lang === 'mr' ? 'सुविधा' : lang === 'hi' ? 'सुविधाएं' : 'Features'}
              </h4>
              <ul className="space-y-3">
                {[
                  { label: lang === 'mr' ? 'AI पीक वेळापत्रक' : 'AI Crop Schedule', icon: '📅' },
                  { label: lang === 'mr' ? 'हवामान इशारे' : 'Weather Alerts', icon: '🌦️' },
                  { label: lang === 'mr' ? 'जवळची दुकाने' : 'Nearby Shops', icon: '🏪' },
                  { label: lang === 'mr' ? 'रोग नियंत्रण' : 'Disease Control', icon: '🔬' },
                  { label: lang === 'mr' ? 'बाजारभाव' : 'Market Prices', icon: '📊' },
                  { label: lang === 'mr' ? 'तज्ज्ञ सल्ला' : 'Expert Advice', icon: '👨‍🌾' },
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors cursor-default">
                    <span>{feat.icon}</span>{feat.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-white/40 mb-5">
                {lang === 'mr' ? 'संपर्क' : lang === 'hi' ? 'संपर्क' : 'Contact'}
              </h4>
              <div className="space-y-4">
                <a href="tel:+919876543210" className="flex items-center gap-3 text-sm text-white/55 hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center group-hover:bg-[#4CAF50]/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  +91 98765 43210
                </a>
                <a href="mailto:support@smartkrushimitra.com" className="flex items-center gap-3 text-sm text-white/55 hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center group-hover:bg-[#4CAF50]/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="break-all">support@smartkrushimitra.com</span>
                </a>
                <div className="flex items-center gap-3 text-sm text-white/55">
                  <div className="w-8 h-8 bg-white/8 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  {lang === 'mr' ? 'पुणे, महाराष्ट्र, भारत' : 'Pune, Maharashtra, India'}
                </div>
              </div>

              {/* Language pills */}
              <div className="mt-6">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">{lang === 'mr' ? 'भाषा' : 'Languages'}</p>
                <div className="flex gap-2 flex-wrap">
                  {['मराठी', 'हिंदी', 'English'].map((l, i) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full bg-white/8 border border-white/10 text-white/60">{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#4CAF50]" />
              <p className="text-white/35 text-xs font-medium">{t('footerText')}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-white/35 font-medium">
                <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-pulse"></span>
                {lang === 'mr' ? 'सिस्टम सक्रिय' : lang === 'hi' ? 'सिस्टम सक्रिय' : 'System Active'}
              </span>
              <span className="text-white/20">|</span>
              <span className="text-xs text-white/35">
                {lang === 'mr' ? 'शेतकऱ्यांसाठी बनवले ❤️' : lang === 'hi' ? 'किसानों के लिए बनाया ❤️' : 'Made with ❤️ for Farmers'}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-3xl w-full border border-slate-100 dark:border-slate-800 overflow-hidden relative p-8 md:p-12 animate-in fade-in zoom-in-95 duration-200">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4CAF50]/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F59E0B]/5 rounded-full blur-3xl -z-10"></div>

            {/* Close Button */}
            <button 
              onClick={() => setShowRoleModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-10">
              <Sprout className="w-12 h-12 text-[#2E7D32] dark:text-[#A5D6A7] mx-auto" />
              <h3 className="text-3xl md:text-4xl font-black text-[#1A2E1A] dark:text-[#F7FAF4] mt-4 tracking-tight">
                {i18n.language === 'mr' ? 'नोंदणी सुरू करा' : i18n.language === 'hi' ? 'पंजीकरण शुरू करें' : 'Get Started'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {i18n.language === 'mr' ? 'नोंदणी करण्यासाठी खालीलपैकी तुमची योग्य भूमिका निवडा' : i18n.language === 'hi' ? 'पंजीकरण करने के लिए नीचे दी गई अपनी भूमिका चुनें' : 'Choose your role to create a personalized account'}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Farmer Card */}
              <Link 
                to="/register?role=farmer"
                onClick={() => setShowRoleModal(false)}
                className="group p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 hover:border-[#4CAF50] hover:shadow-xl hover:shadow-[#4CAF50]/5 transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="w-14 h-14 bg-[#4CAF50]/10 text-[#1B5E20] dark:text-[#4CAF50] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                    <Tractor className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-[#1A2E1A] dark:text-[#F7FAF4] group-hover:text-[#1B5E20] dark:group-hover:text-[#4CAF50] transition-colors">
                    {i18n.language === 'mr' ? 'शेतकरी (Farmer)' : i18n.language === 'hi' ? 'किसान (Farmer)' : 'Farmer'}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                    {i18n.language === 'mr' ? 'AI पीक वेळापत्रक मिळवा, हवामान अंदाज पहा आणि खत साठा तपासा.' : i18n.language === 'hi' ? 'AI फसल अनुसूची प्राप्त करें, मौसम का पूर्वानुमान देखें और उर्वरक स्टॉक की जांच करें।' : 'Get AI crop schedules, check local weather, and view fertilizer stocks.'}
                  </p>
                </div>
                <div className="mt-8 text-sm font-bold text-[#1B5E20] dark:text-[#4CAF50] group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                  {i18n.language === 'mr' ? 'नोंदणी करा' : i18n.language === 'hi' ? 'पंजीकरण करें' : 'Register Now'} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Shop Owner Card */}
              <Link 
                to="/register?role=shop_owner"
                onClick={() => setShowRoleModal(false)}
                className="group p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 hover:border-[#F59E0B] hover:shadow-xl hover:shadow-[#F59E0B]/5 transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="w-14 h-14 bg-[#F59E0B]/10 text-[#F59E0B] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-[#1A2E1A] dark:text-[#F7FAF4] group-hover:text-[#F59E0B] transition-colors">
                    {i18n.language === 'mr' ? 'दुकानदार (Shop Owner)' : i18n.language === 'hi' ? 'दुकानदार (Shop Owner)' : 'Shop Owner'}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                    {i18n.language === 'mr' ? 'खते, बियाणे व औषधांचा साठा मॅनेज करा आणि शेतकऱ्यांना जोडा.' : i18n.language === 'hi' ? 'उर्वरक, बीज और कीटनाशकों का स्टॉक प्रबंधित करें और किसानों को जोड़ें।' : 'Manage seeds, fertilizer, and pesticide stock, and link local farmers.'}
                  </p>
                </div>
                <div className="mt-8 text-sm font-bold text-[#F59E0B] group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                  {i18n.language === 'mr' ? 'नोंदणी करा' : i18n.language === 'hi' ? 'पंजीकरण करें' : 'Register Now'} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Showcase Detail Modal */}
      {activeShowcaseCard && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-4xl w-full border border-slate-100 dark:border-slate-800 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4CAF50]/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F59E0B]/5 rounded-full blur-3xl -z-10"></div>

            {/* Close Button */}
            <button 
              onClick={() => setActiveShowcaseCard(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer z-50 animate-in fade-in"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8">
              {/* Image Column */}
              <div className="md:col-span-5 relative overflow-hidden rounded-2xl aspect-video md:aspect-square shadow-md flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                {activeShowcaseCard.img ? (
                  <img 
                    src={activeShowcaseCard.img} 
                    alt={activeShowcaseCard.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-6 bg-[#4CAF50]/10 text-[#1B5E20] dark:text-[#4CAF50] rounded-3xl mb-4 shadow-inner">
                      <Leaf className="w-16 h-16 animate-pulse" />
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Feature Spotlight</span>
                  </div>
                )}
              </div>

              {/* Details Column */}
              <div className="md:col-span-7 flex flex-col justify-between text-left">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#1A2E1A] dark:text-[#F7FAF4] tracking-tight mb-4">
                    {activeShowcaseCard.title}
                  </h3>
                  <p className="text-[#1A2E1A]/80 dark:text-slate-350 text-sm leading-relaxed mb-6 font-medium">
                    {i18n.language === 'mr' ? activeShowcaseCard.details.mr : i18n.language === 'hi' ? activeShowcaseCard.details.hi : activeShowcaseCard.details.en}
                  </p>

                  <h4 className="text-sm font-bold text-[#1B5E20] dark:text-[#4CAF50] uppercase tracking-wider mb-3">
                    {i18n.language === 'mr' ? 'प्रमुख फायदे' : i18n.language === 'hi' ? 'मुख्य लाभ' : 'Key Benefits'}
                  </h4>
                  <ul className="space-y-2.5 mb-8">
                    {(i18n.language === 'mr' ? activeShowcaseCard.benefits.mr : i18n.language === 'hi' ? activeShowcaseCard.benefits.hi : activeShowcaseCard.benefits.en).map((benefit: string, bIdx: number) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-slate-650 dark:text-slate-400 text-sm font-medium">
                        <ShieldCheck className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setActiveShowcaseCard(null)}
                    className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-500 rounded-xl text-slate-500 hover:text-slate-750 dark:text-slate-400 dark:hover:text-slate-250 font-bold transition-all cursor-pointer text-sm"
                  >
                    {i18n.language === 'mr' ? 'बंद करा' : i18n.language === 'hi' ? 'बंद करें' : 'Close'}
                  </button>
                  {profile ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setActiveShowcaseCard(null)}
                      className="inline-flex items-center gap-1.5 bg-[#1B5E20] hover:bg-[#124115] text-[#F7FAF4] font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-[#1B5E20]/20 transition-all cursor-pointer"
                    >
                      {i18n.language === 'mr' ? 'डॅशबोर्डवर जा' : i18n.language === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'} <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveShowcaseCard(null);
                        setShowRoleModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#1B5E20] hover:bg-[#124115] text-[#F7FAF4] font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-[#1B5E20]/20 transition-all cursor-pointer"
                    >
                      {i18n.language === 'mr' ? 'नोंदणी करा' : i18n.language === 'hi' ? 'पंजीकरण करें' : 'Register Now'} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ecosystem Detail Modal */}
      {activeEcosystemCard && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-3xl w-full border border-slate-100 dark:border-slate-800 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 p-8 md:p-12">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4CAF50]/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F59E0B]/5 rounded-full blur-3xl -z-10"></div>

            {/* Close Button */}
            <button 
              onClick={() => setActiveEcosystemCard(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-605 dark:hover:text-slate-200 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer z-50 animate-in fade-in"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-left">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-[#4CAF50]/10 text-[#1B5E20] dark:text-[#4CAF50] rounded-2xl w-fit shadow-inner">
                  {activeEcosystemCard.role === 'farmer' ? <Tractor className="w-8 h-8" /> : <Sprout className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#1A2E1A] dark:text-[#F7FAF4] tracking-tight">
                    {activeEcosystemCard.title}
                  </h3>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {i18n.language === 'mr' ? 'स्मार्ट कृषी मित्र परिसंस्था' : i18n.language === 'hi' ? 'स्मार्ट कृषि मित्र पारिस्थितिकी तंत्र' : 'Smart Krushi Mitra Ecosystem'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-[#1A2E1A]/80 dark:text-slate-350 text-sm leading-relaxed mb-8 font-semibold">
                {activeEcosystemCard.desc}
              </p>

              {/* Steps Checklist */}
              <h4 className="text-sm font-bold text-[#1B5E20] dark:text-[#4CAF50] uppercase tracking-wider mb-4">
                {i18n.language === 'mr' ? 'कार्यपद्धती आणि टप्पे' : i18n.language === 'hi' ? 'कार्यप्रणाली और चरण' : 'How It Works / Steps'}
              </h4>
              
              <div className="space-y-4 mb-8">
                {activeEcosystemCard.steps.map((step: any, sIdx: number) => (
                  <div key={sIdx} className="p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-4 items-start shadow-sm">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#1B5E20] text-white flex items-center justify-center font-bold text-sm">
                      {sIdx + 1}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-[#1A2E1A] dark:text-slate-100 text-sm mb-1">{step.title}</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveEcosystemCard(null)}
                  className="px-6 py-3 border border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-500 rounded-xl text-slate-500 hover:text-slate-750 dark:text-slate-400 dark:hover:text-slate-250 font-bold transition-all cursor-pointer text-sm"
                >
                  {i18n.language === 'mr' ? 'बंद करा' : i18n.language === 'hi' ? 'बंद करें' : 'Close'}
                </button>
                {profile ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setActiveEcosystemCard(null)}
                    className="inline-flex items-center gap-1.5 bg-[#1B5E20] hover:bg-[#124115] text-[#F7FAF4] font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-[#1B5E20]/20 transition-all cursor-pointer"
                  >
                    {i18n.language === 'mr' ? 'डॅशबोर्डवर जा' : i18n.language === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'} <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to={`/register?role=${activeEcosystemCard.role}`}
                    onClick={() => setActiveEcosystemCard(null)}
                    className="inline-flex items-center gap-1.5 bg-[#1B5E20] hover:bg-[#124115] text-[#F7FAF4] font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-[#1B5E20]/20 transition-all cursor-pointer"
                  >
                    {i18n.language === 'mr' ? 'नोंदणी करा' : i18n.language === 'hi' ? 'पंजीकरण करें' : 'Register Now'} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

