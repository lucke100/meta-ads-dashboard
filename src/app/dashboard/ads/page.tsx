'use client';

import { useEffect, useState } from 'react';
import { FileImage, Trophy } from 'lucide-react';
import GlobalFilters, { useFilters } from '@/components/GlobalFilters';
import DataTable from '@/components/DataTable';
import { formatCurrency, formatNumber, formatPercent, getStatusLabel } from '@/lib/utils';
import type { AdData } from '@/lib/mock-data';

export default function AdsPage() {
  const { filters } = useFilters();
  const [ads, setAds] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          date_from: filters.dateFrom,
          date_to: filters.dateTo,
        });
        const res = await fetch(`/api/meta/ads?${params}`);
        const data = await res.json();
        if (data.success) setAds(data.data);
      } catch (err) {
        console.error('Erro ao carregar anúncios:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters.dateFrom, filters.dateTo]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400/15 text-amber-400 border border-amber-400/30"><Trophy size={10} /> #1</span>;
    if (rank === 2) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-300/15 text-slate-300 border border-slate-300/30"><Trophy size={10} /> #2</span>;
    if (rank === 3) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-700/15 text-amber-600 border border-amber-600/30"><Trophy size={10} /> #3</span>;
    return <span className="text-xs text-slate-500">#{rank}</span>;
  };

  const columns = [
    {
      key: 'performanceRank',
      label: 'Rank',
      render: (item: AdData) => getRankBadge(item.performanceRank),
    },
    {
      key: 'name',
      label: 'Anúncio',
      render: (item: AdData) => (
        <div className="flex items-center gap-2 max-w-[200px]">
          <FileImage size={14} className="text-pink-400 flex-shrink-0" />
          <span className="text-white font-medium truncate">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'campaignName',
      label: 'Campanha',
      render: (item: AdData) => (
        <span className="text-slate-300 text-xs truncate max-w-[160px] block">{item.campaignName}</span>
      ),
    },
    {
      key: 'adSetName',
      label: 'Conjunto',
      render: (item: AdData) => (
        <span className="text-slate-400 text-xs truncate max-w-[160px] block">{item.adSetName}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: AdData) => (
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
      key: 'spend',
      label: 'Investimento',
      align: 'right' as const,
      render: (item: AdData) => <span className="text-white font-medium">{formatCurrency(item.spend)}</span>,
    },
    {
      key: 'impressions',
      label: 'Impressões',
      align: 'right' as const,
      render: (item: AdData) => formatNumber(item.impressions),
    },
    {
      key: 'clicks',
      label: 'Cliques',
      align: 'right' as const,
      render: (item: AdData) => formatNumber(item.clicks),
    },
    {
      key: 'ctr',
      label: 'CTR',
      align: 'right' as const,
      render: (item: AdData) => (
        <span className={item.ctr >= 2 ? 'text-emerald-400' : item.ctr >= 1 ? 'text-amber-400' : 'text-red-400'}>
          {formatPercent(item.ctr)}
        </span>
      ),
    },
    {
      key: 'cpc',
      label: 'CPC',
      align: 'right' as const,
      render: (item: AdData) => formatCurrency(item.cpc),
    },
    {
      key: 'leads',
      label: 'Leads',
      align: 'right' as const,
      render: (item: AdData) => <span className="text-emerald-400 font-semibold">{formatNumber(item.leads)}</span>,
    },
    {
      key: 'costPerLead',
      label: 'CPL',
      align: 'right' as const,
      render: (item: AdData) => (
        <span className={item.costPerLead <= 15 ? 'text-emerald-400' : 'text-amber-400'}>
          {formatCurrency(item.costPerLead)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Anúncios</h1>
        <p className="text-sm text-slate-400">
          Ranking de desempenho e métricas individuais de cada anúncio
        </p>
      </div>

      <GlobalFilters />

      {loading ? (
        <div className="skeleton h-96 rounded-2xl" />
      ) : (
        <DataTable
          data={ads}
          columns={columns}
          pageSize={10}
          searchPlaceholder="Buscar anúncio..."
        />
      )}
    </div>
  );
}
