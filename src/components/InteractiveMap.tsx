
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  status: 'entregue' | 'em-transito' | 'pendente' | 'atrasada';
}

interface InteractiveMapProps {
  markers: MapMarker[];
  routes?: Array<{
    id: string;
    coordinates: [number, number][];
    color: string;
  }>;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ markers, routes = [] }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Simulação de mapa interativo
    const canvas = document.createElement('canvas');
    canvas.width = mapRef.current.offsetWidth;
    canvas.height = 400;
    canvas.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    canvas.style.borderRadius = '8px';
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Desenhar base do mapa
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar "ruas" simuladas
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, 0);
      ctx.lineTo(Math.random() * canvas.width, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * canvas.height);
      ctx.lineTo(canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Desenhar rotas
    routes.forEach(route => {
      ctx.strokeStyle = route.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      route.coordinates.forEach((coord, index) => {
        const x = (coord[1] + 46.7) * canvas.width / 0.2;
        const y = (23.6 - coord[0]) * canvas.height / 0.2;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    });

    // Desenhar marcadores
    markers.forEach(marker => {
      const x = Math.random() * (canvas.width - 20) + 10;
      const y = Math.random() * (canvas.height - 20) + 10;
      
      const colors = {
        'entregue': '#22c55e',
        'em-transito': '#f59e0b',
        'pendente': '#6b7280',
        'atrasada': '#ef4444'
      };
      
      ctx.fillStyle = colors[marker.status];
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Borda branca
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    mapRef.current.appendChild(canvas);

    return () => {
      if (mapRef.current && canvas.parentNode) {
        mapRef.current.removeChild(canvas);
      }
    };
  }, [markers, routes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Mapa de Entregas em Tempo Real
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden" />
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Entregue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Em Trânsito</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Atrasada</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
