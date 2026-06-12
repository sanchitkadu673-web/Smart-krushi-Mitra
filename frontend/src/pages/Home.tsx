import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import { ShieldCheck, CloudSun, CalendarDays, Sprout, Milestone, HelpCircle, ArrowRight, Leaf, Users, Tractor, BarChart3, Star, MapPin, Building2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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

export const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { profile } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7FAF4] dark:bg-slate-950 font-sans selection:bg-[#4CAF50]/30 text-[#1A2E1A] dark:text-slate-100">
      <Navbar />
      
      {/* Dynamic Hero Section - Lush Forest & Sunlight rays theme */}
      <section className="relative overflow-hidden pt-28 pb-32 px-4 md:px-8 flex flex-col items-center text-center min-h-[95vh] justify-center bg-gradient-to-b from-[#4CAF50]/10 via-[#F7FAF4] to-[#F7FAF4] dark:from-emerald-950/20 dark:to-slate-950">
        
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
            {t('heroGrowPart1')}<span className="text-[#4CAF50]">{t('heroGrowPart2')}</span> <br className="hidden sm:block" />
            {t('heroEarnPart1')}<span className="text-[#F59E0B]">{t('heroEarnPart2')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#1A2E1A]/80 dark:text-slate-350 max-w-2xl leading-relaxed mb-10 font-bold">
            {t('heroDescription') || 'Smart Krushi Mitra is your complete digital farming assistant. Manage crops, get AI-powered schedules, connect with experts, and find nearby agriculture shops.'}
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
        <div className="relative w-full max-w-5xl mx-auto mt-28 z-10 perspective-1000 preserve-3d min-h-[520px] md:min-h-[440px] px-4">
          <div className="absolute inset-x-0 bottom-[-40px] h-32 bg-slate-500/10 dark:bg-black/20 rounded-[4rem] blur-3xl pointer-events-none"></div>
          
          {/* Subtle Green/Amber Background Glows behind the cards */}
          <div className="absolute top-12 left-1/4 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(76,175,80,0.18)_0%,transparent_70%)] rounded-full blur-[60px] animate-pulse pointer-events-none z-0"></div>
          <div className="absolute bottom-8 right-1/4 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_70%)] rounded-full blur-[70px] animate-pulse [animation-delay:2s] pointer-events-none z-0"></div>

          <div className="relative w-full h-full preserve-3d">
            {/* 1. Crop Dashboard Panel (Left/Center) */}
            <div className="relative md:absolute md:left-4 md:top-4 w-full md:w-[58%] bg-white/90 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-premium-3d backdrop-blur-md layer-depth-1 hover:layer-depth-2 transition-all duration-500 z-10 preserve-3d">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#4CAF50]/10 text-[#1B5E20] dark:text-[#4CAF50] rounded-xl flex items-center justify-center shrink-0">
                  <Sprout className="w-6 h-6 animate-float" />
                </div>
                <div className="flex-1 text-left">
                  <div className="h-4 bg-[#1B5E20]/10 dark:bg-slate-700 rounded w-1/3 mb-1.5"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
                <span className="text-xs font-bold text-[#1B5E20] dark:text-[#4CAF50] bg-[#4CAF50]/15 px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
              
              {/* Graph inside Dashboard */}
              <div className="space-y-4">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
                <div className="flex gap-2.5 h-28 items-end pt-2">
                  {[35, 60, 45, 90, 55, 75, 50, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#1B5E20]/5 dark:bg-green-950/20 rounded-t-md relative h-full">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#1B5E20] to-[#4CAF50] rounded-t-md transition-all duration-1000" style={{ height: `${h}%` }}></div>
                    </div>
                  ))}
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
                  <MapPin className="w-4 h-4 text-[#F59E0B]" /> Pune, IN
                </div>
              </div>
            </div>

            {/* 3. Alert Card (Bottom Right, Overlapping with Left Border Accent) */}
            <div className="relative md:absolute md:right-4 md:bottom-4 w-full md:w-[44%] bg-white/95 dark:bg-slate-900/90 p-5 rounded-2xl border-l-4 border-[#4CAF50] border-y border-r border-slate-200/80 dark:border-slate-800 shadow-premium-3d backdrop-blur-md layer-depth-2 hover:layer-depth-3 transition-all duration-500 z-20 flex gap-4 mt-6 md:mt-0 text-left">
              <div className="p-3 bg-[#F59E0B]/10 text-[#F59E0B] rounded-xl h-fit">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2.5 flex-1 py-1">
                <div className="h-4 bg-[#1A2E1A]/10 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
              </div>
            </div>
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

      {/* Features Grid */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative bg-[#F7FAF4] dark:bg-slate-950">
        <div className="absolute top-40 right-0 w-72 h-72 bg-[#4CAF50]/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-black text-[#1A2E1A] dark:text-[#F7FAF4] mb-4">{t('keyFeaturesTitle') || 'Everything you need to succeed'}</h2>
          <p className="text-xl text-[#1A2E1A]/80 dark:text-slate-400">Powerful features designed specifically for the modern Indian farmer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <CalendarDays className="w-8 h-8" />,
              title: t('feat1Title') || 'Smart Schedules',
              desc: t('feat1Desc') || 'AI-generated personalized farming schedules based on your crop and sowing date.',
              color: 'from-[#1B5E20] to-[#4CAF50]',
              bg: 'bg-[#4CAF50]/10'
            },
            {
              icon: <Sprout className="w-8 h-8" />,
              title: t('feat2Title') || 'Crop Management',
              desc: t('feat2Desc') || 'Track every stage of your crop from sowing to harvest with expert guidance.',
              color: 'from-[#1B5E20] to-[#4CAF50]',
              bg: 'bg-[#4CAF50]/10'
            },
            {
              icon: <CloudSun className="w-8 h-8" />,
              title: t('feat3Title') || 'Weather Alerts',
              desc: t('feat3Desc') || 'Real-time hyper-local weather updates and smart farming alerts.',
              color: 'from-[#F59E0B] to-[#4CAF50]',
              bg: 'bg-[#F59E0B]/10'
            },
            {
              icon: <MapPin className="w-8 h-8" />,
              title: t('feat4Title') || 'Find Nearby Shops',
              desc: t('feat4Desc') || 'Locate verified fertilizer and pesticide dealers near your village.',
              color: 'from-[#1B5E20] to-[#4CAF50]',
              bg: 'bg-[#4CAF50]/10'
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: t('feat5Title') || 'Expert Advice',
              desc: t('feat5Desc') || 'Connect directly with agriculture experts to solve your crop diseases.',
              color: 'from-[#1B5E20] to-[#F59E0B]',
              bg: 'bg-[#1B5E20]/10'
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: t('feat6Title') || 'Market Insights',
              desc: t('feat6Desc') || 'Get the latest market prices and trends to sell at the right time.',
              color: 'from-[#4CAF50] to-[#F59E0B]',
              bg: 'bg-[#4CAF50]/10'
            }
          ].map((feat, idx) => (
            <div key={idx} className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden text-left">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feat.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
              <div className={`${feat.bg} text-[#1B5E20] dark:text-[#4CAF50] p-4 rounded-2xl w-fit mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                {feat.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#1A2E1A] dark:text-[#F7FAF4]">{feat.title}</h3>
              <p className="text-[#1A2E1A]/80 dark:text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Different Users Section */}
      <section className="py-24 bg-[#1A2E1A] text-[#F7FAF4] relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#4CAF50]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-[#F7FAF4]">{t('ecosystemTitle')}</h2>
            <p className="text-xl text-[#F7FAF4]/70">{t('ecosystemDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#1B5E20]/20 border border-[#4CAF50]/20 p-8 rounded-3xl hover:bg-[#1B5E20]/30 transition-colors text-left">
              <Tractor className="w-12 h-12 text-[#4CAF50] mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#F7FAF4]">{t('forFarmers')}</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#4CAF50]" /> {t('farmerBullet1')}</li>
                <li className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#4CAF50]" /> {t('farmerBullet2')}</li>
                <li className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#4CAF50]" /> {t('farmerBullet3')}</li>
              </ul>
            </div>
            
            <div className="bg-[#1B5E20]/20 border border-[#4CAF50]/20 p-8 rounded-3xl hover:bg-[#1B5E20]/30 transition-colors text-left">
              <Sprout className="w-12 h-12 text-[#4CAF50] mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#F7FAF4]">{t('forShopOwners')}</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#4CAF50]" /> {t('shopBullet1')}</li>
                <li className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#4CAF50]" /> {t('shopBullet2')}</li>
                <li className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#4CAF50]" /> {t('shopBullet3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-8 max-w-5xl mx-auto text-center relative bg-[#F7FAF4] dark:bg-slate-950">
        <div className="bg-gradient-to-br from-[#4CAF50]/10 to-[#F7FAF4] dark:from-emerald-950/20 dark:to-slate-950 rounded-[3rem] p-12 md:p-20 shadow-premium-3d border border-[#4CAF50]/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-[#1A2E1A] dark:text-[#F7FAF4] mb-6">{t('ctaTitle')}</h2>
            <p className="text-xl text-[#1A2E1A]/80 dark:text-slate-300 mb-10 max-w-2xl mx-auto">{t('ctaDesc')}</p>
            <button 
              onClick={() => setShowRoleModal(true)}
              className="inline-flex items-center justify-center bg-[#1B5E20] hover:bg-[#124115] text-[#F7FAF4] font-bold text-xl px-10 py-5 rounded-2xl shadow-xl hover:shadow-[#1B5E20]/40 transition-all hover:-translate-y-1 cursor-pointer"
            >
              {t('ctaBtn')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F7FAF4] dark:bg-slate-950 pt-16 pb-8 border-t border-[#1B5E20]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Leaf className="w-6 h-6 text-[#1B5E20]" />
            <span className="text-xl font-black text-[#1A2E1A] dark:text-[#F7FAF4]">{t('appName')}</span>
          </div>
          <p className="text-[#1A2E1A]/60 dark:text-slate-400 font-medium">{t('footerText')}</p>
        </div>
      </footer>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-4xl w-full border border-slate-100 dark:border-slate-800 overflow-hidden relative p-8 md:p-12 animate-in fade-in zoom-in-95 duration-200">
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
              <span className="text-4xl">🌱</span>
              <h3 className="text-3xl md:text-4xl font-black text-[#1A2E1A] dark:text-[#F7FAF4] mt-4 tracking-tight">
                {i18n.language === 'mr' ? 'नोंदणी सुरू करा' : i18n.language === 'hi' ? 'पंजीकरण शुरू करें' : 'Get Started'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {i18n.language === 'mr' ? 'नोंदणी करण्यासाठी खालीलपैकी तुमची योग्य भूमिका निवडा' : i18n.language === 'hi' ? 'पंजीकरण करने के लिए नीचे दी गई अपनी भूमिका चुनें' : 'Choose your role to create a personalized account'}
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              {/* Admin Card */}
              <Link 
                to="/register?role=super_admin"
                onClick={() => setShowRoleModal(false)}
                className="group p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 hover:border-[#1B5E20] hover:shadow-xl hover:shadow-[#1B5E20]/5 transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="w-14 h-14 bg-[#1B5E20]/10 text-[#1B5E20] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-[#1A2E1A] dark:text-[#F7FAF4] group-hover:text-[#1B5E20] transition-colors">
                    {i18n.language === 'mr' ? 'प्रशासक (Admin)' : i18n.language === 'hi' ? 'प्रशासक (Admin)' : 'Admin'}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                    {i18n.language === 'mr' ? 'शेतकरी आणि कृषी सेवा केंद्रांच्या नोंदी तपासा व मॅनेज करा.' : i18n.language === 'hi' ? 'किसानों और कृषि सेवा केंद्रों के रिकॉर्ड की जांच और प्रबंधन करें।' : 'Monitor and manage farmers, shop records, and platform analytics.'}
                  </p>
                </div>
                <div className="mt-8 text-sm font-bold text-[#1B5E20] group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                  {i18n.language === 'mr' ? 'नोंदणी करा' : i18n.language === 'hi' ? 'पंजीकरण करें' : 'Register Now'} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

