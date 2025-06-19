
-- Create table for deliveries
CREATE TABLE public.deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  destination TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('entregue', 'em-transito', 'pendente', 'atrasada')),
  driver_name TEXT NOT NULL,
  vehicle_id TEXT NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  delivered_time TIMESTAMP WITH TIME ZONE,
  cost DECIMAL(10,2) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  estimated_delivery TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for routes
CREATE TABLE public.routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  driver_id TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  vehicle_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ativa', 'concluida', 'pausada')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  total_stops INTEGER NOT NULL DEFAULT 0,
  completed_stops INTEGER NOT NULL DEFAULT 0,
  estimated_completion TIMESTAMP WITH TIME ZONE NOT NULL,
  coordinates JSONB NOT NULL DEFAULT '[]',
  current_latitude DECIMAL(10,8) NOT NULL,
  current_longitude DECIMAL(11,8) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for drivers
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  deliveries_today INTEGER NOT NULL DEFAULT 0,
  on_time_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  avg_delivery_time INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3,2) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  status TEXT NOT NULL CHECK (status IN ('ativo', 'inativo', 'em-rota')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for this demo)
CREATE POLICY "Public can view deliveries" ON public.deliveries FOR SELECT TO public USING (true);
CREATE POLICY "Public can insert deliveries" ON public.deliveries FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update deliveries" ON public.deliveries FOR UPDATE TO public USING (true);
CREATE POLICY "Public can delete deliveries" ON public.deliveries FOR DELETE TO public USING (true);

CREATE POLICY "Public can view routes" ON public.routes FOR SELECT TO public USING (true);
CREATE POLICY "Public can insert routes" ON public.routes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update routes" ON public.routes FOR UPDATE TO public USING (true);
CREATE POLICY "Public can delete routes" ON public.routes FOR DELETE TO public USING (true);

CREATE POLICY "Public can view drivers" ON public.drivers FOR SELECT TO public USING (true);
CREATE POLICY "Public can insert drivers" ON public.drivers FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public can update drivers" ON public.drivers FOR UPDATE TO public USING (true);
CREATE POLICY "Public can delete drivers" ON public.drivers FOR DELETE TO public USING (true);

-- Create indexes for better performance
CREATE INDEX idx_deliveries_status ON public.deliveries(status);
CREATE INDEX idx_deliveries_city ON public.deliveries(city);
CREATE INDEX idx_deliveries_driver_name ON public.deliveries(driver_name);
CREATE INDEX idx_routes_status ON public.routes(status);
CREATE INDEX idx_drivers_status ON public.drivers(status);

-- Insert some sample data
INSERT INTO public.drivers (name, deliveries_today, on_time_rate, avg_delivery_time, rating, status) VALUES
  ('João Silva', 8, 92.5, 25, 4.7, 'ativo'),
  ('Maria Santos', 12, 88.0, 30, 4.5, 'em-rota'),
  ('Pedro Costa', 6, 95.0, 22, 4.9, 'ativo'),
  ('Ana Oliveira', 0, 85.0, 35, 4.2, 'inativo');

INSERT INTO public.deliveries (tracking_code, customer_name, destination, district, city, status, driver_name, vehicle_id, scheduled_time, cost, latitude, longitude, estimated_delivery) VALUES
  ('BR001234', 'Carlos Mendes', 'Rua das Flores, 123', 'Centro', 'São Paulo', 'entregue', 'João Silva', 'VAN-001', '2024-01-11 09:00:00+00', 45.50, -23.5505, -46.6333, '2024-01-11 10:30:00+00'),
  ('BR001235', 'Luciana Rocha', 'Av. Paulista, 456', 'Bela Vista', 'São Paulo', 'em-transito', 'Maria Santos', 'VAN-002', '2024-01-11 10:15:00+00', 32.75, -23.5616, -46.6565, '2024-01-11 12:00:00+00'),
  ('BR001236', 'Roberto Lima', 'Rua Augusta, 789', 'Consolação', 'São Paulo', 'pendente', 'Pedro Costa', 'VAN-003', '2024-01-11 14:30:00+00', 28.90, -23.5558, -46.6590, '2024-01-11 16:00:00+00');

INSERT INTO public.routes (name, driver_id, driver_name, vehicle_id, status, progress, total_stops, completed_stops, estimated_completion, coordinates, current_latitude, current_longitude) VALUES
  ('Rota Centro SP', 'driver-001', 'João Silva', 'VAN-001', 'ativa', 75, 8, 6, '2024-01-11 18:00:00+00', '[[-23.5505, -46.6333], [-23.5616, -46.6565]]', -23.5558, -46.6490),
  ('Rota Zona Sul', 'driver-002', 'Maria Santos', 'VAN-002', 'ativa', 45, 10, 4, '2024-01-11 19:30:00+00', '[[-23.5616, -46.6565], [-23.5558, -46.6590]]', -23.5600, -46.6580);
