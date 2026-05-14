import { create } from 'zustand';
import type { DistrictData, SegmentWeights } from '../types';
import rawData from '../data/urbanis_data.json';
import { SEGMENTS } from '../config/segments';

interface UrbanStore {
  selectedSegment: string;
  districts: DistrictData[];
  setSegment: (segment: string) => void;
  calculateScores: (segment: string) => void;
}

export const useUrbanStore = create<UrbanStore>((set, get) => ({
  selectedSegment: "Logística Last-Mile",
  districts: [],

  setSegment: (segment: string) => {
    set({ selectedSegment: segment });
    get().calculateScores(segment);
  },

  calculateScores: (segment: string) => {
    const weights: SegmentWeights = SEGMENTS[segment];
    if (!weights) return;

    const { infra, market, risk, balance, alpha } = weights;

    const scoredDistricts = (rawData as DistrictData[]).map((d) => {
      // Camada 1: Infraestrutura
      const infraScore = d.dens_norm * infra.dens + d.mob_norm * infra.mob;

      // Camada 2: Mercado
      const marketScore =
        d.central_norm * market.central +
        d.pop_norm * market.pop +
        d.idade_norm * market.idade;

      // Camada 3: Oportunidade Consolidada
      const opportunityScore =
        infraScore * balance.infra + marketScore * balance.market;

      // Camada 4: Risco Multiplicativo
      const riskScore = d.crime_norm * risk.crime + d.vulner_norm * risk.socio;

      // Equação Final v4.1
      let urbanScore = opportunityScore * (1 - alpha * riskScore);
      urbanScore = Math.max(0, Math.min(1, urbanScore)) * 100;

      return {
        ...d,
        InfraScore: infraScore,
        MarketScore: marketScore,
        OpportunityScore: opportunityScore,
        RiskScore: riskScore,
        UrbanScore: urbanScore,
      };
    });

    // Ordenar pelo UrbanScore decrescente
    scoredDistricts.sort((a, b) => (b.UrbanScore || 0) - (a.UrbanScore || 0));

    set({ districts: scoredDistricts });
  },
}));

// Initialize the store immediately
useUrbanStore.getState().calculateScores(useUrbanStore.getState().selectedSegment);
