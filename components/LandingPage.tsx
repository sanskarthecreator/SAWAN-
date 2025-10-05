import React from 'react';
import type { Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface LandingPageProps {
  onStart: () => void;
  language: Language;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, language }) => {
  const t = useTranslations(language);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-500 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('landingPage.heroTitle')}
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl mb-8">
            {t('landingPage.heroSubtitle')}
          </p>
          <button
            onClick={onStart}
            className="bg-gray-200 text-black font-bold py-3 px-8 border-2 border-black"
          >
            {t('landingPage.startAssessment')}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
             <h2 className="text-3xl font-bold mb-8">{t('landingPage.howItWorksTitle')}</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h3 className="text-2xl font-bold mb-2">{t('landingPage.feature1Title')}</h3>
                <p className="text-gray-700">
                {t('landingPage.feature1Text')}
                </p>
            </div>
             <div>
                <h3 className="text-2xl font-bold mb-2">{t('landingPage.feature2Title')}</h3>
                <p className="text-gray-700">
                {t('landingPage.feature2Text')}
                </p>
            </div>
             <div>
                <h3 className="text-2xl font-bold mb-2">{t('landingPage.feature3Title')}</h3>
                <p className="text-gray-700">
                {t('landingPage.feature3Text')}
                </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;