import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentWizard from './components/AssessmentWizard';
import LoadingScreen from './components/LoadingScreen';
import ResultsDashboard from './components/ResultsDashboard';
import LanguageSelector from './components/LanguageSelector';
import { getAssessment } from './services/geminiService';
import { useTranslations } from './hooks/useTranslations';
import type { AssessmentData, ResultsData, Language } from './types';

type View = 'landing' | 'wizard' | 'loading' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [results, setResults] = useState<ResultsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const t = useTranslations(language);

  const handleStartAssessment = () => {
    setView('wizard');
    setResults(null);
    setError(null);
  };

  const handleGetAssessment = useCallback(async (data: AssessmentData) => {
    setView('loading');
    setError(null);
    try {
      const assessmentResults = await getAssessment(data);
      setResults(assessmentResults);
      setView('results');
    } catch (err) {
      console.error("Error getting assessment:", err);
      setError("Sorry, we couldn't generate your assessment. The AI may be busy or an error occurred. Please try again later.");
      setView('wizard'); // or a dedicated error view
    }
  }, []);

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onStart={handleStartAssessment} language={language} />;
      case 'wizard':
        return <AssessmentWizard onSubmit={handleGetAssessment} error={error} language={language} />;
      case 'loading':
        return <LoadingScreen language={language} />;
      case 'results':
        return results ? <ResultsDashboard results={results} onStartNew={handleStartAssessment} language={language} /> : <LoadingScreen language={language} />;
      default:
        return <LandingPage onStart={handleStartAssessment} language={language} />;
    }
  };

  return (
    <div className="bg-white min-h-screen text-black font-sans">
      <header className="bg-gray-100 border-b-2 border-gray-300">
        <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-3xl">{t('header.title')}</h1>
          <div className="flex items-center gap-4">
            {view !== 'landing' && (
              <button
                onClick={handleStartAssessment}
                className="px-4 py-2 bg-gray-300 border border-gray-400 text-black"
              >
                {t('header.newAssessment')}
              </button>
            )}
             <LanguageSelector currentLanguage={language} onChange={setLanguage} />
          </div>
        </nav>
      </header>
      <main>
        {renderView()}
      </main>
    </div>
  );
};

export default App;