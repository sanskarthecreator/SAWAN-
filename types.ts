
export enum RoofMaterial {
  RCC = 'rcc',
  METAL = 'metal',
  TILES = 'tile',
  ASPHALT = 'asphalt',
  THATCH = 'thatch',
}

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
  aquiferNote: string;
}
