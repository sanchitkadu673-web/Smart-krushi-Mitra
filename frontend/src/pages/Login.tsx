import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Leaf, Tractor, Building2, ShieldCheck, ArrowRight, LockKeyhole, Smartphone, ChevronLeft, Eye, EyeOff, Sprout, CloudSun, CalendarDays, Star } from 'lucide-react';

// ─── Floating animated leaf SVG ────────────────────────────────────────────────
const FloatingLeaf: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 80 80" className={className} style={style}>
    <defs>
      <linearGradient id="leafGradL" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#047857" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    <path d="M10,70 C30,65 45,45 70,10 C48,40 65,28 10,70 Z" fill="url(#leafGradL)" />
  </svg>
);

// ─── Stat pill for left panel ───────────────────────────────────────────────────
const StatPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3">
    <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-white shrink-0">{icon}</div>
    <div>
      <p className="text-white font-black text-lg leading-none">{value}</p>
      <p className="text-white/60 text-xs font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

export const Login: React.FC = () => {
  const { login, loginPassword } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;

  const [role, setRole] = useState<'farmer' | 'shop_owner' | 'super_admin'>('farmer');
  const [method, setMethod] = useState<'mobile' | 'email' | 'password'>('mobile');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Role config
  const roleConfig = {
    farmer: {
      label: lang === 'mr' ? 'शेतकरी' : lang === 'hi' ? 'किसान' : 'Farmer',
      icon: <Tractor className="w-5 h-5" />,
      color: 'from-[#1B5E20] to-[#2E7D32]',
      accent: '#4CAF50',
      bg: 'from-[#0d3b18] via-[#1B5E20] to-[#2d5a1b]',
    },
    shop_owner: {
      label: lang === 'mr' ? 'दुकानदार' : lang === 'hi' ? 'दुकानदार' : 'Shop Owner',
      icon: <Building2 className="w-5 h-5" />,
      color: 'from-[#92400e] to-[#b45309]',
      accent: '#F59E0B',
      bg: 'from-[#3b1a05] via-[#78350f] to-[#5a2e0d]',
    },
    super_admin: {
      label: lang === 'mr' ? 'प्रशासक' : lang === 'hi' ? 'प्रशासक' : 'Admin',
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'from-[#1e3a5f] to-[#1d4ed8]',
      accent: '#3B82F6',
      bg: 'from-[#0a1628] via-[#1e3a5f] to-[#162d4a]',
    },
  };

  const cfg = roleConfig[role];

  const handleRoleChange = (newRole: typeof role) => {
    setRole(newRole);
    setMethod(newRole === 'shop_owner' ? 'password' : 'mobile');
    setMobile('');
    setPassword('');
    setOtp(['', '', '', '', '', '']);
    setStep(1);
  };

  // OTP box handlers
  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const arr = text.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(arr);
    otpRefs.current[Math.min(text.length, 5)]?.focus();
    e.preventDefault();
  };

  const otpValue = otp.join('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'password') {
      if (!/^[6-9]\d{9}$/.test(mobile)) { toast.error('Valid 10-digit mobile number required'); return; }
      if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
      setLoading(true);
      try {
        const p = await loginPassword(mobile, password);
        toast.success('Login Successful!');
        if (p.role === 'shop_owner') navigate('/shop');
        else if (p.role === 'admin' || p.role === 'super_admin') navigate('/admin');
        else navigate('/dashboard');
      } catch (err: any) {
        toast.error(err.response?.data?.error || 'Invalid credentials');
      } finally { setLoading(false); }
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) { toast.error('Valid 10-digit mobile number required'); return; }
    setLoading(true);
    try {
      await axios.post('/api/auth/send-otp', { mobile });
      toast.success('OTP sent!');
      setStep(2);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== 6) { toast.error('Enter all 6 digits'); return; }
    setLoading(true);
    try {
      const p = await login({ mobile }, otpValue);
      toast.success('Login Successful!');
      if (p.role === 'shop_owner') navigate('/shop');
      else if (p.role === 'expert') navigate('/expert');
      else if (p.role === 'admin' || p.role === 'super_admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FAF4] dark:bg-slate-950 relative overflow-hidden font-sans">
      {/* Subtle background orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -z-0 pointer-events-none" style={{ background: `${cfg.accent}08` }}></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[60px] -z-0 pointer-events-none" style={{ background: `${cfg.accent}06` }}></div>

      <div className="w-full max-w-md px-6 py-12 relative z-10">
        {/* Back to home */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[#1A2E1A] dark:text-white font-black text-lg">{t('appName')}</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-semibold transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {lang === 'mr' ? 'मुख्यपृष्ठ' : lang === 'hi' ? 'होम' : 'Home'}
          </Link>
        </div>

            {/* Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/30 p-8 md:p-10">

              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black" style={{ background: cfg.accent, color: '#fff' }}>1</div>
                  <span className="text-xs font-bold" style={{ color: cfg.accent }}>{lang === 'mr' ? 'माहिती' : 'Details'}</span>
                </div>
                <div className="flex-1 h-0.5 rounded-full" style={{ background: step === 2 ? cfg.accent : '#e2e8f0' }}></div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all`} style={{ background: step === 2 ? cfg.accent : '#e2e8f0', color: step === 2 ? '#fff' : '#94a3b8' }}>2</div>
                  <span className="text-xs font-bold" style={{ color: step === 2 ? cfg.accent : '#94a3b8' }}>OTP</span>
                </div>
              </div>

              {/* Title */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${cfg.accent}, ${cfg.accent}aa)` }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#1A2E1A] dark:text-white leading-tight">
                      {step === 1
                        ? (lang === 'mr' ? `${cfg.label} लॉगिन` : lang === 'hi' ? `${cfg.label} लॉगिन` : `${cfg.label} Login`)
                        : (lang === 'mr' ? 'OTP सत्यापन' : lang === 'hi' ? 'OTP सत्यापन' : 'OTP Verification')
                      }
                    </h2>
                    <p className="text-sm text-slate-400 font-medium mt-0.5">
                      {step === 1
                        ? (lang === 'mr' ? 'तुमची भूमिका निवडा आणि लॉगिन करा' : 'Select your role and sign in')
                        : (lang === 'mr' ? `+91 ${mobile} वर OTP पाठवला आहे` : `OTP sent to +91 ${mobile}`)
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* ─── STEP 1: Role Selector + Form ─── */}
              {step === 1 && (
                <>
                  {/* Role tabs */}
                  <div className="flex gap-2 mb-7 p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    {(['farmer', 'shop_owner', 'super_admin'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRoleChange(r)}
                        className={`flex-1 py-2.5 px-2 text-xs font-black rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                          role === r
                            ? 'text-white shadow-md'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                        style={role === r ? { background: `linear-gradient(135deg, ${cfg.accent}dd, ${cfg.accent}99)` } : {}}
                      >
                        {roleConfig[r].icon}
                        <span className="hidden sm:inline">{roleConfig[r].label}</span>
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-5">
                    {/* Mobile input */}
                    <div>
                      <label className="block text-sm font-bold text-[#1A2E1A] dark:text-white mb-2">
                        {lang === 'mr' ? 'मोबाईल नंबर' : lang === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3.5 font-bold text-slate-600 dark:text-slate-300 text-sm shrink-0">
                          🇮🇳 <span>+91</span>
                        </div>
                        <div className="relative flex-1">
                          <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="9876543210"
                            className="block w-full pl-10 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none focus:border-transparent focus:ring-2 font-semibold text-sm transition-all"
                            style={{ '--tw-ring-color': cfg.accent } as React.CSSProperties}
                            onFocus={(e) => { e.target.style.setProperty('--tw-ring-color', cfg.accent); e.target.style.borderColor = cfg.accent; }}
                            onBlur={(e) => { e.target.style.borderColor = ''; }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password (shop owner / admin) */}
                    {method === 'password' && (
                      <div>
                        <label className="block text-sm font-bold text-[#1A2E1A] dark:text-white mb-2">
                          {lang === 'mr' ? 'पासवर्ड' : 'Password'}
                        </label>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                          <input
                            type={showPass ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={lang === 'mr' ? 'पासवर्ड टाका' : 'Enter password'}
                            className="block w-full pl-10 pr-12 py-3.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none font-semibold text-sm transition-all"
                            onFocus={(e) => { e.target.style.borderColor = cfg.accent; }}
                            onBlur={(e) => { e.target.style.borderColor = ''; }}
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                            {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-shimmer w-full flex items-center justify-center gap-2.5 font-black py-4 rounded-2xl text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
                      style={{ background: `linear-gradient(135deg, ${cfg.accent}ee, ${cfg.accent}bb)` }}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                          {lang === 'mr' ? 'प्रक्रिया सुरू...' : 'Processing...'}
                        </span>
                      ) : (
                        <>
                          {method === 'password'
                            ? (lang === 'mr' ? 'लॉगिन करा' : lang === 'hi' ? 'लॉगिन करें' : 'Login')
                            : (lang === 'mr' ? 'OTP पाठवा' : lang === 'hi' ? 'OTP भेजें' : 'Send OTP')
                          }
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* ─── STEP 2: OTP Boxes ─── */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* OTP digit boxes */}
                  <div>
                    <label className="block text-sm font-bold text-[#1A2E1A] dark:text-white mb-4 text-center">
                      {lang === 'mr' ? '6-अंकी OTP कोड टाका' : lang === 'hi' ? '6-अंक OTP कोड दर्ज करें' : 'Enter 6-digit OTP code'}
                    </label>
                    <div className="flex gap-2.5 justify-center" onPaste={handleOtpPaste}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { otpRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-12 h-14 text-center text-xl font-black rounded-2xl border-2 transition-all duration-200 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:scale-110"
                          style={{
                            borderColor: digit ? cfg.accent : '',
                            color: digit ? cfg.accent : '',
                            boxShadow: digit ? `0 0 0 3px ${cfg.accent}20` : '',
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                      {lang === 'mr' ? 'OTP 5 मिनिटांसाठी वैध आहे' : 'OTP valid for 5 minutes'}
                    </p>
                  </div>

                  {/* Resend */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); }}
                      className="text-sm font-bold transition-colors cursor-pointer"
                      style={{ color: cfg.accent }}
                    >
                      {lang === 'mr' ? 'OTP पुन्हा पाठवा' : lang === 'hi' ? 'OTP दोबारा भेजें' : 'Resend OTP'}
                    </button>
                  </div>

                  {/* Verify + Back */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); }}
                      className="flex items-center gap-1.5 px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {lang === 'mr' ? 'परत' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || otpValue.length !== 6}
                      className="btn-shimmer flex-1 flex items-center justify-center gap-2 font-black py-4 rounded-2xl text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${cfg.accent}ee, ${cfg.accent}bb)` }}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                          {lang === 'mr' ? 'सत्यापन...' : 'Verifying...'}
                        </span>
                      ) : (
                        <>
                          {lang === 'mr' ? 'सत्यापित करा' : lang === 'hi' ? 'सत्यापित करें' : 'Verify & Login'}
                          <ShieldCheck className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Admin demo credentials */}
              {role === 'super_admin' && step === 1 && (
                <div className="mt-5 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                      Demo Credentials
                    </span>
                    <button
                      type="button"
                      onClick={() => setMobile('9876543212')}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg cursor-pointer transition-all"
                    >
                      Autofill
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                    Mobile: <strong>9876543212</strong> &nbsp;|&nbsp; OTP: <strong>123456</strong>
                  </p>
                </div>
              )}

              {/* Register link */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {lang === 'mr' ? 'खाते नाही?' : lang === 'hi' ? 'खाता नहीं है?' : "Don't have an account?"}{' '}
                  <Link
                    to="/register"
                    className="font-black transition-colors hover:underline"
                    style={{ color: cfg.accent }}
                  >
                    {lang === 'mr' ? 'नोंदणी करा' : lang === 'hi' ? 'पंजीकरण करें' : 'Register here'}
                  </Link>
                </p>
              </div>

            </div>
        </div>
    </div>
  );
};
