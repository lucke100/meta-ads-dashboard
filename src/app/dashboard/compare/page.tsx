'use client';

import { GitCompareArrows } from 'lucide-react';
import GlobalFilters from '@/components/GlobalFilters';

export default function ComparePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Comparação de Períodos</h1>
        <p className="text-sm text-slate-400">
          Compare métricas entre diferentes períodos
        </p>
      </div>

      <GlobalFilters />

      {/* Period options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Hoje vs Ontem', active: true },
          { label: '7D vs 7D anterior', active: false },
          { label: 'Mês vs Mês anterior', active: false },
          { label: 'Personalizado', active: false },
        ].map((p, idx) => (
          <button
            key={idx}
            className={`glass-card p-4 text-center text-sm font-medium transition-all ${
              p.active ? 'border-blue-500/30 text-blue-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="glass-card p-12 text-center">
        <GitCompareArrows size={48} className="mx-auto text-slate-600 mb-4" />
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Em Desenvolvimento</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Comparação detalhada de gasto, leads, CPL, CTR, CPC, CPM, impressões, alcance, frequência e conversões com variação percentual.
        </p>
      </div>
    </div>
  );
}
