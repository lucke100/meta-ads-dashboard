'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layers, ArrowLeft, Megaphone } from 'lucide-react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import GlobalFilters, { useFilters } from '@/components/GlobalFilters';
import DataTable from '@/components/DataTable';
import { formatCurrency, formatNumber, formatPercent, getStatusLabel } from '@/lib/utils';
import type { AdSetData } from '@/lib/mock-data';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

function AdSetsContent() {
  const { filters } = useFilters();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaign_id') || '';
  const campaignName = searchParams.get('campaign_name') || '';
  const [adsets, setAdsets] = useState<AdSetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          date_from: filters.dateFrom,
          date_to: filters.dateTo,
          ...(campaignId ? { campaign_id: campaignId } : {}),
        });
        const res = await fetch(`/api/meta/adsets?${params}`);
        const data = await res.json();
        if (data.success) setAdsets(data.data);
      } catch (err) {
        console.error('Erro ao carregar conjuntos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters.dateFrom, filters.dateTo, campaignId]);

  const columns = [
    {
      key: 'name',
      label: 'Conjunto',
      render: (item: AdSetData) => (
        <div className="flex items-center gap-2 max-w-[220px]">
          <Layers size={14} className="text-purple-400 flex-shrink-0" />
          <span className="text-white font-medium truncate">{item.name}</span>
        </div>
      ),
    },
    {
      key: 'campaignName',
      label: 'Campanha',
      render: (item: AdSetData) => (
        <div className="flex items-center gap-1.5 max-w-[180px]">
          <Megaphone size={12} className="text-blue-400/60 flex-shrink-0" />
          <span className="text-slate-300 text-xs truncate">{item.campaignName}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: AdSetData) => (
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
      key: 'targetAudience',
      label: 'Público',
      render: (item: AdSetData) => <span className="text-xs text-slate-400">{item.targetAudience}</span>,
    },
    {
      key: 'budget',
      label: 'Orçamento',
      align: 'right' as const,
      render: (item: AdSetData) => (
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
      render: (item: AdSetData) => <span className="text-white font-medium">{formatCurrency(item.spend)}</span>,
    },
    {
      key: 'impressions',
      label: 'Impressões',
      align: 'right' as const,
      render: (item: AdSetData) => formatNumber(item.impressions),
    },
    {
      key: 'reach',
      label: 'Alcance',
      align: 'right' as const,
      render: (item: AdSetData) => formatNumber(item.reach),
    },
    {
      key: 'clicks',
      label: 'Cliques',
      align: 'right' as const,
      render: (item: AdSetData) => formatNumber(item.clicks),
    },
    {
      key: 'ctr',
      label: 'CTR',
      align: 'right' as const,
      render: (item: AdSetData) => (
        <span className={item.ctr >= 2 ? 'text-emerald-400' : item.ctr >= 1 ? 'text-amber-400' : 'text-red-400'}>
          {formatPercent(item.ctr)}
        </span>
      ),
    },
    {
      key: 'cpc',
      label: 'CPC',
      align: 'right' as const,
      render: (item: AdSetData) => formatCurrency(item.cpc),
    },
    {
      key: 'leads',
      label: 'Leads',
      align: 'right' as const,
      render: (item: AdSetData) => <span className="text-emerald-400 font-semibold">{formatNumber(item.leads)}</span>,
    },
    {
      key: 'costPerLead',
      label: 'CPL',
      align: 'right' as const,
      render: (item: AdSetData) => (
        <span className={item.costPerLead <= 15 ? 'text-emerald-400' : 'text-amber-400'}>
          {formatCurrency(item.costPerLead)}
        </span>
      ),
    },
  ];

  const spendByAdSet = adsets.map((a) => ({
    name: a.name.length > 20 ? a.name.slice(0, 20) + '...' : a.name,
    spend: a.spend,
    leads: a.leads,
  }));

  const pieData = adsets.map((a) => ({
    name: a.name.length > 15 ? a.name.slice(0, 15) + '...' : a.name,
    value: a.spend,
  }));

  return (
    <div>
      <div className="mb-6">
        {campaignName ? (
          <>
            <Link
              href="/dashboard/campaigns"
              className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 mb-2 transition-colors"
            >
              <ArrowLeft size={14} />
              Voltar para Campanhas
            </Link>
            <h1 className="text-2xl font-bold text-white mb-1">
              Conjuntos de Anúncios
            </h1>
            <div className="flex items-center gap-2">
              <Megaphone size={14} className="text-blue-400" />
              <p className="text-sm text-blue-400 font-medium">
                {decodeURIComponent(campaignName)}
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-1">Conjuntos de Anúncios</h1>
            <p className="text-sm text-slate-400">
              Análise detalhada por conjunto, público e saturação
            </p>
          </>
        )}
      </div>

      <GlobalFilters />

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="skeleton h-64 rounded-2xl" />
            <div className="skeleton h-64 rounded-2xl" />
          </div>
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Charts */}
          {adsets.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="chart-container">
                <h3 className="text-sm font-semibold text-white mb-4">Investimento por Conjunto</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={spendByAdSet} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                    <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" stroke="#475569" tick={{ fontSize: 10 }} width={120} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15,23,42,0.95)',
                        border: '1px solid rgba(148,163,184,0.2)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#e2e8f0',
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), 'Gasto']}
                    />
                    <Bar dataKey="spend" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3 className="text-sm font-semibold text-white mb-4">Distribuição de Investimento</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15,23,42,0.95)',
                        border: '1px solid rgba(148,163,184,0.2)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#e2e8f0',
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), 'Gasto']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Table */}
          <DataTable
            data={adsets}
            columns={columns}
            pageSize={10}
            searchPlaceholder="Buscar conjunto..."
          />
        </>
      )}
    </div>
  );
}

export default function AdSetsPage() {
  return (
    <Suspense fallback={<div className="skeleton h-96 rounded-2xl" />}>
      <AdSetsContent />
    </Suspense>
  );
}
