// =============================================
// Utilitários de formatação para o dashboard
// =============================================

/**
 * Formata valor monetário em BRL
 */
export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata número com separadores de milhar
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata porcentagem
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Formata variação percentual com sinal
 */
export function formatChange(current: number, previous: number): { value: string; isPositive: boolean; percent: number } {
  if (previous === 0) {
    return { value: '+100%', isPositive: true, percent: 100 };
  }
  const percent = ((current - previous) / previous) * 100;
  const isPositive = percent >= 0;
  return {
    value: `${isPositive ? '+' : ''}${percent.toFixed(1)}%`,
    isPositive,
    percent,
  };
}

/**
 * Formata número de forma abreviada (1.2K, 1.5M)
 */
export function formatCompact(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Retorna cor baseada no status
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'text-emerald-400';
    case 'PAUSED':
      return 'text-amber-400';
    case 'ARCHIVED':
      return 'text-gray-400';
    case 'DELETED':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

/**
 * Retorna label do status em português
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'Ativo';
    case 'PAUSED':
      return 'Pausado';
    case 'ARCHIVED':
      return 'Arquivado';
    case 'DELETED':
      return 'Excluído';
    default:
      return status;
  }
}

/**
 * Retorna label do objetivo em português
 */
export function getObjectiveLabel(objective: string): string {
  const labels: Record<string, string> = {
    LEAD_GENERATION: 'Geração de Leads',
    CONVERSIONS: 'Conversões',
    BRAND_AWARENESS: 'Reconhecimento de Marca',
    LINK_CLICKS: 'Tráfego',
    REACH: 'Alcance',
    VIDEO_VIEWS: 'Visualizações de Vídeo',
    ENGAGEMENT: 'Engajamento',
    MESSAGES: 'Mensagens',
    APP_INSTALLS: 'Instalações de App',
  };
  return labels[objective] || objective;
}
