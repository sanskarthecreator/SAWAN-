import type { LatLng } from 'leaflet';

export enum RoofMaterial {
  RCC = 'rcc',
  METAL = 'metal',
  TILES = 'tile',
  ASPHALT = 'asphalt',
  THATCH = 'thatch',
}

export type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te';

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
];

export interface AssessmentData {
  lat: number;
  lng: number;
  roofArea: number;
  roofMaterial: RoofMaterial;
  openSpace: number;
  householdSize: number;
}

export interface RecommendedStructure {
  type: string;
  count: number;
  capacity: number;
  dimensions: string;
}

export interface ResultsData {
  feasibilityScore: 'High' | 'Moderate' | 'Low';
  annualHarvestableVolume: number;
  monsoonHarvestVolume: number;
  averageAnnualRainfall: number;
  estimatedAnnualSavings: number;
  paybackPeriod: number | null;
  totalEstimatedCost: number;
  recommendedStructures: RecommendedStructure[];
  averageDepthToGroundwater: number;
  locationName: string;
}