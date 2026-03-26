// =============================================
// Camada de Serviço - Meta Ads API
// =============================================
// SEGURANÇA: Este arquivo roda EXCLUSIVAMENTE no servidor.
// Todas as credenciais são lidas de variáveis de ambiente.
// NUNCA importe este arquivo em componentes client-side.
// =============================================

import {
  mockAccount,
  mockCampaigns,
  mockAdSets,
  mockAds,
  generateDailyInsights,
  getAggregatedMetrics,
  type AccountData,
  type CampaignData,
  type AdSetData,
  type AdData,
  type DailyInsight,
  type MetricData,
} from './mock-data';

// -------------------------------------------
// Configuração (lida de variáveis de ambiente)
// -------------------------------------------
function getConfig() {
  return {
    accessToken: process.env.META_ACCESS_TOKEN || '',
    adAccountId: process.env.META_AD_ACCOUNT_ID || '',
    appId: process.env.META_APP_ID || '',
    appSecret: process.env.META_APP_SECRET || '',
    apiVersion: process.env.META_API_VERSION || 'v23.0',
  };
}

function getBaseUrl(): string {
  const { apiVersion } = getConfig();
  return `https://graph.facebook.com/${apiVersion}`;
}

function isConfigured(): boolean {
  const config = getConfig();
  return !!(config.accessToken && config.adAccountId);
}

// -------------------------------------------
// Helper para requests à Meta API
// -------------------------------------------
async function metaFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const config = getConfig();
  const url = new URL(`${getBaseUrl()}${endpoint}`);

  url.searchParams.set('access_token', config.accessToken);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 300 }, // Cache por 5 minutos
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const errorMessage = error?.error?.message || `Meta API error: ${response.status}`;
    throw new MetaApiError(errorMessage, response.status, error?.error?.code);
  }

  return response.json();
}

// -------------------------------------------
// Classe de erro customizada
// -------------------------------------------
export class MetaApiError extends Error {
  statusCode: number;
  metaErrorCode?: number;

  constructor(message: string, statusCode: number, metaErrorCode?: number) {
    super(message);
    this.name = 'MetaApiError';
    this.statusCode = statusCode;
    this.metaErrorCode = metaErrorCode;
  }
}

// -------------------------------------------
// Funções de acesso à API
// -------------------------------------------

/**
 * Busca dados da conta de anúncios
 */
export async function getAccountInfo(): Promise<AccountData> {
  if (!isConfigured()) {
    return mockAccount;
  }

  const config = getConfig();
  interface MetaAccountResponse {
    id: string;
    name: string;
    currency: string;
    timezone_name: string;
    account_status: number;
  }

  const data = await metaFetch<MetaAccountResponse>(`/${config.adAccountId}`, {
    fields: 'id,name,currency,timezone_name,account_status',
  });

  return {
    id: data.id,
    name: data.name,
    currency: data.currency,
    timezone: data.timezone_name,
    status: data.account_status === 1 ? 'ACTIVE' : 'INACTIVE',
  };
}

/**
 * Busca campanhas com insights
 */
export async function getCampaigns(
  dateFrom?: string,
  dateTo?: string,
  status?: string
): Promise<CampaignData[]> {
  if (!isConfigured()) {
    let filtered = [...mockCampaigns];
    if (status && status !== 'ALL') {
      filtered = filtered.filter((c) => c.status === status);
    }
    return filtered;
  }

  const config = getConfig();
  const fields = [
    'id', 'name', 'status', 'objective',
    'daily_budget', 'lifetime_budget',
    'start_time', 'stop_time',
    'insights.time_range({"since":"' + (dateFrom || '2024-01-01') + '","until":"' + (dateTo || new Date().toISOString().split('T')[0]) + '"}){spend,impressions,reach,frequency,clicks,ctr,cpc,cpm,actions,cost_per_action_type}',
  ].join(',');

  interface MetaInsightAction {
    action_type: string;
    value: string;
  }
  interface MetaInsightData {
    spend?: string;
    impressions?: string;
    reach?: string;
    frequency?: string;
    clicks?: string;
    ctr?: string;
    cpc?: string;
    cpm?: string;
    actions?: MetaInsightAction[];
    cost_per_action_type?: MetaInsightAction[];
  }
  interface MetaCampaignResponse {
    data: Array<{
      id: string;
      name: string;
      status: string;
      objective: string;
      daily_budget?: string;
      lifetime_budget?: string;
      start_time?: string;
      stop_time?: string;
      insights?: { data: MetaInsightData[] };
    }>;
  }

  const data = await metaFetch<MetaCampaignResponse>(`/${config.adAccountId}/campaigns`, {
    fields,
    limit: '100',
    ...(status && status !== 'ALL' ? { filtering: JSON.stringify([{ field: 'status', operator: 'EQUAL', value: status }]) } : {}),
  });

  return data.data.map((campaign) => {
    const insight = campaign.insights?.data?.[0] || {} as MetaInsightData;
    const leads = getActionValue(insight.actions, 'lead');
    const conversions = getActionValue(insight.actions, 'offsite_conversion');
    const spend = parseFloat(insight.spend || '0');

    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status as CampaignData['status'],
      objective: campaign.objective,
      budget: parseFloat(campaign.daily_budget || campaign.lifetime_budget || '0') / 100,
      budgetType: campaign.daily_budget ? 'daily' as const : 'lifetime' as const,
      spend,
      impressions: parseInt(insight.impressions || '0'),
      reach: parseInt(insight.reach || '0'),
      frequency: parseFloat(insight.frequency || '0'),
      clicks: parseInt(insight.clicks || '0'),
      ctr: parseFloat(insight.ctr || '0'),
      cpc: parseFloat(insight.cpc || '0'),
      cpm: parseFloat(insight.cpm || '0'),
      leads,
      costPerLead: leads > 0 ? Math.round((spend / leads) * 100) / 100 : 0,
      conversions,
      startDate: campaign.start_time?.split('T')[0] || '',
      endDate: campaign.stop_time?.split('T')[0] || null,
    };
  });
}

/**
 * Busca conjuntos de anúncios com insights
 */
export async function getAdSets(
  dateFrom?: string,
  dateTo?: string,
  campaignId?: string
): Promise<AdSetData[]> {
  if (!isConfigured()) {
    let filtered = [...mockAdSets];
    if (campaignId) {
      filtered = filtered.filter((a) => a.campaignId === campaignId);
    }
    return filtered;
  }

  const config = getConfig();
  const fields = [
    'id', 'name', 'campaign_id', 'campaign{name}', 'status',
    'daily_budget', 'lifetime_budget', 'targeting',
    'insights.time_range({"since":"' + (dateFrom || '2024-01-01') + '","until":"' + (dateTo || new Date().toISOString().split('T')[0]) + '"}){spend,impressions,reach,clicks,ctr,cpc,actions,cost_per_action_type}',
  ].join(',');

  interface MetaAdSetResponse {
    data: Array<{
      id: string;
      name: string;
      campaign_id: string;
      campaign?: { name: string };
      status: string;
      daily_budget?: string;
      lifetime_budget?: string;
      targeting?: { age_min?: number; age_max?: number; genders?: number[] };
      insights?: { data: Array<{ spend?: string; impressions?: string; reach?: string; clicks?: string; ctr?: string; cpc?: string; actions?: Array<{ action_type: string; value: string }>; cost_per_action_type?: Array<{ action_type: string; value: string }> }> };
    }>;
  }

  const data = await metaFetch<MetaAdSetResponse>(`/${config.adAccountId}/adsets`, {
    fields,
    limit: '100',
    ...(campaignId ? { filtering: JSON.stringify([{ field: 'campaign.id', operator: 'EQUAL', value: campaignId }]) } : {}),
  });

  return data.data.map((adset) => {
    const insight = adset.insights?.data?.[0] || {};
    const leads = getActionValue(insight.actions, 'lead');
    const spend = parseFloat(insight.spend || '0');

    return {
      id: adset.id,
      name: adset.name,
      campaignId: adset.campaign_id,
      campaignName: adset.campaign?.name || '',
      status: adset.status as AdSetData['status'],
      budget: parseFloat(adset.daily_budget || adset.lifetime_budget || '0') / 100,
      budgetType: adset.daily_budget ? 'daily' as const : 'lifetime' as const,
      spend,
      impressions: parseInt(insight.impressions || '0'),
      reach: parseInt(insight.reach || '0'),
      clicks: parseInt(insight.clicks || '0'),
      ctr: parseFloat(insight.ctr || '0'),
      cpc: parseFloat(insight.cpc || '0'),
      leads,
      costPerLead: leads > 0 ? Math.round((spend / leads) * 100) / 100 : 0,
      targetAudience: adset.targeting ? `${adset.targeting.age_min || 18}-${adset.targeting.age_max || 65}` : 'N/A',
    };
  });
}

/**
 * Busca anúncios com insights
 */
export async function getAds(
  dateFrom?: string,
  dateTo?: string,
  adSetId?: string
): Promise<AdData[]> {
  if (!isConfigured()) {
    let filtered = [...mockAds];
    if (adSetId) {
      filtered = filtered.filter((a) => a.adSetId === adSetId);
    }
    return filtered;
  }

  const config = getConfig();
  const fields = [
    'id', 'name', 'campaign_id', 'adset_id', 'status',
    'insights.time_range({"since":"' + (dateFrom || '2024-01-01') + '","until":"' + (dateTo || new Date().toISOString().split('T')[0]) + '"}){spend,impressions,clicks,ctr,cpc,actions,cost_per_action_type}',
  ].join(',');

  interface MetaAdResponse {
    data: Array<{
      id: string;
      name: string;
      campaign_id: string;
      adset_id: string;
      status: string;
      insights?: { data: Array<{ spend?: string; impressions?: string; clicks?: string; ctr?: string; cpc?: string; actions?: Array<{ action_type: string; value: string }> }> };
    }>;
  }

  const data = await metaFetch<MetaAdResponse>(`/${config.adAccountId}/ads`, {
    fields,
    limit: '100',
    ...(adSetId ? { filtering: JSON.stringify([{ field: 'adset.id', operator: 'EQUAL', value: adSetId }]) } : {}),
  });

  return data.data.map((ad, index) => {
    const insight = ad.insights?.data?.[0] || {};
    const leads = getActionValue(insight.actions, 'lead');
    const spend = parseFloat(insight.spend || '0');

    return {
      id: ad.id,
      name: ad.name,
      campaignId: ad.campaign_id,
      campaignName: '',
      adSetId: ad.adset_id,
      adSetName: '',
      status: ad.status as AdData['status'],
      spend,
      impressions: parseInt(insight.impressions || '0'),
      clicks: parseInt(insight.clicks || '0'),
      ctr: parseFloat(insight.ctr || '0'),
      cpc: parseFloat(insight.cpc || '0'),
      leads,
      costPerLead: leads > 0 ? Math.round((spend / leads) * 100) / 100 : 0,
      performanceRank: index + 1,
    };
  });
}

/**
 * Busca insights diários agregados
 */
export async function getInsights(
  dateFrom?: string,
  dateTo?: string
): Promise<{ daily: DailyInsight[]; aggregated: MetricData }> {
  if (!isConfigured()) {
    const daily = generateDailyInsights(30);
    return { daily, aggregated: getAggregatedMetrics(daily) };
  }

  const config = getConfig();
  const since = dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const until = dateTo || new Date().toISOString().split('T')[0];

  interface MetaInsightsResponse {
    data: Array<{
      date_start: string;
      spend?: string;
      impressions?: string;
      reach?: string;
      clicks?: string;
      ctr?: string;
      cpc?: string;
      cpm?: string;
      actions?: Array<{ action_type: string; value: string }>;
    }>;
  }

  const data = await metaFetch<MetaInsightsResponse>(`/${config.adAccountId}/insights`, {
    fields: 'spend,impressions,reach,clicks,ctr,cpc,cpm,actions,cost_per_action_type',
    time_range: JSON.stringify({ since, until }),
    time_increment: '1',
    limit: '90',
  });

  const daily: DailyInsight[] = data.data.map((day) => {
    const leads = getActionValue(day.actions, 'lead');
    const conversions = getActionValue(day.actions, 'offsite_conversion');
    const spend = parseFloat(day.spend || '0');
    const impressions = parseInt(day.impressions || '0');
    const clicks = parseInt(day.clicks || '0');

    return {
      date: day.date_start,
      spend,
      impressions,
      reach: parseInt(day.reach || '0'),
      clicks,
      leads,
      conversions,
      ctr: parseFloat(day.ctr || '0'),
      cpc: parseFloat(day.cpc || '0'),
      cpm: parseFloat(day.cpm || '0'),
      costPerLead: leads > 0 ? Math.round((spend / leads) * 100) / 100 : 0,
    };
  });

  return { daily, aggregated: getAggregatedMetrics(daily) };
}

// -------------------------------------------
// Helpers
// -------------------------------------------
function getActionValue(
  actions: Array<{ action_type: string; value: string }> | undefined,
  actionType: string
): number {
  if (!actions) return 0;
  const action = actions.find((a) => a.action_type === actionType);
  return action ? parseInt(action.value) : 0;
}
