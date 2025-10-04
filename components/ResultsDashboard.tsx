
import React, { useRef } from 'react';
import type { ResultsData } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultsDashboardProps {
  results: ResultsData;
  onStartNew: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, onStartNew }) => {
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
                <h2 className="text-3xl font-bold mb-4 border-b-2 pb-2">Assessment Results</h2>
                
                <div className="mb-6">
                    <h3 className="text-2xl font-bold">Feasibility Score: <span className={feasibilityStyles[results.feasibilityScore]}>{results.feasibilityScore} Potential</span></h3>
                    <p className="text-sm text-gray-600">Based on your location, roof, and site data.</p>
                </div>

                <div className="space-y-6">
                    <div className="p-4 border border-gray-300">
                        <h4 className="text-xl font-bold mb-2">Net RWH Potential</h4>
                        <p><span className="font-bold">Annual Harvestable Volume:</span> {results.annualHarvestableVolume.toLocaleString()} m³ / year (~ {(results.annualHarvestableVolume * 1000).toLocaleString()} Liters)</p>
                        <p><span className="font-bold">Monsoon Harvest:</span> {results.monsoonHarvestVolume.toLocaleString()} m³</p>
                        <p><span className="font-bold">Avg. Annual Rainfall:</span> {results.averageAnnualRainfall.toLocaleString()} mm</p>
                        <p className="text-xs text-gray-500 mt-2 italic">Net estimate including roof type and 10% system loss factor.</p>
                    </div>

                    <div className="p-4 border border-gray-300">
                        <h4 className="text-xl font-bold mb-2">Financial Snapshot</h4>
                        <p><span className="font-bold">Estimated Annual Savings:</span> ₹{results.estimatedAnnualSavings.toLocaleString()}</p>
                        <p><span className="font-bold">Payback Period:</span> {results.paybackPeriod ? `${results.paybackPeriod.toFixed(1)} years` : 'N/A'}</p>
                        <p><span className="font-bold">Total Estimated Cost:</span> ₹{results.totalEstimatedCost.toLocaleString()}</p>
                    </div>

                     <div className="p-4 border border-gray-300">
                        <h4 className="text-xl font-bold mb-2">Recommended Recharge Unit(s)</h4>
                         {results.recommendedStructures.length > 0 ? (
                            <ul className="list-disc list-inside">
                                {results.recommendedStructures.map((s, i) => (
                                    <li key={i}>
                                        <span className="font-bold">{s.count} &times; {s.type}</span>
                                        <ul className="list-none ml-6 text-sm">
                                            <li>Total Capacity: {s.capacity} m³</li>
                                            <li>Dimensions: {s.dimensions}</li>
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No recharge structure is recommended based on the calculated runoff volume and available space.</p>
                        )}
                    </div>

                    <div className="p-4 border border-gray-300">
                        <h4 className="text-xl font-bold mb-2">Local Aquifer Data</h4>
                        <p><span className="font-bold">Avg. Depth to Groundwater:</span> {results.averageDepthToGroundwater.toFixed(1)} meters</p>
                        <div className="mt-2">
                            <p className="font-bold">Hydrogeologist's Note:</p>
                            <p className="text-gray-700 text-sm">{results.aquiferNote}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={handleDownloadPdf}
                    className="w-full sm:w-auto px-6 py-3 text-white bg-blue-600 hover:bg-blue-700"
                >
                    Download PDF Report
                </button>
                <button
                    onClick={onStartNew}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-400 text-black bg-gray-200 hover:bg-gray-300"
                >
                    Start New Assessment
                </button>
            </div>
        </div>
    );
};

export default ResultsDashboard;
