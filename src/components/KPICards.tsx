
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, Target, DollarSign, AlertTriangle, MapPin } from 'lucide-react';
import { KPIData, Delivery } from '@/types/logistics';

interface KPICardsProps {
  kpiData: KPIData;
  filteredDeliveries: Delivery[];
}

const KPICards: React.FC<KPICardsProps> = ({ kpiData, filteredDeliveries }) => {
  const completedDeliveries = filteredDeliveries.filter(d => d.status === 'entregue').length;
  const inTransitDeliveries = filteredDeliveries.filter(d => d.status === 'em-transito').length;
  const lateDeliveries = filteredDeliveries.filter(d => d.status === 'atrasada').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Entregas</CardTitle>
          <Truck className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{filteredDeliveries.length}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {completedDeliveries} entregues
            </Badge>
            <Badge variant="outline" className="text-xs">
              {inTransitDeliveries} em trânsito
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Pontualidade</CardTitle>
          <Target className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{kpiData.onTimeRate}%</div>
          <p className="text-sm text-muted-foreground mt-2">
            Meta: 95% | {completedDeliveries} entregas concluídas
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio</CardTitle>
          <Clock className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{kpiData.avgDeliveryTime} min</div>
          <p className="text-sm text-muted-foreground mt-2">
            Baseado em {filteredDeliveries.length} entregas
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Custo Médio</CardTitle>
          <DollarSign className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">R$ {kpiData.avgCost}</div>
          <p className="text-sm text-muted-foreground mt-2">
            Por entrega
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Entregas Pendentes</CardTitle>
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">{kpiData.pendingDeliveries}</div>
          <div className="flex items-center gap-2 mt-2">
            {lateDeliveries > 0 && (
              <Badge variant="destructive" className="text-xs">
                {lateDeliveries} atrasadas
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Veículos Ativos</CardTitle>
          <MapPin className="h-5 w-5 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-indigo-600">{kpiData.vehiclesOnRoute}</div>
          <p className="text-sm text-muted-foreground mt-2">
            Em operação hoje
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards;
