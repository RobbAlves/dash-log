
import { Delivery, Route, Driver, KPIData, ChartData } from '@/types/logistics';

const cities = [
  'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Curitiba', 
  'Salvador', 'Fortaleza', 'Recife', 'Porto Alegre', 'Manaus',
  'Goiânia', 'Belém', 'Guarulhos', 'Campinas', 'São Luís',
  'Maceió', 'Duque de Caxias', 'Natal', 'Teresina', 'Campo Grande',
  'Nova Iguaçu', 'São Bernardo do Campo', 'João Pessoa', 'Santo André',
  'Osasco', 'Jaboatão dos Guararapes', 'São José dos Campos', 'Ribeirão Preto',
  'Uberlândia', 'Sorocaba', 'Contagem', 'Aracaju', 'Feira de Santana',
  'Cuiabá', 'Joinville', 'Juiz de Fora', 'Londrina', 'Aparecida de Goiânia',
  'Niterói', 'Ananindeua', 'Porto Velho', 'Serra', 'Caxias do Sul',
  'Vila Velha', 'Florianópolis', 'Macapá', 'Campos dos Goytacazes'
];

const districts = [
  'Centro', 'Vila Madalena', 'Copacabana', 'Ipanema', 'Savassi', 'Asa Norte', 
  'Água Verde', 'Barra', 'Aldeota', 'Moinhos', 'Brooklin', 'Moema', 'Leblon',
  'Botafogo', 'Flamengo', 'Tijuca', 'Bela Vista', 'Jardins', 'Pinheiros',
  'Itaim Bibi', 'Vila Olimpia', 'Santana', 'Perdizes', 'Higienópolis',
  'Campo Belo', 'Morumbi', 'Vila Nova Conceição', 'Paraíso', 'Consolação',
  'República', 'Liberdade', 'Aclimação', 'Cambuci', 'Bela Cintra'
];

const driverNames = [
  'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira', 
  'Lucia Almeida', 'Roberto Lima', 'Fernanda Souza', 'Ricardo Martins', 'Juliana Pereira', 
  'Marcos Barbosa', 'Patricia Rocha', 'André Mendes', 'Carla Nascimento', 'Bruno Cardoso',
  'Amanda Reis', 'Rafael Torres', 'Beatriz Campos', 'Diego Moura', 'Camila Freitas',
  'Thiago Araujo', 'Isabela Ribeiro', 'Gabriel Santos', 'Larissa Gomes', 'Leonardo Silva',
  'Natalia Castro', 'Felipe Rodrigues', 'Priscila Lopes', 'Rodrigo Fernandes', 'Vanessa Lima'
];

const statusColors = {
  'entregue': '#22c55e',
  'em-transito': '#f59e0b',
  'pendente': '#6b7280',
  'atrasada': '#ef4444'
};

const vehicleTypes = ['VAN', 'MOTO', 'CAMINHÃO', 'BICICLETA'];

export const generateMockDeliveries = (count: number): Delivery[] => {
  const deliveries: Delivery[] = [];
  
  for (let i = 0; i < count; i++) {
    const status = ['entregue', 'em-transito', 'pendente', 'atrasada'][Math.floor(Math.random() * 4)] as Delivery['status'];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];
    
    // Generate coordinates for major Brazilian cities
    let latitude, longitude;
    if (city === 'São Paulo') {
      latitude = -23.5505 + (Math.random() - 0.5) * 0.2;
      longitude = -46.6333 + (Math.random() - 0.5) * 0.2;
    } else if (city === 'Rio de Janeiro') {
      latitude = -22.9068 + (Math.random() - 0.5) * 0.15;
      longitude = -43.1729 + (Math.random() - 0.5) * 0.15;
    } else if (city === 'Belo Horizonte') {
      latitude = -19.9167 + (Math.random() - 0.5) * 0.1;
      longitude = -43.9345 + (Math.random() - 0.5) * 0.1;
    } else {
      // Random coordinates for other cities within Brazil
      latitude = -15 + (Math.random() - 0.5) * 20;
      longitude = -50 + (Math.random() - 0.5) * 20;
    }
    
    // Generate dates within the last 90 days for better filtering
    const daysAgo = Math.floor(Math.random() * 90);
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() - daysAgo);
    
    deliveries.push({
      id: `DEL-${1000 + i}`,
      trackingCode: `BR${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customerName: `Cliente ${i + 1}`,
      destination: `${district}, ${city}`,
      district,
      city,
      status,
      driverName: driverNames[Math.floor(Math.random() * driverNames.length)],
      vehicleId: `${vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]}-${100 + Math.floor(Math.random() * 50)}`,
      scheduledTime: scheduledDate.toISOString(),
      deliveredTime: status === 'entregue' ? new Date().toISOString() : undefined,
      cost: Math.round((Math.random() * 80 + 15) * 100) / 100,
      coordinates: [latitude, longitude] as [number, number],
      latitude,
      longitude,
      estimatedDelivery: new Date(scheduledDate.getTime() + Math.random() * 86400000 * 3).toISOString()
    });
  }
  
  return deliveries;
};

export const generateMockRoutes = (): Route[] => {
  return [
    {
      id: 'RT-001',
      name: 'Rota Centro SP',
      driverId: 'DR-001',
      driverName: 'João Silva',
      vehicleId: 'VAN-101',
      status: 'ativa',
      progress: 65,
      totalStops: 12,
      completedStops: 8,
      estimatedCompletion: '16:30',
      coordinates: [[-23.5505, -46.6333], [-23.5510, -46.6340], [-23.5515, -46.6350]],
      currentLocation: [-23.5510, -46.6340]
    },
    {
      id: 'RT-002',
      name: 'Rota Zona Sul RJ',
      driverId: 'DR-002',
      driverName: 'Maria Santos',
      vehicleId: 'MOTO-102',
      status: 'ativa',
      progress: 30,
      totalStops: 8,
      completedStops: 2,
      estimatedCompletion: '18:00',
      coordinates: [[-22.9068, -43.1729], [-22.9075, -43.1720], [-22.9080, -43.1710]],
      currentLocation: [-22.9075, -43.1720]
    },
    {
      id: 'RT-003',
      name: 'Rota BH Centro',
      driverId: 'DR-003',
      driverName: 'Carlos Ferreira',
      vehicleId: 'CAMINHÃO-103',
      status: 'concluida',
      progress: 100,
      totalStops: 15,
      completedStops: 15,
      estimatedCompletion: '14:00',
      coordinates: [[-19.9167, -43.9345], [-19.9170, -43.9350], [-19.9175, -43.9355]],
      currentLocation: [-19.9175, -43.9355]
    }
  ];
};

export const generateMockDrivers = (): Driver[] => {
  return driverNames.map((name, index) => ({
    id: `DR-${String(index + 1).padStart(3, '0')}`,
    name,
    deliveriesToday: Math.floor(Math.random() * 25) + 3,
    onTimeRate: Math.round((Math.random() * 25 + 75) * 100) / 100,
    avgDeliveryTime: Math.round((Math.random() * 45 + 35) * 100) / 100,
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
    status: ['ativo', 'inativo', 'em-rota'][Math.floor(Math.random() * 3)] as Driver['status']
  }));
};

export const generateKPIData = (deliveries: Delivery[]): KPIData => {
  const today = new Date().toDateString();
  const thisMonth = new Date().getMonth();
  
  const todayDeliveries = deliveries.filter(d => 
    new Date(d.scheduledTime).toDateString() === today
  );
  
  const monthDeliveries = deliveries.filter(d => 
    new Date(d.scheduledTime).getMonth() === thisMonth
  );
  
  const completedDeliveries = deliveries.filter(d => d.status === 'entregue');
  const onTimeDeliveries = completedDeliveries.filter(d => 
    d.deliveredTime && new Date(d.deliveredTime) <= new Date(d.estimatedDelivery)
  );
  
  return {
    totalDeliveriesToday: todayDeliveries.length,
    totalDeliveriesMonth: monthDeliveries.length,
    onTimeRate: completedDeliveries.length > 0 ? Math.round((onTimeDeliveries.length / completedDeliveries.length) * 100) : 0,
    avgDeliveryTime: Math.round(deliveries.reduce((acc, d) => acc + Math.random() * 60 + 45, 0) / deliveries.length),
    avgCost: Math.round(deliveries.reduce((acc, d) => acc + d.cost, 0) / deliveries.length * 100) / 100,
    pendingDeliveries: deliveries.filter(d => d.status === 'pendente').length,
    vehiclesOnRoute: 18
  };
};

export const generateChartData = (deliveries: Delivery[]): ChartData => {
  // Entregas por dia (últimos 30 dias)
  const deliveriesByDay = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayDeliveries = deliveries.filter(d => 
      new Date(d.scheduledTime).toDateString() === date.toDateString()
    );
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      deliveries: dayDeliveries.length
    };
  }).reverse();
  
  // Entregas por região (top 10)
  const regionCounts = deliveries.reduce((acc, delivery) => {
    acc[delivery.city] = (acc[delivery.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const deliveriesByRegion = Object.entries(regionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([region, deliveries]) => ({
      region,
      deliveries
    }));
  
  // Status das entregas
  const statusCounts = deliveries.reduce((acc, delivery) => {
    acc[delivery.status] = (acc[delivery.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const deliveriesByStatus = Object.entries(statusCounts).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
    count,
    color: statusColors[status as keyof typeof statusColors]
  }));
  
  // Custos ao longo do tempo
  const costOverTime = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayDeliveries = deliveries.filter(d => 
      new Date(d.scheduledTime).toDateString() === date.toDateString()
    );
    const dayCost = dayDeliveries.reduce((acc, d) => acc + d.cost, 0);
    return {
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      cost: Math.round(dayCost * 100) / 100
    };
  }).reverse();
  
  // Heatmap data
  const districtCounts = deliveries.reduce((acc, delivery) => {
    acc[delivery.district] = (acc[delivery.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const maxCount = Math.max(...Object.values(districtCounts));
  const heatmapData = Object.entries(districtCounts).map(([district, deliveries]) => ({
    district,
    deliveries,
    intensity: deliveries / maxCount
  }));
  
  return {
    deliveriesByDay,
    deliveriesByRegion,
    deliveriesByStatus,
    costOverTime,
    heatmapData
  };
};
