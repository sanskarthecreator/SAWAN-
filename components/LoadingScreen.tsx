import React, { useState, useEffect } from 'react';
import type { Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';

// FIX: Removed the problematic `useTranslatedArray` hook that used `require` and caused build errors.
// The component now uses the improved `useTranslations` hook which can handle arrays directly.
const LoadingScreen: React.FC<{ language: Language }> = ({ language }) => {
  const t = useTranslations(language);
  const messagesValue = t('loading.messages');
  const MESSAGES = Array.isArray(messagesValue) ? messagesValue : [];
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (MESSAGES.length === 0) return;
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [MESSAGES]);

  return (
    <div className="flex flex-col items-center justify-center h-96 text-center container mx-auto px-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">{t('loading.title') as string}</h2>
      <p className="text-slate-600 text-lg transition-opacity duration-500">
        {MESSAGES[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingScreen;
