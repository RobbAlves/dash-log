
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import DeliveryManager from '@/components/admin/DeliveryManager';
import RouteManager from '@/components/admin/RouteManager';
import DriverManager from '@/components/admin/DriverManager';
import { generateMockDeliveries, generateMockDrivers, generateMockRoutes } from '@/utils/mockData';
import { Delivery, Driver, Route } from '@/types/logistics';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('deliveries');
  const [deliveries, setDeliveries] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [deliveriesResult, routesResult, driversResult] = await Promise.all([
        supabase.from('deliveries').select('*').order('created_at', { ascending: false }),
        supabase.from('routes').select('*').order('created_at', { ascending: false }),
        supabase.from('drivers').select('*').order('created_at', { ascending: false })
      ]);

      // Use same logic as main dashboard - fallback to mock data if Supabase is empty
      let finalDeliveries = [];
      let finalDrivers = [];
      let finalRoutes = [];

      if (deliveriesResult.error || !deliveriesResult.data || deliveriesResult.data.length === 0) {
        console.log('Using mock data for deliveries in admin');
        const mockDeliveries = generateMockDeliveries(250);
        finalDeliveries = mockDeliveries.map(delivery => ({
          id: delivery.id,
          tracking_code: delivery.trackingCode,
          customer_name: delivery.customerName,
          destination: delivery.destination,
          district: delivery.district,
          city: delivery.city,
          status: delivery.status,
          driver_name: delivery.driverName,
          vehicle_id: delivery.vehicleId,
          scheduled_time: delivery.scheduledTime,
          delivered_time: delivery.deliveredTime,
          cost: delivery.cost,
          latitude: delivery.latitude,
          longitude: delivery.longitude,
          estimated_delivery: delivery.estimatedDelivery,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
      } else {
        finalDeliveries = deliveriesResult.data;
      }

      if (driversResult.error || !driversResult.data || driversResult.data.length === 0) {
        console.log('Using mock data for drivers in admin');
        const mockDrivers = generateMockDrivers();
        finalDrivers = mockDrivers.map(driver => ({
          id: driver.id,
          name: driver.name,
          deliveries_today: driver.deliveriesToday,
          on_time_rate: driver.onTimeRate,
          avg_delivery_time: driver.avgDeliveryTime,
          rating: driver.rating,
          status: driver.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
      } else {
        finalDrivers = driversResult.data;
      }

      if (routesResult.error || !routesResult.data || routesResult.data.length === 0) {
        console.log('Using mock data for routes in admin');
        const mockRoutes = generateMockRoutes();
        finalRoutes = mockRoutes.map(route => ({
          id: route.id,
          name: route.name,
          driver_id: route.driverId,
          driver_name: route.driverName,
          vehicle_id: route.vehicleId,
          status: route.status,
          progress: route.progress,
          total_stops: route.totalStops,
          completed_stops: route.completedStops,
          estimated_completion: route.estimatedCompletion,
          coordinates: route.coordinates,
          current_latitude: route.currentLocation[0],
          current_longitude: route.currentLocation[1],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
      } else {
        finalRoutes = routesResult.data;
      }

      setDeliveries(finalDeliveries);
      setRoutes(finalRoutes);
      setDrivers(finalDrivers);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do sistema');
      
      // Fallback to mock data on error
      const mockDeliveries = generateMockDeliveries(250);
      const mockDrivers = generateMockDrivers();
      const mockRoutes = generateMockRoutes();
      
      setDeliveries(mockDeliveries.map(delivery => ({
        id: delivery.id,
        tracking_code: delivery.trackingCode,
        customer_name: delivery.customerName,
        destination: delivery.destination,
        district: delivery.district,
        city: delivery.city,
        status: delivery.status,
        driver_name: delivery.driverName,
        vehicle_id: delivery.vehicleId,
        scheduled_time: delivery.scheduledTime,
        delivered_time: delivery.deliveredTime,
        cost: delivery.cost,
        latitude: delivery.latitude,
        longitude: delivery.longitude,
        estimated_delivery: delivery.estimatedDelivery,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })));
      
      setDrivers(mockDrivers.map(driver => ({
        id: driver.id,
        name: driver.name,
        deliveries_today: driver.deliveriesToday,
        on_time_rate: driver.onTimeRate,
        avg_delivery_time: driver.avgDeliveryTime,
        rating: driver.rating,
        status: driver.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })));
      
      setRoutes(mockRoutes.map(route => ({
        id: route.id,
        name: route.name,
        driver_id: route.driverId,
        driver_name: route.driverName,
        vehicle_id: route.vehicleId,
        status: route.status,
        progress: route.progress,
        total_stops: route.totalStops,
        completed_stops: route.completedStops,
        estimated_completion: route.estimatedCompletion,
        coordinates: route.coordinates,
        current_latitude: route.currentLocation[0],
        current_longitude: route.currentLocation[1],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })));
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = () => {
    loadData();
    toast.success('Dados atualizados com sucesso!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Entregas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveries.length}</div>
              <p className="text-xs text-muted-foreground">
                {deliveries.filter(d => d.status === 'entregue').length} entregues hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rotas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {routes.filter(route => route.status === 'ativa').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {routes.length} rotas totais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Motoristas Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {drivers.filter(driver => driver.status === 'ativo' || driver.status === 'em-rota').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {drivers.length} motoristas totais
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deliveries">Entregas</TabsTrigger>
            <TabsTrigger value="routes">Rotas</TabsTrigger>
            <TabsTrigger value="drivers">Motoristas</TabsTrigger>
          </TabsList>

          <TabsContent value="deliveries">
            <DeliveryManager 
              deliveries={deliveries}
              drivers={drivers}
              onUpdate={handleDataUpdate}
            />
          </TabsContent>

          <TabsContent value="routes">
            <RouteManager 
              routes={routes}
              drivers={drivers}
              onUpdate={handleDataUpdate}
            />
          </TabsContent>

          <TabsContent value="drivers">
            <DriverManager 
              drivers={drivers}
              onUpdate={handleDataUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
