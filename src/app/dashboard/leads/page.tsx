'use client';

import { Users, TrendingUp, BarChart3, Target } from 'lucide-react';
import GlobalFilters from '@/components/GlobalFilters';

export default function LeadsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Leads / Conversões</h1>
        <p className="text-sm text-slate-400">
          Acompanhe leads e conversões em detalhe
        </p>
      </div>

      <GlobalFilters />

      {/* Placeholder cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Users, label: 'Total de Leads', value: '1.070', color: 'text-emerald-400' },
          { icon: TrendingUp, label: 'Leads Hoje', value: '34', color: 'text-blue-400' },
          { icon: BarChart3, label: 'CPL Médio', value: 'R$ 12,45', color: 'text-amber-400' },
          { icon: Target, label: 'Taxa de Conversão', value: '4.2%', color: 'text-purple-400' },
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <item.icon size={20} className={item.color} />
              <span className="text-xs text-slate-400 font-medium">{item.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-card p-12 text-center">
        <Users size={48} className="mx-auto text-slate-600 mb-4" />
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Em Desenvolvimento</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Esta seção está sendo preparada com detalhamento de leads por campanha, conjunto, anúncio, evolução diária e comparação entre períodos.
        </p>
      </div>
    </div>
  );
}
