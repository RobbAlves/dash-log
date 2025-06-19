
import jsPDF from 'jspdf';
import { KPIData } from '@/types/logistics';

export const exportMetricsToPDF = (kpiData: KPIData) => {
  const doc = new jsPDF();
  
  // Título do relatório
  doc.setFontSize(20);
  doc.text('Relatório de Métricas - Dashboard de Logística', 20, 30);
  
  // Data do relatório
  doc.setFontSize(12);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);
  
  // Linha separadora
  doc.line(20, 50, 190, 50);
  
  // Métricas principais
  doc.setFontSize(16);
  doc.text('Métricas Principais', 20, 65);
  
  let yPosition = 80;
  
  // Entregas Hoje
  doc.setFontSize(12);
  doc.text(`Entregas Hoje: ${kpiData.totalDeliveriesToday}`, 20, yPosition);
  yPosition += 10;
  
  // Entregas no Mês
  doc.text(`Entregas no Mês: ${kpiData.totalDeliveriesMonth}`, 20, yPosition);
  yPosition += 10;
  
  // Taxa no Prazo
  doc.text(`Taxa no Prazo: ${kpiData.onTimeRate}%`, 20, yPosition);
  yPosition += 10;
  
  // Tempo Médio
  doc.text(`Tempo Médio por Entrega: ${kpiData.avgDeliveryTime} minutos`, 20, yPosition);
  yPosition += 10;
  
  // Custo Médio
  doc.text(`Custo Médio por Entrega: R$ ${kpiData.avgCost.toFixed(2)}`, 20, yPosition);
  yPosition += 10;
  
  // Entregas Pendentes
  doc.text(`Entregas Pendentes: ${kpiData.pendingDeliveries}`, 20, yPosition);
  yPosition += 10;
  
  // Veículos Ativos
  doc.text(`Veículos em Rota: ${kpiData.vehiclesOnRoute}`, 20, yPosition);
  yPosition += 20;
  
  // Linha separadora
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 15;
  
  // Análise de performance
  doc.setFontSize(16);
  doc.text('Análise de Performance', 20, yPosition);
  yPosition += 15;
  
  doc.setFontSize(12);
  
  // Status da taxa no prazo
  if (kpiData.onTimeRate >= 95) {
    doc.text('✓ Taxa no prazo está dentro da meta (95%)', 20, yPosition);
  } else {
    doc.text('⚠ Taxa no prazo abaixo da meta (95%)', 20, yPosition);
  }
  yPosition += 10;
  
  // Status das entregas pendentes
  if (kpiData.pendingDeliveries <= 10) {
    doc.text('✓ Número de entregas pendentes sob controle', 20, yPosition);
  } else {
    doc.text('⚠ Alto número de entregas pendentes', 20, yPosition);
  }
  yPosition += 10;
  
  // Eficiência da frota
  const fleetEfficiency = ((kpiData.vehiclesOnRoute / 20) * 100).toFixed(1); // Assumindo frota de 20 veículos
  doc.text(`Eficiência da Frota: ${fleetEfficiency}% (${kpiData.vehiclesOnRoute}/20 veículos ativos)`, 20, yPosition);
  yPosition += 20;
  
  // Rodapé
  doc.setFontSize(10);
  doc.text('Relatório gerado automaticamente pelo Dashboard de Logística', 20, 280);
  
  // Download do PDF
  doc.save(`metricas-logistica-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
};
