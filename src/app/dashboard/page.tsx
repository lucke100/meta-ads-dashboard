'use client';

import { useEffect, useState } from 'react';
import {
  DollarSign,
  Eye,
  Users,
  MousePointerClick,
  BarChart3,
  Target,
  TrendingUp,
  Percent,
  Zap,
  CreditCard,
  UserCheck,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import GlobalFilters, { useFilters } from '@/components/GlobalFilters';
import MetricCard from '@/components/MetricCard';
import type { DailyInsight, MetricData } from '@/lib/mock-data';

interface InsightsResponse {
  success: boolean;
  data: {
    daily: DailyInsight[];
    aggregated: MetricData;
  };
}

export default function DashboardPage() {
  const { filters } = useFilters();
  const [insights, setInsights] = useState<InsightsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/meta/insights?date_from=${filters.dateFrom}&date_to=${filters.dateTo}`
        );
        const data: InsightsResponse = await res.json();
        if (data.success) {
          setInsights(data.data);
        }
      } catch (err) {
        console.error('Erro ao carregar insights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters.dateFrom, filters.dateTo]);

  if (loading || !insights) {
    return (
      <div>
        <GlobalFilters />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { daily, aggregated } = insights;
  const m = aggregated;

  // Multiplier estável (constante), não aleatório
  const prevMultiplier = 0.92;

  const chartData = daily.map((d) => ({
    ...d,
    date: d.date.slice(5),
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard Geral</h1>
        <p className="text-sm text-slate-400">
          Visão geral de desempenho das suas campanhas Meta Ads
        </p>
      </div>

      <GlobalFilters />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        <MetricCard
          title="Valor Gasto"
          value={m.spend}
          previousValue={m.spend * prevMultiplier}
          format="currency"
          icon={<DollarSign size={20} className="text-blue-400" />}
          colorClass="metric-card-blue"
          delay={1}
        />
        <MetricCard
          title="Impressões"
          value={m.impressions}
          previousValue={m.impressions * prevMultiplier}
          format="compact"
          icon={<Eye size={20} className="text-purple-400" />}
          colorClass="metric-card-purple"
          delay={2}
        />
        <MetricCard
          title="Alcance"
          value={m.reach}
          previousValue={m.reach * prevMultiplier}
          format="compact"
          icon={<Users size={20} className="text-emerald-400" />}
          colorClass="metric-card-emerald"
          delay={3}
        />
        <MetricCard
          title="Frequência"
          value={m.frequency}
          format="number"
          icon={<Activity size={20} className="text-amber-400" />}
          colorClass="metric-card-amber"
          delay={4}
        />
        <MetricCard
          title="Cliques"
          value={m.clicks}
          previousValue={m.clicks * prevMultiplier}
          format="compact"
          icon={<MousePointerClick size={20} className="text-cyan-400" />}
          colorClass="metric-card-cyan"
          delay={5}
        />
        <MetricCard
          title="CTR"
          value={m.ctr}
          previousValue={m.ctr * prevMultiplier}
          format="percent"
          icon={<Percent size={20} className="text-pink-400" />}
          colorClass="metric-card-pink"
          delay={6}
        />
        <MetricCard
          title="CPC"
          value={m.cpc}
          previousValue={m.cpc * (2 - prevMultiplier)}
          format="currency"
          icon={<CreditCard size={20} className="text-blue-400" />}
          colorClass="metric-card-blue"
          delay={7}
        />
        <MetricCard
          title="CPM"
          value={m.cpm}
          previousValue={m.cpm * (2 - prevMultiplier)}
          format="currency"
          icon={<BarChart3 size={20} className="text-purple-400" />}
          colorClass="metric-card-purple"
          delay={8}
        />
        <MetricCard
          title="Leads"
          value={m.leads}
          previousValue={m.leads * prevMultiplier}
          format="number"
          icon={<UserCheck size={20} className="text-emerald-400" />}
          colorClass="metric-card-emerald"
          delay={9}
        />
        <MetricCard
          title="Conversões"
          value={m.conversions}
          previousValue={m.conversions * prevMultiplier}
          format="number"
          icon={<Target size={20} className="text-amber-400" />}
          colorClass="metric-card-amber"
          delay={10}
        />
        <MetricCard
          title="Custo/Lead"
          value={m.costPerLead}
          previousValue={m.costPerLead * (2 - prevMultiplier)}
          format="currency"
          icon={<Zap size={20} className="text-cyan-400" />}
          colorClass="metric-card-cyan"
          delay={11}
        />
        <MetricCard
          title="ROAS"
          value={m.roas}
          previousValue={m.roas * prevMultiplier}
          format="number"
          icon={<TrendingUp size={20} className="text-pink-400" />}
          colorClass="metric-card-pink"
          delay={12}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Spend + Leads Chart */}
        <div className="chart-container animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Investimento vs Leads</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
              />
              <Area type="monotone" dataKey="spend" stroke="#3b82f6" fill="url(#colorSpend)" strokeWidth={2} name="Gasto (R$)" />
              <Area type="monotone" dataKey="leads" stroke="#10b981" fill="url(#colorLeads)" strokeWidth={2} name="Leads" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* CTR + CPC Chart */}
        <div className="chart-container animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-sm font-semibold text-white mb-4">CTR e CPC ao Longo do Tempo</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
              />
              <Line type="monotone" dataKey="ctr" stroke="#a78bfa" strokeWidth={2} dot={false} name="CTR (%)" />
              <Line type="monotone" dataKey="cpc" stroke="#f472b6" strokeWidth={2} dot={false} name="CPC (R$)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily impressions bar chart */}
        <div className="chart-container animate-fade-in opacity-0" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Impressões Diárias</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
              />
              <Bar dataKey="impressions" fill="#6366f1" radius={[4, 4, 0, 0]} name="Impressões" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost per Lead trend */}
        <div className="chart-container animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-sm font-semibold text-white mb-4">Evolução do Custo por Lead</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCPL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
              <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
              />
              <Area type="monotone" dataKey="costPerLead" stroke="#f59e0b" fill="url(#colorCPL)" strokeWidth={2} name="CPL (R$)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
