import { GoogleGenAI, Type } from "@google/genai";
import type { AssessmentData, ResultsData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const resultsSchema = {
    type: Type.OBJECT,
    properties: {
        locationName: { type: Type.STRING, description: "The major city or district of the provided coordinates, e.g., 'Mumbai, Maharashtra'" },
        feasibilityScore: { type: Type.STRING, enum: ['High', 'Moderate', 'Low'] },
        annualHarvestableVolume: { type: Type.NUMBER, description: "in cubic meters (m³)" },
        monsoonHarvestVolume: { type: Type.NUMBER, description: "in cubic meters (m³)" },
        averageAnnualRainfall: { type: Type.NUMBER, description: "in millimeters (mm)" },
        estimatedAnnualSavings: { type: Type.NUMBER, description: "in Indian Rupees (₹)" },
        paybackPeriod: { type: Type.NUMBER, nullable: true, description: "in years, null if not applicable" },
        totalEstimatedCost: { type: Type.NUMBER, description: "in Indian Rupees (₹)" },
        recommendedStructures: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING },
                    count: { type: Type.INTEGER },
                    capacity: { type: Type.NUMBER, description: "in cubic meters (m³)" },
                    dimensions: { type: Type.STRING },
                },
                required: ['type', 'count', 'capacity', 'dimensions'],
            },
        },
        averageDepthToGroundwater: { type: Type.NUMBER, description: "in meters" },
    },
    required: [
        'locationName',
        'feasibilityScore', 'annualHarvestableVolume', 'monsoonHarvestVolume', 'averageAnnualRainfall',
        'estimatedAnnualSavings', 'paybackPeriod', 'totalEstimatedCost', 'recommendedStructures',
        'averageDepthToGroundwater'
    ],
};

const buildPrompt = (data: AssessmentData): string => {
    return `
You are an expert hydrogeologist AI named "Sawan," specializing in Rooftop Rainwater Harvesting (RTRWH) and artificial groundwater recharge for residential properties in India. Your analysis must be data-driven, practical, and adhere strictly to the provided parameters. It is critical that you use verifiable, recent data from official sources like the India Meteorological Department (IMD) and Central Ground Water Board (CGWB) for rainfall and groundwater levels to ensure the analysis is accurate and not based on random or generalized numbers.

Based on the user's input, provide a comprehensive feasibility analysis. Your entire response MUST be a single, valid JSON object that conforms to the provided schema. Do not include any introductory text, explanations, or markdown formatting outside of the JSON object itself.

**User Input Data:**
- Location (Latitude, Longitude): ${data.lat}, ${data.lng}
- Rooftop Area: ${data.roofArea} m²
- Rooftop Material: ${data.roofMaterial}
- Available Open Ground Space: ${data.openSpace} m²
- Number of People in Household: ${data.householdSize}

**Calculation and Logic Constraints (MUST FOLLOW):**
1.  **Location Identification:** First, identify the major city/district and state for the given latitude and longitude. Return this as \`locationName\` in the format "City, State" (e.g., "Mumbai, Maharashtra"). Do not include smaller localities or sub-districts.
2.  **Rainfall Data:** Use your internal knowledge to source the most accurate and recent average annual rainfall and monsoon season (June-Sept) rainfall in millimeters for the identified \`locationName\`. You MUST prioritize data from official Indian government sources like the India Meteorological Department (IMD) or the Central Ground Water Board (CGWB).
3.  **Runoff Calculation:** Calculate the annual harvestable rainwater volume.
    -   Formula: \`Volume (m³) = Rooftop Area (m²) * Annual Rainfall (m) * Runoff Coefficient\`
    -   Use these exact Runoff Coefficients:
        -   rcc (Concrete): 0.9
        -   metal (Metal Sheet): 0.95
        -   tile (Tiles): 0.9
        -   asphalt (Asphalt Shingles): 0.85
        -   thatch (Thatch): 0.6
4.  **System Efficiency:** Apply a 90% (0.90) system efficiency factor to the final calculated volume to account for first flush, evaporation, and other losses. The final reported volume must be this net value.
5.  **Financials:**
    -   Calculate \`Estimated Annual Savings (INR)\` based on the net annual harvestable volume. Assume a municipal water cost of 20 INR per cubic meter.
    -   Estimate the \`Total Estimated Cost (INR)\` for a complete RTRWH system. To ensure the estimate is conservative and normal, use the following model: Cost = (Piping Cost) + (Filter Cost) + (Recharge Unit Cost). Assume Piping Cost is roughly ₹25 per m² of roof area. Assume a standard Filter Cost of ₹7,500. Assume a base Recharge Unit Cost of ₹20,000, adjusting upwards for larger recommended structures. The final number should be a realistic, moderate total for a residential system in India.
    -   Calculate the \`Payback Period (years)\`. If the cost is zero or savings are zero, return null. \`Payback Period = Total Estimated Cost / Estimated Annual Savings\`.
6.  **Groundwater:**
    -   Use your internal data, referencing official sources like the Central Ground Water Board (CGWB), to provide an accurate estimate for the \`Average Depth to Groundwater (meters)\` at the identified \`locationName\`. Do not use generic or placeholder data.
7.  **Recharge Structure Recommendation:**
    -   Base recommendations on the **monsoon season harvest volume** and \`Available Open Ground Space\`.
    -   If \`Available Open Ground Space\` is less than 2 m² or monsoon harvest volume is less than 5 m³, recommend NO structures (return an empty array).
    -   Prioritize structures:
        -   If \`Average Depth to Groundwater\` > 12m, prioritize a "Recharge Shaft".
        -   If monsoon harvest volume > 50 m³, recommend "Recharge Trenches".
        -   Otherwise, recommend a "Recharge Pit".
    -   Provide the \`count\`, total \`capacity\` (should be able to handle the monsoon volume), and plausible \`dimensions\` for the recommended structure(s).
8.  **Feasibility Score:**
    -   Assign a score ('High', 'Moderate', 'Low') based on a combination of factors. The scoring should be conservative to keep the potential assessment "low key".
        -   High: High volume, very short payback (< 4 years), good recharge conditions.
        -   Moderate: Medium volume, reasonable payback (4-10 years).
        -   Low: Low volume, long payback (> 10 years), poor recharge conditions.

**Final Output:**
Produce a single JSON object matching the schema. Do NOT include an aquiferNote.
`;
};


export const getAssessment = async (data: AssessmentData): Promise<ResultsData> => {
    const prompt = buildPrompt(data);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resultsSchema,
        },
    });

    try {
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as ResultsData;
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text);
        throw new Error("The AI returned an invalid response. Please try again.");
    }
};