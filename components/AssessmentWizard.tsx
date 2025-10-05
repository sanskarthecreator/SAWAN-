import React, { useState } from 'react';
import Step1Location from './Step1Location';
import Step2SiteDetails from './Step2SiteDetails';
import type { AssessmentData, Language } from '../types';
import { RoofMaterial } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface AssessmentWizardProps {
  onSubmit: (data: AssessmentData) => void;
  error: string | null;
  language: Language;
}

const AssessmentWizard: React.FC<AssessmentWizardProps> = ({ onSubmit, error, language }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<AssessmentData>>({
    roofMaterial: RoofMaterial.RCC,
  });
  const t = useTranslations(language);

  const handleStep1Next = (step1Data: Pick<AssessmentData, 'lat' | 'lng' | 'roofArea' | 'roofMaterial'>) => {
    setData(prev => ({ ...prev, ...step1Data }));
    setStep(2);
  };

  const handleStep2Submit = (step2Data: Pick<AssessmentData, 'openSpace' | 'householdSize'>) => {
    const finalData = { ...data, ...step2Data } as AssessmentData;
    onSubmit(finalData);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 border-2 border-gray-400">
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-6" role="alert">
                <strong className="font-bold">{t('wizard.errorTitle')} </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        {step === 1 && (
          <Step1Location
            onNext={handleStep1Next}
            initialData={{
              roofArea: data.roofArea,
              roofMaterial: data.roofMaterial,
            }}
            language={language}
          />
        )}
        {step === 2 && (
          <Step2SiteDetails
            onSubmit={handleStep2Submit}
            onBack={() => setStep(1)}
            initialData={{
              openSpace: data.openSpace,
              householdSize: data.householdSize,
            }}
            language={language}
          />
        )}
      </div>
    </div>
  );
};

export default AssessmentWizard;