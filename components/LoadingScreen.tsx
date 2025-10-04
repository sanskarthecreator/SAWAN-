
import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "Consulting our Hydrogeology AI...",
  "Analyzing local rainfall patterns...",
  "Estimating groundwater levels...",
  "Designing optimal recharge structures...",
  "Calculating your potential savings...",
  "Creating your custom rainwater harvesting plan...",
];

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-96 text-center container mx-auto px-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Generating Your Report</h2>
      <p className="text-slate-600 text-lg transition-opacity duration-500">
        {MESSAGES[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingScreen;
