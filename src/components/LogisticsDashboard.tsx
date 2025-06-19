
import React, { useState } from 'react';
import { Delivery, Route, Driver, KPIData, ChartData, Filters } from '@/types/logistics';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Sun, Moon, Filter, Map } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import InteractiveMap from '@/components/InteractiveMap';
import FilterPanel from '@/components/FilterPanel';
import { generateMockDeliveries, generateMockDrivers, generateMockRoutes, generateKPIData, generateChartData } from '@/utils/mockData';
import KPICards from '@/components/KPICards';
import DashboardCharts from '@/components/DashboardCharts';

const LogisticsDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [kpiData, setKPIData] = useState<KPIData>({
    totalDeliveriesToday: 0,
    totalDeliveriesMonth: 0,
    onTimeRate: 0,
    avgDeliveryTime: 0,
    avgCost: 0,
    pendingDeliveries: 0,
    vehiclesOnRoute: 0,
  });
  const [chartData, setChartData] = useState<ChartData>({
    deliveriesByDay: [],
    deliveriesByRegion: [],
    deliveriesByStatus: [],
    costOverTime: [],
    heatmapData: [],
  });
  const [filters, setFilters] = useState<Filters>({
    period: '7d',
    region: 'all',
    status: 'all',
    driver: 'all',
    darkMode: theme === 'dark',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch from Supabase first
        const { data: deliveriesData, error: deliveriesError } = await supabase
          .from('deliveries')
          .select('*');
        
        let mappedDeliveries: Delivery[] = [];
        
        if (deliveriesError || !deliveriesData || deliveriesData.length === 0) {
          // Use mock data if Supabase is empty or has errors
          console.log('Using mock data for deliveries');
          mappedDeliveries = generateMockDeliveries(250); // Increased to 250 deliveries
        } else {
          // Map Supabase data to match our TypeScript interface
          mappedDeliveries = deliveriesData.map(item => ({
            id: item.id,
            trackingCode: item.tracking_code,
            customerName: item.customer_name,
            destination: item.destination,
            district: item.district,
            city: item.city,
            status: item.status as 'entregue' | 'em-transito' | 'pendente' | 'atrasada',
            driverName: item.driver_name,
            vehicleId: item.vehicle_id,
            scheduledTime: item.scheduled_time,
            deliveredTime: item.delivered_time,
            cost: item.cost,
            coordinates: [item.latitude, item.longitude] as [number, number],
            latitude: item.latitude,
            longitude: item.longitude,
            estimatedDelivery: item.estimated_delivery,
          }));
        }
        
        setDeliveries(mappedDeliveries);
        setFilteredDeliveries(mappedDeliveries);

        // Try to fetch drivers
        const { data: driversData, error: driversError } = await supabase
          .from('drivers')
          .select('*');
        
        let mappedDrivers: Driver[] = [];
        
        if (driversError || !driversData || driversData.length === 0) {
          console.log('Using mock data for drivers');
          mappedDrivers = generateMockDrivers();
        } else {
          mappedDrivers = driversData.map(item => ({
            id: item.id,
            name: item.name,
            deliveriesToday: item.deliveries_today,
            onTimeRate: item.on_time_rate,
            avgDeliveryTime: item.avg_delivery_time,
            rating: item.rating,
            status: item.status as 'ativo' | 'inativo' | 'em-rota',
          }));
        }
        
        setDrivers(mappedDrivers);

        // Try to fetch routes
        const { data: routesData, error: routesError } = await supabase
          .from('routes')
          .select('*');
        
        let mappedRoutes: Route[] = [];
        
        if (routesError || !routesData || routesData.length === 0) {
          console.log('Using mock data for routes');
          mappedRoutes = generateMockRoutes();
        } else {
          mappedRoutes = routesData.map(item => ({
            id: item.id,
            name: item.name,
            driverId: item.driver_id,
            driverName: item.driver_name,
            vehicleId: item.vehicle_id,
            status: item.status as 'ativa' | 'concluida' | 'pausada',
            progress: item.progress,
            totalStops: item.total_stops,
            completedStops: item.completed_stops,
            estimatedCompletion: item.estimated_completion,
            coordinates: item.coordinates as [number, number][],
            currentLocation: [item.current_latitude, item.current_longitude] as [number, number],
          }));
        }
        
        setRoutes(mappedRoutes);

        // Generate KPI and Chart data based on actual deliveries
        const kpiData = generateKPIData(mappedDeliveries);
        setKPIData(kpiData);

        const chartData = generateChartData(mappedDeliveries);
        setChartData(chartData);

      } catch (error: any) {
        console.error('Failed to fetch data from Supabase:', error.message);
        // Fallback to mock data
        const mockDeliveries = generateMockDeliveries(250);
        const mockDrivers = generateMockDrivers();
        const mockRoutes = generateMockRoutes();
        
        setDeliveries(mockDeliveries);
        setFilteredDeliveries(mockDeliveries);
        setDrivers(mockDrivers);
        setRoutes(mockRoutes);
        setKPIData(generateKPIData(mockDeliveries));
        setChartData(generateChartData(mockDeliveries));
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: Filters) => {
    let filtered = [...deliveries];

    // Filter by status
    if (currentFilters.status !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === currentFilters.status);
    }

    // Filter by region/city
    if (currentFilters.region !== 'all') {
      filtered = filtered.filter(delivery => delivery.city === currentFilters.region);
    }

    // Filter by driver
    if (currentFilters.driver !== 'all') {
      filtered = filtered.filter(delivery => delivery.driverName === currentFilters.driver);
    }

    // Filter by period
    if (currentFilters.period !== 'all') {
      const now = new Date();
      let periodDays = 7; // default
      
      if (currentFilters.period === '30d') {
        periodDays = 30;
      } else if (currentFilters.period === '90d') {
        periodDays = 90;
      }
      
      const cutoffDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(delivery => {
        const deliveryDate = new Date(delivery.scheduledTime);
        return deliveryDate >= cutoffDate;
      });
    }

    setFilteredDeliveries(filtered);
    console.log(`Applied filters: ${JSON.stringify(currentFilters)}, Results: ${filtered.length} deliveries`);
  };

  // Apply filters when deliveries data changes
  useEffect(() => {
    if (deliveries.length > 0) {
      applyFilters(filters);
    }
  }, [deliveries]);

  const mapMarkers = filteredDeliveries.map(delivery => ({
    id: delivery.id,
    position: delivery.coordinates,
    title: delivery.customerName,
    status: delivery.status,
  }));

  const mapRoutes = routes.map(route => ({
    id: route.id,
    coordinates: route.coordinates,
    color: route.status === 'ativa' ? '#3b82f6' : route.status === 'concluida' ? '#10b981' : '#f59e0b',
  }));

  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Logístico</h1>
            <p className="text-gray-600 dark:text-gray-300">Monitoramento em tempo real das operações</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowMap(!showMap)}
              variant="outline"
              className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              <Map className="h-4 w-4" />
              {showMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}
            </Button>
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
              Administração
            </Button>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </div>

        <FilterPanel 
          filters={filters}
          onFilterChange={handleFilterChange}
          drivers={drivers}
          cities={Array.from(new Set(deliveries.map(d => d.city))).sort()}
        />

        {showMap && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🗺️ Mapa Interativo das Entregas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InteractiveMap markers={mapMarkers} routes={mapRoutes} />
              </CardContent>
            </Card>
          </div>
        )}

        <KPICards kpiData={kpiData} filteredDeliveries={filteredDeliveries} />

        <DashboardCharts chartData={chartData} />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                📋 Lista de Entregas
                <Badge variant="outline" className="ml-2">
                  {filteredDeliveries.length} resultados
                </Badge>
              </span>
              <div className="flex gap-2">
                <Badge variant="secondary">{filteredDeliveries.filter(d => d.status === 'entregue').length} entregues</Badge>
                <Badge variant="outline">{filteredDeliveries.filter(d => d.status === 'em-transito').length} em trânsito</Badge>
                <Badge variant="destructive">{filteredDeliveries.filter(d => d.status === 'atrasada').length} atrasadas</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Motorista</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Agendamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliveries.slice(0, 50).map((delivery) => (
                    <TableRow key={delivery.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium">{delivery.trackingCode}</TableCell>
                      <TableCell>{delivery.customerName}</TableCell>
                      <TableCell className="max-w-48 truncate">{delivery.destination}</TableCell>
                      <TableCell>
                        <Badge variant={
                          delivery.status === 'entregue' ? 'default' :
                          delivery.status === 'em-transito' ? 'secondary' :
                          delivery.status === 'pendente' ? 'outline' : 'destructive'
                        }>
                          {delivery.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{delivery.driverName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {delivery.vehicleId}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">R$ {delivery.cost}</TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(delivery.scheduledTime).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredDeliveries.length > 50 && (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Mostrando 50 de {filteredDeliveries.length} entregas. Use os filtros para refinar os resultados.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
