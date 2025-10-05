import React from 'react';
import type { Language } from '../types';
import { LANGUAGES } from '../types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onChange }) => {
  return (
    <div>
      <select
        value={currentLanguage}
        onChange={(e) => onChange(e.target.value as Language)}
        className="w-full px-3 py-2 border bg-white border-gray-400"
        aria-label="Select language"
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.name}</option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;