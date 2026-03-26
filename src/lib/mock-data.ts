// =============================================
// Dados mockados para desenvolvimento sem credenciais Meta
// Estes dados são usados quando META_ACCESS_TOKEN não está configurado
// =============================================

import { format, subDays } from 'date-fns';

export interface MetricData {
  spend: number;
  impressions: number;
  reach: number;
  frequency: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  leads: number;
  conversions: number;
  costPerLead: number;
  costPerConversion: number;
  roas: number;
}

export interface CampaignData {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED';
  objective: string;
  budget: number;
  budgetType: 'daily' | 'lifetime';
  spend: number;
  impressions: number;
  reach: number;
  frequency: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  leads: number;
  costPerLead: number;
  conversions: number;
  startDate: string;
  endDate: string | null;
}

export interface AdSetData {
  id: string;
  name: string;
  campaignId: string;
  campaignName: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED';
  budget: number;
  budgetType: 'daily' | 'lifetime';
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpc: number;
  leads: number;
  costPerLead: number;
  targetAudience: string;
}

export interface AdData {
  id: string;
  name: string;
  campaignId: string;
  campaignName: string;
  adSetId: string;
  adSetName: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED';
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  leads: number;
  costPerLead: number;
  performanceRank: number;
}

export interface DailyInsight {
  date: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  leads: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  costPerLead: number;
}

export interface AccountData {
  id: string;
  name: string;
  currency: string;
  timezone: string;
  status: string;
}

// Dados da conta
export const mockAccount: AccountData = {
  id: 'act_123456789',
  name: 'Minha Empresa - Ads',
  currency: 'BRL',
  timezone: 'America/Sao_Paulo',
  status: 'ACTIVE',
};

// Campanhas mockadas
export const mockCampaigns: CampaignData[] = [
  {
    id: 'camp_001',
    name: 'Campanha de Leads - Landing Page',
    status: 'ACTIVE',
    objective: 'LEAD_GENERATION',
    budget: 150,
    budgetType: 'daily',
    spend: 3245.67,
    impressions: 285000,
    reach: 142500,
    frequency: 2.0,
    clicks: 8550,
    ctr: 3.0,
    cpc: 0.38,
    cpm: 11.39,
    leads: 342,
    costPerLead: 9.49,
    conversions: 89,
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: null,
  },
  {
    id: 'camp_002',
    name: 'Campanha de Conversão - E-commerce',
    status: 'ACTIVE',
    objective: 'CONVERSIONS',
    budget: 200,
    budgetType: 'daily',
    spend: 4520.12,
    impressions: 412000,
    reach: 206000,
    frequency: 2.0,
    clicks: 12360,
    ctr: 3.0,
    cpc: 0.37,
    cpm: 10.97,
    leads: 185,
    costPerLead: 24.43,
    conversions: 156,
    startDate: format(subDays(new Date(), 45), 'yyyy-MM-dd'),
    endDate: null,
  },
  {
    id: 'camp_003',
    name: 'Remarketing - Carrinho Abandonado',
    status: 'ACTIVE',
    objective: 'CONVERSIONS',
    budget: 80,
    budgetType: 'daily',
    spend: 1890.34,
    impressions: 156000,
    reach: 52000,
    frequency: 3.0,
    clicks: 6240,
    ctr: 4.0,
    cpc: 0.30,
    cpm: 12.12,
    leads: 78,
    costPerLead: 24.23,
    conversions: 210,
    startDate: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
    endDate: null,
  },
  {
    id: 'camp_004',
    name: 'Brand Awareness - Institucional',
    status: 'PAUSED',
    objective: 'BRAND_AWARENESS',
    budget: 50,
    budgetType: 'daily',
    spend: 980.45,
    impressions: 320000,
    reach: 280000,
    frequency: 1.14,
    clicks: 3200,
    ctr: 1.0,
    cpc: 0.31,
    cpm: 3.06,
    leads: 0,
    costPerLead: 0,
    conversions: 0,
    startDate: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    endDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
  },
  {
    id: 'camp_005',
    name: 'Campanha de Tráfego - Blog',
    status: 'ACTIVE',
    objective: 'LINK_CLICKS',
    budget: 30,
    budgetType: 'daily',
    spend: 645.89,
    impressions: 89000,
    reach: 67000,
    frequency: 1.33,
    clicks: 4450,
    ctr: 5.0,
    cpc: 0.15,
    cpm: 7.26,
    leads: 45,
    costPerLead: 14.35,
    conversions: 12,
    startDate: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
    endDate: null,
  },
  {
    id: 'camp_006',
    name: 'Promoção Black Friday',
    status: 'ARCHIVED',
    objective: 'CONVERSIONS',
    budget: 500,
    budgetType: 'lifetime',
    spend: 498.50,
    impressions: 210000,
    reach: 140000,
    frequency: 1.5,
    clicks: 8400,
    ctr: 4.0,
    cpc: 0.06,
    cpm: 2.37,
    leads: 420,
    costPerLead: 1.19,
    conversions: 380,
    startDate: format(subDays(new Date(), 120), 'yyyy-MM-dd'),
    endDate: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
  },
];

// Conjuntos de anúncios mockados
export const mockAdSets: AdSetData[] = [
  {
    id: 'adset_001',
    name: 'Público Lookalike 1% - Leads',
    campaignId: 'camp_001',
    campaignName: 'Campanha de Leads - Landing Page',
    status: 'ACTIVE',
    budget: 80,
    budgetType: 'daily',
    spend: 1780.23,
    impressions: 156000,
    reach: 78000,
    clicks: 4680,
    ctr: 3.0,
    cpc: 0.38,
    leads: 205,
    costPerLead: 8.68,
    targetAudience: 'Lookalike 1% - Compradores',
  },
  {
    id: 'adset_002',
    name: 'Interesse - Marketing Digital',
    campaignId: 'camp_001',
    campaignName: 'Campanha de Leads - Landing Page',
    status: 'ACTIVE',
    budget: 70,
    budgetType: 'daily',
    spend: 1465.44,
    impressions: 129000,
    reach: 64500,
    clicks: 3870,
    ctr: 3.0,
    cpc: 0.38,
    leads: 137,
    costPerLead: 10.70,
    targetAudience: 'Interesse em Marketing Digital',
  },
  {
    id: 'adset_003',
    name: 'Remarketing - Visitantes Site 30d',
    campaignId: 'camp_003',
    campaignName: 'Remarketing - Carrinho Abandonado',
    status: 'ACTIVE',
    budget: 40,
    budgetType: 'daily',
    spend: 945.17,
    impressions: 78000,
    reach: 26000,
    clicks: 3120,
    ctr: 4.0,
    cpc: 0.30,
    leads: 39,
    costPerLead: 24.24,
    targetAudience: 'Visitantes do site - 30 dias',
  },
  {
    id: 'adset_004',
    name: 'Remarketing - Carrinho 7d',
    campaignId: 'camp_003',
    campaignName: 'Remarketing - Carrinho Abandonado',
    status: 'ACTIVE',
    budget: 40,
    budgetType: 'daily',
    spend: 945.17,
    impressions: 78000,
    reach: 26000,
    clicks: 3120,
    ctr: 4.0,
    cpc: 0.30,
    leads: 39,
    costPerLead: 24.24,
    targetAudience: 'Carrinho abandonado - 7 dias',
  },
  {
    id: 'adset_005',
    name: 'Público Amplo - Conversões',
    campaignId: 'camp_002',
    campaignName: 'Campanha de Conversão - E-commerce',
    status: 'ACTIVE',
    budget: 100,
    budgetType: 'daily',
    spend: 2260.06,
    impressions: 206000,
    reach: 103000,
    clicks: 6180,
    ctr: 3.0,
    cpc: 0.37,
    leads: 92,
    costPerLead: 24.57,
    targetAudience: 'Público Amplo Advantage+',
  },
  {
    id: 'adset_006',
    name: 'Lookalike 2% - Conversões',
    campaignId: 'camp_002',
    campaignName: 'Campanha de Conversão - E-commerce',
    status: 'PAUSED',
    budget: 100,
    budgetType: 'daily',
    spend: 2260.06,
    impressions: 206000,
    reach: 103000,
    clicks: 6180,
    ctr: 3.0,
    cpc: 0.37,
    leads: 93,
    costPerLead: 24.30,
    targetAudience: 'Lookalike 2% - Compradores',
  },
];

// Anúncios mockados
export const mockAds: AdData[] = [
  {
    id: 'ad_001',
    name: 'Criativo 1 - Vídeo Depoimento',
    campaignId: 'camp_001',
    campaignName: 'Campanha de Leads - Landing Page',
    adSetId: 'adset_001',
    adSetName: 'Público Lookalike 1% - Leads',
    status: 'ACTIVE',
    spend: 890.12,
    impressions: 78000,
    clicks: 2340,
    ctr: 3.0,
    cpc: 0.38,
    leads: 115,
    costPerLead: 7.74,
    performanceRank: 1,
  },
  {
    id: 'ad_002',
    name: 'Criativo 2 - Carrossel Produtos',
    campaignId: 'camp_001',
    campaignName: 'Campanha de Leads - Landing Page',
    adSetId: 'adset_001',
    adSetName: 'Público Lookalike 1% - Leads',
    status: 'ACTIVE',
    spend: 890.11,
    impressions: 78000,
    clicks: 2340,
    ctr: 3.0,
    cpc: 0.38,
    leads: 90,
    costPerLead: 9.89,
    performanceRank: 3,
  },
  {
    id: 'ad_003',
    name: 'Criativo 3 - Imagem Estática CTA',
    campaignId: 'camp_001',
    campaignName: 'Campanha de Leads - Landing Page',
    adSetId: 'adset_002',
    adSetName: 'Interesse - Marketing Digital',
    status: 'ACTIVE',
    spend: 732.72,
    impressions: 64500,
    clicks: 1935,
    ctr: 3.0,
    cpc: 0.38,
    leads: 68,
    costPerLead: 10.78,
    performanceRank: 4,
  },
  {
    id: 'ad_004',
    name: 'Criativo 4 - Stories Vertical',
    campaignId: 'camp_001',
    campaignName: 'Campanha de Leads - Landing Page',
    adSetId: 'adset_002',
    adSetName: 'Interesse - Marketing Digital',
    status: 'PAUSED',
    spend: 732.72,
    impressions: 64500,
    clicks: 1935,
    ctr: 3.0,
    cpc: 0.38,
    leads: 69,
    costPerLead: 10.62,
    performanceRank: 5,
  },
  {
    id: 'ad_005',
    name: 'Remarketing - Oferta Especial',
    campaignId: 'camp_003',
    campaignName: 'Remarketing - Carrinho Abandonado',
    adSetId: 'adset_003',
    adSetName: 'Remarketing - Visitantes Site 30d',
    status: 'ACTIVE',
    spend: 472.58,
    impressions: 39000,
    clicks: 1560,
    ctr: 4.0,
    cpc: 0.30,
    leads: 20,
    costPerLead: 23.63,
    performanceRank: 6,
  },
  {
    id: 'ad_006',
    name: 'Remarketing - Última Chance',
    campaignId: 'camp_003',
    campaignName: 'Remarketing - Carrinho Abandonado',
    adSetId: 'adset_004',
    adSetName: 'Remarketing - Carrinho 7d',
    status: 'ACTIVE',
    spend: 472.59,
    impressions: 39000,
    clicks: 1560,
    ctr: 4.0,
    cpc: 0.30,
    leads: 19,
    costPerLead: 24.87,
    performanceRank: 7,
  },
  {
    id: 'ad_007',
    name: 'E-commerce - Produto Destaque',
    campaignId: 'camp_002',
    campaignName: 'Campanha de Conversão - E-commerce',
    adSetId: 'adset_005',
    adSetName: 'Público Amplo - Conversões',
    status: 'ACTIVE',
    spend: 1130.03,
    impressions: 103000,
    clicks: 3090,
    ctr: 3.0,
    cpc: 0.37,
    leads: 48,
    costPerLead: 23.54,
    performanceRank: 2,
  },
  {
    id: 'ad_008',
    name: 'E-commerce - Coleção Nova',
    campaignId: 'camp_002',
    campaignName: 'Campanha de Conversão - E-commerce',
    adSetId: 'adset_005',
    adSetName: 'Público Amplo - Conversões',
    status: 'ACTIVE',
    spend: 1130.03,
    impressions: 103000,
    clicks: 3090,
    ctr: 3.0,
    cpc: 0.37,
    leads: 44,
    costPerLead: 25.68,
    performanceRank: 8,
  },
];

// Gerar insights diários dos últimos 30 dias
export function generateDailyInsights(days: number = 30): DailyInsight[] {
  const insights: DailyInsight[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const baseSpend = 350 + Math.random() * 150;
    const impressions = Math.floor(40000 + Math.random() * 20000);
    const reach = Math.floor(impressions * (0.4 + Math.random() * 0.3));
    const clicks = Math.floor(impressions * (0.025 + Math.random() * 0.02));
    const leads = Math.floor(clicks * (0.03 + Math.random() * 0.04));
    const conversions = Math.floor(leads * (0.3 + Math.random() * 0.4));

    insights.push({
      date: format(date, 'yyyy-MM-dd'),
      spend: Math.round(baseSpend * 100) / 100,
      impressions,
      reach,
      clicks,
      leads,
      conversions,
      ctr: Math.round((clicks / impressions) * 10000) / 100,
      cpc: Math.round((baseSpend / clicks) * 100) / 100,
      cpm: Math.round((baseSpend / impressions) * 100000) / 100,
      costPerLead: leads > 0 ? Math.round((baseSpend / leads) * 100) / 100 : 0,
    });
  }

  return insights;
}

// Métricas agregadas
export function getAggregatedMetrics(insights: DailyInsight[]): MetricData {
  const totals = insights.reduce(
    (acc, day) => ({
      spend: acc.spend + day.spend,
      impressions: acc.impressions + day.impressions,
      reach: acc.reach + day.reach,
      clicks: acc.clicks + day.clicks,
      leads: acc.leads + day.leads,
      conversions: acc.conversions + day.conversions,
    }),
    { spend: 0, impressions: 0, reach: 0, clicks: 0, leads: 0, conversions: 0 }
  );

  return {
    spend: Math.round(totals.spend * 100) / 100,
    impressions: totals.impressions,
    reach: totals.reach,
    frequency: totals.reach > 0 ? Math.round((totals.impressions / totals.reach) * 100) / 100 : 0,
    clicks: totals.clicks,
    ctr: totals.impressions > 0 ? Math.round((totals.clicks / totals.impressions) * 10000) / 100 : 0,
    cpc: totals.clicks > 0 ? Math.round((totals.spend / totals.clicks) * 100) / 100 : 0,
    cpm: totals.impressions > 0 ? Math.round((totals.spend / totals.impressions) * 100000) / 100 : 0,
    leads: totals.leads,
    conversions: totals.conversions,
    costPerLead: totals.leads > 0 ? Math.round((totals.spend / totals.leads) * 100) / 100 : 0,
    costPerConversion: totals.conversions > 0 ? Math.round((totals.spend / totals.conversions) * 100) / 100 : 0,
    roas: totals.spend > 0 ? Math.round((totals.conversions * 97.5 / totals.spend) * 100) / 100 : 0,
  };
}
