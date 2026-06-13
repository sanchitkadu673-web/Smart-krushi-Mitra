import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Smartphone, LockKeyhole } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, loginPassword } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [role, setRole] = useState<'farmer' | 'shop_owner' | 'super_admin'>('farmer');
  const [method, setMethod] = useState<'mobile' | 'email' | 'password'>('mobile');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);




  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'password') {
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        toast.error('Please enter a valid 10-digit mobile number');
        return;
      }
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      setLoading(true);
      try {
        const loggedInProfile = await loginPassword(mobile, password);
        toast.success('Login Successful!');
        if (loggedInProfile.role === 'shop_owner') {
          navigate('/shop');
        } else if (loggedInProfile.role === 'admin' || loggedInProfile.role === 'super_admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch (err: any) {
        toast.error(err.response?.data?.error || 'Invalid credentials');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (method === 'mobile' && !/^[6-9]\d{9}$/.test(mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (method === 'email' && !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const payload = method === 'mobile' ? { mobile } : { email };
      await axios.post('/api/auth/send-otp', payload);
      toast.success('OTP sent successfully!');
      setStep(2);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('OTP must be exactly 6 digits');
      return;
    }

    setLoading(true);
    try {
      const credentials = method === 'mobile' ? { mobile } : { email };
      const loggedInProfile = await login(credentials, otp);
      toast.success('Login Successful!');
      
      // Route based on role
      if (loggedInProfile.role === 'shop_owner') {
        navigate('/shop');
      } else if (loggedInProfile.role === 'expert') {
        navigate('/expert');
      } else if (loggedInProfile.role === 'admin' || loggedInProfile.role === 'super_admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard'); // default for farmer
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF4] dark:bg-slate-950 font-sans">
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium-3d border border-slate-100 dark:border-slate-800">
        
        {/* Title */}
        <h2 className="text-3xl font-black text-[#1A2E1A] dark:text-[#F7FAF4] mb-2 text-center tracking-tight">
          {role === 'farmer' 
            ? 'Farmer Login' 
            : role === 'shop_owner' 
            ? 'Shop Owner Login' 
            : 'Super Admin Login'}
        </h2>
        <p className="text-sm font-semibold text-slate-500 text-center mb-6">
          {step === 1 ? 'Select role and login options' : 'Enter the 6-digit OTP code sent to you'}
        </p>

        {step === 1 && (
          <div className="flex gap-1.5 mb-6 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setRole('farmer');
                setMethod('mobile');
                setMobile('');
                setPassword('');
                setOtp('');
              }}
              className={`px-3.5 py-2.5 text-xs font-black rounded-xl transition-all whitespace-nowrap flex-1 cursor-pointer ${
                role === 'farmer' ? 'bg-[#1B5E20] text-white shadow-md' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-105'
              }`}
            >
              Farmer (शेतकरी)
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('shop_owner');
                setMethod('password');
                setMobile('');
                setPassword('');
                setOtp('');
              }}
              className={`px-3.5 py-2.5 text-xs font-black rounded-xl transition-all whitespace-nowrap flex-1 cursor-pointer ${
                role === 'shop_owner' ? 'bg-[#1B5E20] text-white shadow-md' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-105'
              }`}
            >
              Shop Owner
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('super_admin');
                setMethod('mobile');
                setMobile('');
                setPassword('');
                setOtp('');
              }}
              className={`px-3.5 py-2.5 text-xs font-black rounded-xl transition-all whitespace-nowrap flex-1 cursor-pointer ${
                role === 'super_admin' ? 'bg-[#1B5E20] text-white shadow-md' : 'text-slate-600 dark:text-slate-350 hover:bg-slate-105'
              }`}
            >
              Admin (प्रशासक)
            </button>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#1A2E1A] dark:text-[#F7FAF4] mb-2 text-left">
                  {t('mobileNumber') || 'Mobile Number'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 font-bold text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9876543210"
                    className="block w-full pl-14 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl focus:ring-[#1B5E20] focus:border-[#1B5E20] focus:outline-none font-semibold"
                  />
                </div>
              </div>

              {method === 'password' && (
                <div>
                  <label className="block text-sm font-bold text-[#1A2E1A] dark:text-[#F7FAF4] mb-2 text-left">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <LockKeyhole className="w-5 h-5" />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl focus:ring-[#1B5E20] focus:border-[#1B5E20] focus:outline-none font-semibold"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B5E20] hover:bg-[#124115] text-[#F7FAF4] font-bold py-4 rounded-2xl transition-all shadow-md cursor-pointer disabled:opacity-55"
            >
              {loading ? 'Processing...' : method === 'password' ? 'Login' : t('sendOtp') || 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#1A2E1A] dark:text-[#F7FAF4] mb-2 text-left">
                Verification OTP
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <LockKeyhole className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl focus:ring-[#1B5E20] focus:border-[#1B5E20] focus:outline-none tracking-widest text-center font-bold text-lg"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-350 font-bold py-4 rounded-2xl transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-[#1B5E20] hover:bg-[#124115] text-[#F7FAF4] font-bold py-4 rounded-2xl transition-all shadow-md cursor-pointer disabled:opacity-55"
              >
                {loading ? 'Verifying...' : t('verifyOtp') || 'Verify OTP'}
              </button>
            </div>
          </form>
        )}

        {role === 'super_admin' && (
          <div className="mt-6 p-4 bg-emerald-50/75 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 rounded-[1.5rem] text-left space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-350 tracking-wide uppercase flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Admin Credentials (डेमो माहिती)
              </span>
              <button
                type="button"
                onClick={() => {
                  setMobile('9876543212');
                  if (step === 2) setOtp('123456');
                }}
                className="text-xs bg-[#1B5E20] hover:bg-[#124115] text-white font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
              >
                Autofill
              </button>
            </div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-350 space-y-1">
              <div>
                <span className="text-slate-400 dark:text-slate-500 font-medium">Mobile:</span>{' '}
                <span className="font-mono text-slate-800 dark:text-slate-200">9876543212</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 font-medium">OTP:</span>{' '}
                <span className="font-mono text-slate-800 dark:text-slate-200">123456</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm">
          <Link to="/register" className="text-[#1B5E20] dark:text-[#4CAF50] font-bold hover:underline">
            {t('registerFirst') || "Don't have an account? Register here."}
          </Link>
        </div>
      </div>
    </div>
  );
};

