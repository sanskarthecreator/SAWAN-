import React, { useRef } from 'react';
import type { ResultsData, Language } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultsDashboardProps {
  results: ResultsData;
  onStartNew: () => void;
  language: Language;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, onStartNew, language }) => {
    const t = useTranslations(language);
    const reportRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        const input = reportRef.current;
        if (!input) return;
    
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            let imgWidth = pdfWidth - 20; // with margin
            let imgHeight = imgWidth / ratio;
            
            let heightLeft = imgHeight;
            let position = 15; // top margin

            pdf.setFontSize(18);
            pdf.text("Sawan: Rooftop Rainwater Harvesting Report", pdfWidth / 2, 10, { align: 'center' });

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - position);
    
            while (heightLeft > 0) {
                position = heightLeft - imgHeight + 15; // + margin
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            const pageCount = pdf.getNumberOfPages();
            for(let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.text(`Page ${i} of ${pageCount}`, pdfWidth - 20, pdfHeight - 10);
                pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, pdfHeight - 10);
            }
            
            pdf.save("Sawan_RWH_Report.pdf");
        });
    };

    const feasibilityStyles = {
        High: 'text-green-700',
        Moderate: 'text-yellow-700',
        Low: 'text-red-700',
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div ref={reportRef} className="bg-white p-4 sm:p-8 border-2 border-gray-400">
                <h2 className="text-3xl font-bold mb-4 border-b-2 pb-2">{t('results.title')}</h2>
                <p className="text-lg text-gray-700 -mt-2 mb-4">{t('results.reportFor', { location: results.locationName })}</p>
                
                <div className="mb-6">
                    <h3 className="text-2xl font-bold">{t('results.feasibilityScore')} <span className={feasibilityStyles[results.feasibilityScore]}>{t(`results.potential.${results.feasibilityScore}`)}</span></h3>
                    <p className="text-sm text-gray-600">{t('results.feasibilitySubtitle', { location: results.locationName })}</p>
                </div>

                <div className="space-y-6">
                    <div className="p-4 border border-gray-300">
                        <h4 className="text-xl font-bold mb-2">{t('results.rwhPotentialTitle')}</h4>
                        <p><span className="font-bold">{t('results.annualHarvestVolume')}</span> {t('results.annualHarvestVolumeUnit', { volume: results.annualHarvestableVolume.toLocaleString(), liters: (results.annualHarvestableVolume * 1000).toLocaleString() })}</p>
                        <p><span className="font-bold">{t('results.monsoonHarvest')}</span> {t('results.monsoonHarvestUnit', { volume: results.monsoonHarvestVolume.toLocaleString() })}</p>
                        <p><span className="font-bold">{t('results.avgRainfall', { location: results.locationName })}</span> {t('results.avgRainfallUnit', { rainfall: results.averageAnnualRainfall.toLocaleString() })}</p>
                        <p className="text-xs text-gray-500 mt-2 italic">{t('results.rwhNote')}</p>
                    </div>

                    <div className="p-4 border border-gray-300">
                        <h4 className="text-xl font-bold mb-2">{t('results.financialTitle')}</h4>
                        <p><span className="font-bold">{t('results.annualSavings')}</span> ₹{results.estimatedAnnualSavings.toLocaleString()}</p>
                        <p><span className="font-bold">{t('results.paybackPeriod')}</span> {results.paybackPeriod ? t('results.paybackPeriodValue', { period: results.paybackPeriod.toFixed(1) }) : t('results.notApplicable')}</p>
                        <p><span className="font-bold">{t('results.estimatedCost')}</span> ₹{results.totalEstimatedCost.toLocaleString()}</p>
                    </div>

                     <div className="p-4 border border-gray-300">
                        <h4 className="text-xl font-bold mb-2">{t('results.rechargeTitle')}</h4>
                         {results.recommendedStructures.length > 0 ? (
                            <ul className="list-disc list-inside">
                                {results.recommendedStructures.map((s, i) => (
                                    <li key={i}>
                                        <span className="font-bold">{t('results.rechargeCount', { count: s.count, type: s.type })}</span>
                                        <ul className="list-none ml-6 text-sm">
                                            <li>{t('results.totalCapacity', { capacity: s.capacity })}</li>
                                            <li>{t('results.dimensions', { dimensions: s.dimensions })}</li>
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>{t('results.noStructure')}</p>
                        )}
                    </div>

                    <div className="p-4 border border-gray-300">
                        <h4 className="text-xl font-bold mb-2">{t('results.aquiferTitle')}</h4>
                        <p><span className="font-bold">{t('results.groundwaterDepth', { location: results.locationName })}</span> {t('results.groundwaterDepthValue', { depth: results.averageDepthToGroundwater.toFixed(1) })}</p>
                        <div className="mt-2">
                            <p className="font-bold">{t('results.hydroNoteTitle')}</p>
                            <p className="text-gray-700 text-sm">{results.aquiferNote}</p>
                            <p className="text-xs text-gray-500 mt-1 italic">{t('results.hydroNoteDisclaimer')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={handleDownloadPdf}
                    className="w-full sm:w-auto px-6 py-3 text-white bg-blue-600 hover:bg-blue-700"
                >
                    {t('results.downloadPdfButton')}
                </button>
                <button
                    onClick={onStartNew}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-400 text-black bg-gray-200 hover:bg-gray-300"
                >
                    {t('results.startNewButton')}
                </button>
            </div>
        </div>
    );
};

export default ResultsDashboard;