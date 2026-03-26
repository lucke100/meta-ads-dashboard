'use client';

import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent, formatCompact } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  format: 'currency' | 'number' | 'percent' | 'compact';
  icon: ReactNode;
  colorClass?: string;
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  previousValue,
  format: fmt,
  icon,
  colorClass = 'metric-card-blue',
  delay = 0,
}: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (fmt) {
      case 'currency':
        return formatCurrency(val);
      case 'percent':
        return formatPercent(val);
      case 'compact':
        return formatCompact(val);
      case 'number':
      default:
        return formatNumber(val);
    }
  };

  const change = previousValue !== undefined && previousValue > 0
    ? ((value - previousValue) / previousValue) * 100
    : undefined;

  const isPositive = change !== undefined ? change >= 0 : undefined;

  return (
    <div
      className={`glass-card p-5 animate-fade-in opacity-0 ${colorClass}`}
      style={{ animationDelay: `${delay * 0.05}s` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          {icon}
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              isPositive
                ? 'text-emerald-400 bg-emerald-400/10'
                : 'text-red-400 bg-red-400/10'
            }`}
          >
            {isPositive ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {formatValue(value)}
      </div>
      <div className="text-xs text-slate-400 font-medium">{title}</div>
      {previousValue !== undefined && (
        <div className="text-xs text-slate-500 mt-1">
          Anterior: {formatValue(previousValue)}
        </div>
      )}
    </div>
  );
}
