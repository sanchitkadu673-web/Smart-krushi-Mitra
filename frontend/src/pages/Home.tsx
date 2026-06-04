import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import { ShieldCheck, CloudSun, CalendarDays, Sprout, Milestone, HelpCircle } from 'lucide-react';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-0 -left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 -right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>

        <span className="bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 inline-block">
          ✨ {t('tagline')}
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl leading-tight font-sans">
          {t('heroTitle')}
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          {t('heroDescription')}
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="bg-primary hover:bg-primary-dark text-white font-bold text-lg px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all">
            {t('getStartedBtn')}
          </Link>
          <Link to="/login" className="bg-white border-2 border-primary/20 text-primary hover:border-primary font-bold text-lg px-8 py-3.5 rounded-xl transition-all">
            {t('login')}
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
          {t('keyFeaturesTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-card">
            <div className="bg-primary/10 text-primary p-3.5 rounded-xl w-fit mb-6">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feat1Title')}</h3>
            <p className="text-gray-600">{t('feat1Desc')}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-card">
            <div className="bg-primary/10 text-primary p-3.5 rounded-xl w-fit mb-6">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feat2Title')}</h3>
            <p className="text-gray-600">{t('feat2Desc')}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-card">
            <div className="bg-primary/10 text-primary p-3.5 rounded-xl w-fit mb-6">
              <CloudSun className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feat3Title')}</h3>
            <p className="text-gray-600">{t('feat3Desc')}</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
            {t('howItWorksTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '01', title: t('step1Title'), desc: t('step1Desc') },
              { num: '02', title: t('step2Title'), desc: t('step2Desc') },
              { num: '03', title: t('step3Title'), desc: t('step3Desc') },
              { num: '04', title: t('step4Title'), desc: t('step4Desc') }
            ].map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center p-4">
                <span className="text-5xl font-black text-primary/10 mb-4 block">{step.num}</span>
                <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12 flex items-center justify-center gap-2">
          <HelpCircle className="text-primary w-8 h-8" /> {t('faqTitle')}
        </h2>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900">{t('faq1Q')}</h4>
            <p className="text-gray-600 mt-2 text-sm">{t('faq1A')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900">{t('faq2Q')}</h4>
            <p className="text-gray-600 mt-2 text-sm">{t('faq2A')}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 md:px-8 text-center border-t border-gray-800">
        <p className="text-sm">{t('footerText')}</p>
      </footer>
    </div>
  );
};
