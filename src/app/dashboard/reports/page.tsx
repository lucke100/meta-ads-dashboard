'use client';

import { useState, useEffect } from 'react';
import { FileBarChart, Download, Loader2, Calendar, CheckCircle } from 'lucide-react';
import GlobalFilters, { useFilters } from '@/components/GlobalFilters';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import type { CampaignData } from '@/lib/mock-data';
import type { DailyInsight, MetricData } from '@/lib/mock-data';

export default function ReportsPage() {
  const { filters } = useFilters();
  const [generating, setGenerating] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [insights, setInsights] = useState<{ daily: DailyInsight[]; aggregated: MetricData } | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [campRes, insRes] = await Promise.all([
          fetch(`/api/meta/campaigns?date_from=${filters.dateFrom}&date_to=${filters.dateTo}`),
          fetch(`/api/meta/insights?date_from=${filters.dateFrom}&date_to=${filters.dateTo}`),
        ]);
        const campData = await campRes.json();
        const insData = await insRes.json();
        if (campData.success) setCampaigns(campData.data);
        if (insData.success) setInsights(insData.data);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters.dateFrom, filters.dateTo]);

  const generatePDF = async (type: 'overview' | 'campaigns' | 'complete') => {
    setGenerating(true);
    setSuccess(false);

    try {
      // Import dinâmico para evitar problemas com SSR
      const { default: jsPDF } = await import('jspdf');
      const autoTableModule = await import('jspdf-autotable');
      const autoTable = autoTableModule.default;

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;

      // ======= HEADER =======
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Empreende Aí', margin, 18);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Dashboard Meta Ads Pro - Relatório', margin, 26);

      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Período: ${filters.dateFrom} a ${filters.dateTo}`, margin, 34);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth - margin, 34, { align: 'right' });

      let yPos = 50;

      // ======= MÉTRICAS GERAIS =======
      if ((type === 'overview' || type === 'complete') && insights) {
        const m = insights.aggregated;

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Visão Geral', margin, yPos);
        yPos += 8;

        // Grid de métricas
        const metrics = [
          ['Valor Gasto', formatCurrency(m.spend)],
          ['Impressões', formatNumber(m.impressions)],
          ['Alcance', formatNumber(m.reach)],
          ['Cliques', formatNumber(m.clicks)],
          ['CTR', formatPercent(m.ctr)],
          ['CPC', formatCurrency(m.cpc)],
          ['CPM', formatCurrency(m.cpm)],
          ['Leads', formatNumber(m.leads)],
          ['Custo/Lead', formatCurrency(m.costPerLead)],
          ['Conversões', formatNumber(m.conversions)],
          ['Frequência', m.frequency.toFixed(2)],
          ['ROAS', m.roas.toFixed(2) + 'x'],
        ];

        const colWidth = (pageWidth - 2 * margin) / 4;
        const rowHeight = 18;

        metrics.forEach(([label, value], idx) => {
          const col = idx % 4;
          const row = Math.floor(idx / 4);
          const x = margin + col * colWidth;
          const y = yPos + row * rowHeight;

          // Card background
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(x, y, colWidth - 3, rowHeight - 3, 2, 2, 'F');

          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 116, 139);
          doc.text(label, x + 4, y + 6);

          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text(value, x + 4, y + 13);
        });

        yPos += Math.ceil(metrics.length / 4) * rowHeight + 8;
      }

      // ======= TABELA DE CAMPANHAS =======
      if ((type === 'campaigns' || type === 'complete') && campaigns.length > 0) {
        if (type === 'complete' && yPos > 200) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Campanhas', margin, yPos);
        yPos += 6;

        const tableData = campaigns.map((c) => [
          c.name.length > 30 ? c.name.slice(0, 30) + '...' : c.name,
          c.status === 'ACTIVE' ? 'Ativo' : c.status === 'PAUSED' ? 'Pausado' : 'Arquivado',
          formatCurrency(c.spend),
          formatNumber(c.impressions),
          formatNumber(c.clicks),
          formatPercent(c.ctr),
          formatCurrency(c.cpc),
          formatNumber(c.leads),
          c.costPerLead > 0 ? formatCurrency(c.costPerLead) : '-',
        ]);

        autoTable(doc, {
          startY: yPos,
          margin: { left: margin, right: margin },
          head: [['Campanha', 'Status', 'Gasto', 'Impr.', 'Cliques', 'CTR', 'CPC', 'Leads', 'CPL']],
          body: tableData,
          headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontSize: 7,
            fontStyle: 'bold',
          },
          bodyStyles: {
            fontSize: 7,
            textColor: [30, 41, 59],
          },
          alternateRowStyles: {
            fillColor: [241, 245, 249],
          },
          styles: {
            cellPadding: 2,
            overflow: 'linebreak',
          },
          columnStyles: {
            0: { cellWidth: 45 },
          },
        });

        yPos = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || yPos + 50;
      }

      // ======= DADOS DIÁRIOS =======
      if (type === 'complete' && insights && insights.daily.length > 0) {
        doc.addPage();
        yPos = 20;

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Dados Diários', margin, yPos);
        yPos += 6;

        const dailyData = insights.daily.map((d) => [
          d.date,
          formatCurrency(d.spend),
          formatNumber(d.impressions),
          formatNumber(d.reach),
          formatNumber(d.clicks),
          formatPercent(d.ctr),
          formatNumber(d.leads),
          d.costPerLead > 0 ? formatCurrency(d.costPerLead) : '-',
        ]);

        autoTable(doc, {
          startY: yPos,
          margin: { left: margin, right: margin },
          head: [['Data', 'Gasto', 'Impr.', 'Alcance', 'Cliques', 'CTR', 'Leads', 'CPL']],
          body: dailyData,
          headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontSize: 7,
            fontStyle: 'bold',
          },
          bodyStyles: {
            fontSize: 7,
            textColor: [30, 41, 59],
          },
          alternateRowStyles: {
            fillColor: [241, 245, 249],
          },
          styles: {
            cellPadding: 2,
          },
        });
      }

      // ======= FOOTER =======
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(
          'Built with technology and strategically designed by People Digital Culture',
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: 'center' }
        );
        doc.text(
          `Página ${i} de ${totalPages}`,
          pageWidth - margin,
          doc.internal.pageSize.getHeight() - 8,
          { align: 'right' }
        );
      }

      // Salvar
      const titles: Record<string, string> = {
        overview: 'Visao_Geral',
        campaigns: 'Campanhas',
        complete: 'Relatorio_Completo',
      };
      doc.save(`Empreende_Ai_${titles[type]}_${filters.dateFrom}_${filters.dateTo}.pdf`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Relatórios</h1>
        <p className="text-sm text-slate-400">
          Gere relatórios em PDF com os dados das suas campanhas
        </p>
      </div>

      <GlobalFilters />

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6 animate-fade-in">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="text-sm text-emerald-300">Relatório gerado e baixado com sucesso!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Visão Geral */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
              <FileBarChart size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Visão Geral</h3>
              <p className="text-xs text-slate-500">Métricas agregadas do período</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-4 flex-1">
            Relatório com todas as métricas agregadas: gasto, impressões, alcance, cliques, CTR, CPC, CPM, leads, custo por lead, conversões e ROAS.
          </p>
          <button
            onClick={() => generatePDF('overview')}
            disabled={generating || loading}
            className="w-full py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Gerar PDF
          </button>
        </div>

        {/* Campanhas */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
              <FileBarChart size={20} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Campanhas</h3>
              <p className="text-xs text-slate-500">Detalhamento por campanha</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-4 flex-1">
            Tabela com todas as campanhas e seus indicadores: status, gasto, impressões, cliques, CTR, CPC, leads e custo por lead.
          </p>
          <button
            onClick={() => generatePDF('campaigns')}
            disabled={generating || loading}
            className="w-full py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Gerar PDF
          </button>
        </div>

        {/* Relatório Completo */}
        <div className="glass-card p-6 flex flex-col border border-blue-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
              <FileBarChart size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Relatório Completo</h3>
              <p className="text-xs text-slate-500">Todos os dados em um único PDF</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-4 flex-1">
            Relatório completo incluindo: visão geral, tabela de campanhas e dados diários detalhados com todas as métricas.
          </p>
          <button
            onClick={() => generatePDF('complete')}
            disabled={generating || loading}
            className="w-full py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Gerar PDF Completo
          </button>
        </div>
      </div>

      {/* Preview dos dados */}
      {!loading && insights && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-white mb-4">Prévia dos Dados</h3>
          <div className="glass-card p-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-400 font-medium py-2 px-2">Métrica</th>
                  <th className="text-right text-slate-400 font-medium py-2 px-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Valor Gasto', formatCurrency(insights.aggregated.spend)],
                  ['Impressões', formatNumber(insights.aggregated.impressions)],
                  ['Alcance', formatNumber(insights.aggregated.reach)],
                  ['Cliques', formatNumber(insights.aggregated.clicks)],
                  ['CTR', formatPercent(insights.aggregated.ctr)],
                  ['CPC', formatCurrency(insights.aggregated.cpc)],
                  ['CPM', formatCurrency(insights.aggregated.cpm)],
                  ['Leads', formatNumber(insights.aggregated.leads)],
                  ['Custo/Lead', formatCurrency(insights.aggregated.costPerLead)],
                  ['Campanhas ativas', `${campaigns.filter(c => c.status === 'ACTIVE').length} de ${campaigns.length}`],
                  ['Dias no período', `${insights.daily.length}`],
                ].map(([label, value], idx) => (
                  <tr key={idx} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                    <td className="py-2 px-2 text-slate-300">{label}</td>
                    <td className="py-2 px-2 text-right text-white font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
