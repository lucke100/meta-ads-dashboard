'use client';

import { BellRing, AlertTriangle, TrendingUp, TrendingDown, Zap } from 'lucide-react';

export default function AlertsPage() {
  const alerts = [
    { type: 'warning', icon: AlertTriangle, title: 'CPL Alto', message: 'Campanha "Remarketing - Carrinho Abandonado" com CPL acima de R$ 24,00', time: '2h atrás', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    { type: 'danger', icon: TrendingDown, title: 'Queda de Conversões', message: 'Conversões caíram 15% nos últimos 3 dias no conjunto "Público Amplo"', time: '4h atrás', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
    { type: 'success', icon: TrendingUp, title: 'Bom Desempenho', message: '"Criativo 1 - Vídeo Depoimento" com CPL de R$ 7,74 - considere escalar', time: '6h atrás', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    { type: 'warning', icon: Zap, title: 'Frequência Alta', message: 'Conjunto "Remarketing - Carrinho 7d" com frequência 3.0 - risco de saturação', time: '8h atrás', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    { type: 'info', icon: BellRing, title: 'CTR Baixo', message: '"Brand Awareness - Institucional" com CTR de 1.0% - abaixo da meta', time: '12h atrás', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Alertas e Insights</h1>
        <p className="text-sm text-slate-400">
          Notificações inteligentes sobre suas campanhas
        </p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`glass-card p-4 border ${alert.color.split(' ')[2]} flex items-start gap-4`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${alert.color.split(' ')[1]}`}>
              <alert.icon size={18} className={alert.color.split(' ')[0]} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-white">{alert.title}</h3>
                <span className="text-xs text-slate-500">{alert.time}</span>
              </div>
              <p className="text-xs text-slate-400">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 text-center mt-6">
        <BellRing size={32} className="mx-auto text-slate-600 mb-3" />
        <h3 className="text-sm font-semibold text-slate-300 mb-1">Alertas Automáticos</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Em breve: alertas em tempo real baseados em metas de CPL, CTR, frequência e conversões.
        </p>
      </div>
    </div>
  );
}
