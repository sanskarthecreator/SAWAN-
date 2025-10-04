import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-500 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Assess Your Rooftop Rainwater Harvesting Potential
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl mb-8">
            Get a data-driven analysis of how much water you can save and how to recharge groundwater, complete with personalized recommendations, cost estimates, and a feasibility score.
          </p>
          <button
            onClick={onStart}
            className="bg-gray-200 text-black font-bold py-3 px-8 border-2 border-black"
          >
            Start New Assessment
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
             <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h3 className="text-2xl font-bold mb-2">1. Location-Specific Analysis</h3>
                <p className="text-gray-700">
                Uses local rainfall and groundwater data to estimate your rainwater harvesting potential.
                </p>
            </div>
             <div>
                <h3 className="text-2xl font-bold mb-2">2. AI-Powered Recommendations</h3>
                <p className="text-gray-700">
                Calculates harvestable water, suggests suitable recharge structures, and provides cost estimates.
                </p>
            </div>
             <div>
                <h3 className="text-2xl font-bold mb-2">3. Detailed PDF Reports</h3>
                <p className="text-gray-700">
                Download a complete summary of your assessment for your records and planning.
                </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;