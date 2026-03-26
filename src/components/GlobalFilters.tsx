'use client';

import { useState, useRef, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  period: string;
  status: string;
  campaignId: string;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be inside FilterProvider');
  return ctx;
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    dateTo: format(new Date(), 'yyyy-MM-dd'),
    period: '30d',
    status: 'ALL',
    campaignId: '',
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

// ========================================
// Calendário usando Portal (sobrepõe tudo)
// ========================================
function CalendarPicker({
  selectedDate,
  onSelect,
  onClose,
  label,
  anchorRef,
}: {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
  label: string;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [viewDate, setViewDate] = useState(selectedDate);
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const calRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8,
        left: Math.max(8, rect.left),
      });
    }
  }, [anchorRef]);

  // Fechar ao clicar fora
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (calRef.current && !calRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose, anchorRef]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  if (!mounted) return null;

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const yearsStart = currentYear - 6;
  const years = Array.from({ length: 12 }, (_, i) => yearsStart + i);

  const calendar = (
    <div
      ref={calRef}
      className="fixed glass-card p-3 min-w-[280px] shadow-2xl border border-white/10"
      style={{ top: pos.top, left: pos.left, zIndex: 99999 }}
    >
      <div className="text-xs text-slate-400 mb-2 font-medium">{label}</div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            if (viewMode === 'days') setViewDate(subMonths(viewDate, 1));
            else if (viewMode === 'years') setViewDate(new Date(currentYear - 12, currentMonth, 1));
          }}
          className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => {
            if (viewMode === 'days') setViewMode('months');
            else if (viewMode === 'months') setViewMode('years');
            else setViewMode('days');
          }}
          className="px-3 py-1 rounded-md hover:bg-white/10 text-sm font-semibold text-white transition-colors"
        >
          {viewMode === 'days' && `${months[currentMonth]} ${currentYear}`}
          {viewMode === 'months' && `${currentYear}`}
          {viewMode === 'years' && `${yearsStart} - ${yearsStart + 11}`}
        </button>
        <button
          onClick={() => {
            if (viewMode === 'days') setViewDate(addMonths(viewDate, 1));
            else if (viewMode === 'years') setViewDate(new Date(currentYear + 12, currentMonth, 1));
          }}
          className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {viewMode === 'years' && (
        <div className="grid grid-cols-3 gap-1">
          {years.map((year) => (
            <button key={year} onClick={() => { setViewDate(new Date(year, currentMonth, 1)); setViewMode('months'); }}
              className={`py-2 rounded-lg text-xs font-medium transition-colors ${year === selectedDate.getFullYear() ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:bg-white/10'}`}
            >{year}</button>
          ))}
        </div>
      )}

      {viewMode === 'months' && (
        <div className="grid grid-cols-3 gap-1">
          {months.map((month, idx) => (
            <button key={month} onClick={() => { setViewDate(new Date(currentYear, idx, 1)); setViewMode('days'); }}
              className={`py-2 rounded-lg text-xs font-medium transition-colors ${idx === selectedDate.getMonth() && currentYear === selectedDate.getFullYear() ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:bg-white/10'}`}
            >{month}</button>
          ))}
        </div>
      )}

      {viewMode === 'days' && (
        <>
          <div className="grid grid-cols-7 gap-0 mb-1">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
              <div key={d} className="text-center text-[10px] text-slate-500 font-medium py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0">
            {days.map((d, i) => {
              const isCurrentMonth = isSameMonth(d, viewDate);
              const isSelected = isSameDay(d, selectedDate);
              const isToday = isSameDay(d, new Date());
              return (
                <button key={i} onClick={() => { onSelect(d); onClose(); }}
                  className={`py-1.5 rounded-md text-xs transition-colors ${isSelected ? 'bg-blue-500 text-white font-bold' : isToday ? 'bg-white/10 text-white font-medium' : isCurrentMonth ? 'text-slate-300 hover:bg-white/10' : 'text-slate-600 hover:bg-white/5'}`}
                >{d.getDate()}</button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  return createPortal(calendar, document.body);
}

// ========================================
// Filtros globais
// ========================================
export default function GlobalFilters() {
  const { filters, setFilters } = useFilters();
  const [showFilters, setShowFilters] = useState(false);
  const [showFromCal, setShowFromCal] = useState(false);
  const [showToCal, setShowToCal] = useState(false);
  const fromBtnRef = useRef<HTMLButtonElement>(null);
  const toBtnRef = useRef<HTMLButtonElement>(null);

  const handlePeriodChange = (period: string) => {
    const today = new Date();
    let dateFrom: Date;
    switch (period) {
      case 'today': dateFrom = today; break;
      case '7d': dateFrom = subDays(today, 7); break;
      case '14d': dateFrom = subDays(today, 14); break;
      case '30d': dateFrom = subDays(today, 30); break;
      case '60d': dateFrom = subDays(today, 60); break;
      case '90d': dateFrom = subDays(today, 90); break;
      default: dateFrom = subDays(today, 30);
    }
    setFilters({ ...filters, period, dateFrom: format(dateFrom, 'yyyy-MM-dd'), dateTo: format(today, 'yyyy-MM-dd') });
  };

  const fromDate = new Date(filters.dateFrom + 'T12:00:00');
  const toDate = new Date(filters.dateTo + 'T12:00:00');

  return (
    <div className="glass rounded-xl px-4 py-3 mb-6 relative">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Period presets */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <div className="flex gap-1">
            {[
              { key: 'today', label: 'Hoje' },
              { key: '7d', label: '7D' },
              { key: '14d', label: '14D' },
              { key: '30d', label: '30D' },
              { key: '60d', label: '60D' },
              { key: '90d', label: '90D' },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => handlePeriodChange(p.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filters.period === p.key
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date range */}
        <div className="flex items-center gap-2">
          <button
            ref={fromBtnRef}
            onClick={() => { setShowFromCal(!showFromCal); setShowToCal(false); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white hover:border-white/20 transition-colors flex items-center gap-2"
          >
            <Calendar size={12} className="text-slate-400" />
            {format(fromDate, 'dd MMM yyyy', { locale: ptBR })}
          </button>

          <span className="text-slate-500 text-xs">até</span>

          <button
            ref={toBtnRef}
            onClick={() => { setShowToCal(!showToCal); setShowFromCal(false); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white hover:border-white/20 transition-colors flex items-center gap-2"
          >
            <Calendar size={12} className="text-slate-400" />
            {format(toDate, 'dd MMM yyyy', { locale: ptBR })}
          </button>
        </div>

        {/* Toggle more filters */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-300 hover:bg-white/5 transition-all"
        >
          {showFilters ? <X size={14} /> : <Filter size={14} />}
          Filtros
        </button>
      </div>

      {showFilters && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Status:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="text-xs"
            >
              <option value="ALL">Todos</option>
              <option value="ACTIVE">Ativo</option>
              <option value="PAUSED">Pausado</option>
              <option value="ARCHIVED">Arquivado</option>
            </select>
          </div>
        </div>
      )}

      {/* Calendar portals */}
      {showFromCal && (
        <CalendarPicker
          selectedDate={fromDate}
          label="Data inicial"
          anchorRef={fromBtnRef}
          onSelect={(d) => setFilters({ ...filters, dateFrom: format(d, 'yyyy-MM-dd'), period: 'custom' })}
          onClose={() => setShowFromCal(false)}
        />
      )}
      {showToCal && (
        <CalendarPicker
          selectedDate={toDate}
          label="Data final"
          anchorRef={toBtnRef}
          onSelect={(d) => setFilters({ ...filters, dateTo: format(d, 'yyyy-MM-dd'), period: 'custom' })}
          onClose={() => setShowToCal(false)}
        />
      )}
    </div>
  );
}
