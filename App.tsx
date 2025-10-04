
import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentWizard from './components/AssessmentWizard';
import LoadingScreen from './components/LoadingScreen';
import ResultsDashboard from './components/ResultsDashboard';
import { getAssessment } from './services/geminiService';
import type { AssessmentData, ResultsData } from './types';

type View = 'landing' | 'wizard' | 'loading' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [results, setResults] = useState<ResultsData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        return <LandingPage onStart={handleStartAssessment} />;
      case 'wizard':
        return <AssessmentWizard onSubmit={handleGetAssessment} error={error} />;
      case 'loading':
        return <LoadingScreen />;
      case 'results':
        return results ? <ResultsDashboard results={results} onStartNew={handleStartAssessment} /> : <LoadingScreen />;
      default:
        return <LandingPage onStart={handleStartAssessment} />;
    }
  };

  return (
    <div className="bg-white min-h-screen text-black font-serif">
      <header className="bg-gray-100 border-b-2 border-gray-300">
        <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-3xl">Sawan Planner</h1>
          {view !== 'landing' && (
            <button
              onClick={handleStartAssessment}
              className="px-4 py-2 bg-gray-300 border border-gray-400 text-black"
            >
              Start New Assessment
            </button>
          )}
        </nav>
      </header>
      <main>
        {renderView()}
      </main>
       <footer className="text-center py-4 mt-8 border-t-2 border-gray-300 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Sawan Planner. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
