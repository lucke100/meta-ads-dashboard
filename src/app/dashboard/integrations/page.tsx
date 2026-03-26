'use client';

import { Plug, Check, AlertCircle } from 'lucide-react';

export default function IntegrationsPage() {
  const integrations = [
    {
      name: 'Meta Ads API',
      description: 'Conexão com Facebook/Instagram Ads',
      status: 'connected',
      icon: '📘',
      details: 'Variáveis de ambiente configuradas via .env.local',
    },
    {
      name: 'Google Analytics',
      description: 'Integração com dados do GA4',
      status: 'available',
      icon: '📊',
      details: 'Disponível para integração futura',
    },
    {
      name: 'Google Sheets',
      description: 'Exportar dados para planilhas',
      status: 'available',
      icon: '📗',
      details: 'Disponível para integração futura',
    },
    {
      name: 'Slack',
      description: 'Notificações em tempo real',
      status: 'available',
      icon: '💬',
      details: 'Disponível para integração futura',
    },
    {
      name: 'Webhook',
      description: 'Enviar dados para sistemas externos',
      status: 'available',
      icon: '🔗',
      details: 'Disponível para integração futura',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Integrações</h1>
        <p className="text-sm text-slate-400">
          Conecte suas ferramentas ao dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration, idx) => (
          <div key={idx} className="glass-card p-5 flex items-start gap-4">
            <span className="text-3xl">{integration.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white">{integration.name}</h3>
                {integration.status === 'connected' ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                    <Check size={10} /> Conectado
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-400/10 text-slate-400 border border-slate-400/20">
                    Disponível
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-2">{integration.description}</p>
              <p className="text-xs text-slate-500">{integration.details}</p>
            </div>
            <button
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                integration.status === 'connected'
                  ? 'bg-white/5 text-slate-400 border border-white/10'
                  : 'bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25'
              }`}
            >
              {integration.status === 'connected' ? 'Configurar' : 'Conectar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
