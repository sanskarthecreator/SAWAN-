import React, { useState } from 'react';
import type { Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface Step2SiteDetailsProps {
  onSubmit: (data: { openSpace: number; householdSize: number; }) => void;
  onBack: () => void;
  initialData: { openSpace?: number; householdSize?: number; };
  language: Language;
}

const Step2SiteDetails: React.FC<Step2SiteDetailsProps> = ({ onSubmit, onBack, initialData, language }) => {
  const t = useTranslations(language);
  const [openSpace, setOpenSpace] = useState<string>(initialData.openSpace?.toString() || '');
  const [householdSize, setHouseholdSize] = useState<string>(initialData.householdSize?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      openSpace: parseFloat(openSpace),
      householdSize: parseInt(householdSize, 10),
    });
  };

  const isSubmitDisabled = !openSpace || parseFloat(openSpace) < 0 || !householdSize || parseInt(householdSize, 10) <= 0;

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">{t('wizard.step2.title')}</h2>
      <p className="text-gray-600 mb-6">{t('wizard.step2.subtitle')}</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="openSpace" className="block text-sm font-medium text-gray-700 mb-1">{t('wizard.step2.openSpaceLabel')}</label>
          <input
            type="number"
            id="openSpace"
            value={openSpace}
            onChange={(e) => setOpenSpace(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-400 focus:outline-blue-500"
            // FIX: Cast translation result to string for placeholder attribute.
            placeholder={t('wizard.step2.openSpacePlaceholder') as string}
            required
          />
          <p className="text-xs text-gray-500 mt-1">{t('wizard.step2.openSpaceHelper')}</p>
        </div>
        <div>
          <label htmlFor="householdSize" className="block text-sm font-medium text-gray-700 mb-1">{t('wizard.step2.householdSizeLabel')}</label>
          <input
            type="number"
            id="householdSize"
            value={householdSize}
            onChange={(e) => setHouseholdSize(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-400 focus:outline-blue-500"
            // FIX: Cast translation result to string for placeholder attribute.
            placeholder={t('wizard.step2.householdSizePlaceholder') as string}
            required
            min="1"
          />
        </div>
      </div>
      
      <div className="mt-8 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-400 text-black bg-gray-200 hover:bg-gray-300"
        >
          {t('wizard.step2.backButton')}
        </button>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="px-6 py-3 text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {t('wizard.step2.getAssessmentButton')}
        </button>
      </div>
    </form>
  );
};

export default Step2SiteDetails;