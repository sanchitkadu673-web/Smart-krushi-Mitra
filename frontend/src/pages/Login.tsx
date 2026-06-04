import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Smartphone, LockKeyhole } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await login(credentials, otp);
      toast.success('Login Successful!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">
          {t('otpLogin')}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          {step === 1 ? 'Choose your method to receive verification OTP' : 'Enter the 6-digit OTP code sent to you'}
        </p>

        {step === 1 && (
          <div className="flex gap-2 mb-6 bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button
              onClick={() => setMethod('mobile')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                method === 'mobile' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Mobile Number
            </button>
            <button
              onClick={() => setMethod('email')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                method === 'email' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Email Address
            </button>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            {method === 'mobile' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('mobileNumber')}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-semibold text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9876543210"
                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-sm"
            >
              {loading ? 'Sending...' : t('sendOtp')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification OTP
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <LockKeyhole className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary focus:outline-none tracking-widest text-center font-bold text-lg"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-sm"
              >
                {loading ? 'Verifying...' : t('verifyOtp')}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-sm">
          <Link to="/register" className="text-primary font-bold hover:underline">
            {t('registerFirst')}
          </Link>
        </div>
      </div>
    </div>
  );
};
