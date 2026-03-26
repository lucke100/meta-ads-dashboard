'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Megaphone, ExternalLink } from 'lucide-react';
import GlobalFilters, { useFilters } from '@/components/GlobalFilters';
import DataTable from '@/components/DataTable';
import { formatCurrency, formatNumber, formatPercent, getStatusLabel, getObjectiveLabel } from '@/lib/utils';
import type { CampaignData } from '@/lib/mock-data';

export default function CampaignsPage() {
  const { filters } = useFilters();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          date_from: filters.dateFrom,
          date_to: filters.dateTo,
          ...(filters.status !== 'ALL' ? { status: filters.status } : {}),
        });
        const res = await fetch(`/api/meta/campaigns?${params}`);
        const data = await res.json();
        if (data.success) setCampaigns(data.data);
      } catch (err) {
        console.error('Erro ao carregar campanhas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters.dateFrom, filters.dateTo, filters.status]);

  const columns = [
    {
      key: 'name',
      label: 'Campanha',
      render: (item: CampaignData) => (
        <button
          onClick={() => router.push(`/dashboard/adsets?campaign_id=${item.id}&campaign_name=${encodeURIComponent(item.name)}`)}
          className="flex items-center gap-2 max-w-[250px] group text-left"
        >
          <Megaphone size={14} className="text-blue-400 flex-shrink-0" />
          <span className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">{item.name}</span>
          <ExternalLink size={12} className="text-slate-600 group-hover:text-blue-400 flex-shrink-0 transition-colors" />
        </button>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: CampaignData) => (
        <span className={`status-badge ${
          item.status === 'ACTIVE' ? 'status-active' :
          item.status === 'PAUSED' ? 'status-paused' : 'status-archived'
        }`}>
          <span className={`pulse-dot ${
            item.status === 'ACTIVE' ? 'bg-emerald-400' :
            item.status === 'PAUSED' ? 'bg-amber-400' : 'bg-gray-400'
          }`} />
          {getStatusLabel(item.status)}
        </span>
      ),
    },
    {
      key: 'objective',
      label: 'Objetivo',
      render: (item: CampaignData) => (
        <span className="text-slate-300 text-xs">{getObjectiveLabel(item.objective)}</span>
      ),
    },
    {
      key: 'budget',
      label: 'Orçamento',
      align: 'right' as const,
      render: (item: CampaignData) => (
        <div className="text-right">
          <div className="text-white">{formatCurrency(item.budget)}</div>
          <div className="text-xs text-slate-500">{item.budgetType === 'daily' ? '/dia' : 'total'}</div>
        </div>
      ),
    },
    {
      key: 'spend',
      label: 'Gasto',
      align: 'right' as const,
      render: (item: CampaignData) => <span className="text-white font-medium">{formatCurrency(item.spend)}</span>,
    },
    {
      key: 'impressions',
      label: 'Impressões',
      align: 'right' as const,
      render: (item: CampaignData) => formatNumber(item.impressions),
    },
    {
      key: 'reach',
      label: 'Alcance',
      align: 'right' as const,
      render: (item: CampaignData) => formatNumber(item.reach),
    },
    {
      key: 'frequency',
      label: 'Freq.',
      align: 'right' as const,
      render: (item: CampaignData) => item.frequency.toFixed(2),
    },
    {
      key: 'clicks',
      label: 'Cliques',
      align: 'right' as const,
      render: (item: CampaignData) => formatNumber(item.clicks),
    },
    {
      key: 'ctr',
      label: 'CTR',
      align: 'right' as const,
      render: (item: CampaignData) => (
        <span className={item.ctr >= 2 ? 'text-emerald-400' : item.ctr >= 1 ? 'text-amber-400' : 'text-red-400'}>
          {formatPercent(item.ctr)}
        </span>
      ),
    },
    {
      key: 'cpc',
      label: 'CPC',
      align: 'right' as const,
      render: (item: CampaignData) => formatCurrency(item.cpc),
    },
    {
      key: 'cpm',
      label: 'CPM',
      align: 'right' as const,
      render: (item: CampaignData) => formatCurrency(item.cpm),
    },
    {
      key: 'leads',
      label: 'Leads',
      align: 'right' as const,
      render: (item: CampaignData) => (
        <span className="text-emerald-400 font-semibold">{formatNumber(item.leads)}</span>
      ),
    },
    {
      key: 'costPerLead',
      label: 'CPL',
      align: 'right' as const,
      render: (item: CampaignData) => (
        <span className={item.costPerLead > 0 ? (item.costPerLead <= 15 ? 'text-emerald-400' : 'text-amber-400') : 'text-slate-500'}>
          {item.costPerLead > 0 ? formatCurrency(item.costPerLead) : '-'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Campanhas</h1>
        <p className="text-sm text-slate-400">
          Clique em uma campanha para ver seus conjuntos de anúncios
        </p>
      </div>

      <GlobalFilters />

      {loading ? (
        <div className="skeleton h-96 rounded-2xl" />
      ) : (
        <DataTable
          data={campaigns}
          columns={columns}
          pageSize={10}
          searchPlaceholder="Buscar campanha..."
        />
      )}
    </div>
  );
}
