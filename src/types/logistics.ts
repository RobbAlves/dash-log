
export interface Delivery {
  id: string;
  trackingCode: string;
  customerName: string;
  destination: string;
  district: string;
  city: string;
  status: 'entregue' | 'em-transito' | 'pendente' | 'atrasada';
  driverName: string;
  vehicleId: string;
  scheduledTime: string;
  deliveredTime?: string;
  cost: number;
  coordinates: [number, number];
  latitude: number;
  longitude: number;
  estimatedDelivery: string;
}

export interface Route {
  id: string;
  name: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  status: 'ativa' | 'concluida' | 'pausada';
  progress: number;
  totalStops: number;
  completedStops: number;
  estimatedCompletion: string;
  coordinates: [number, number][];
  currentLocation: [number, number];
}

export interface Driver {
  id: string;
  name: string;
  deliveriesToday: number;
  onTimeRate: number;
  avgDeliveryTime: number;
  rating: number;
  status: 'ativo' | 'inativo' | 'em-rota';
}

export interface KPIData {
  totalDeliveriesToday: number;
  totalDeliveriesMonth: number;
  onTimeRate: number;
  avgDeliveryTime: number;
  avgCost: number;
  pendingDeliveries: number;
  vehiclesOnRoute: number;
}

export interface ChartData {
  deliveriesByDay: Array<{ date: string; deliveries: number }>;
  deliveriesByRegion: Array<{ region: string; deliveries: number }>;
  deliveriesByStatus: Array<{ status: string; count: number; color: string }>;
  costOverTime: Array<{ date: string; cost: number }>;
  heatmapData: Array<{ district: string; deliveries: number; intensity: number }>;
}

export interface Filters {
  period: '7d' | '30d' | '90d' | 'all';
  region: string;
  status: string;
  driver: string;
  darkMode: boolean;
}
