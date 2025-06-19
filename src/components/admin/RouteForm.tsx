
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RouteFormProps {
  route?: any;
  drivers: any[];
  onSave: () => void;
  onCancel: () => void;
}

const RouteForm = ({ route, drivers, onSave, onCancel }: RouteFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    driver_id: '',
    driver_name: '',
    vehicle_id: '',
    status: 'ativa',
    progress: '0',
    total_stops: '0',
    completed_stops: '0',
    estimated_completion: '',
    current_latitude: '',
    current_longitude: ''
  });

  useEffect(() => {
    if (route) {
      setFormData({
        name: route.name || '',
        driver_id: route.driver_id || '',
        driver_name: route.driver_name || '',
        vehicle_id: route.vehicle_id || '',
        status: route.status || 'ativa',
        progress: route.progress ? route.progress.toString() : '0',
        total_stops: route.total_stops ? route.total_stops.toString() : '0',
        completed_stops: route.completed_stops ? route.completed_stops.toString() : '0',
        estimated_completion: route.estimated_completion ? new Date(route.estimated_completion).toISOString().slice(0, 16) : '',
        current_latitude: route.current_latitude ? route.current_latitude.toString() : '',
        current_longitude: route.current_longitude ? route.current_longitude.toString() : ''
      });
    }
  }, [route]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const routeData = {
        name: formData.name,
        driver_id: formData.driver_id,
        driver_name: formData.driver_name,
        vehicle_id: formData.vehicle_id,
        status: formData.status,
        progress: parseInt(formData.progress),
        total_stops: parseInt(formData.total_stops),
        completed_stops: parseInt(formData.completed_stops),
        estimated_completion: formData.estimated_completion,
        coordinates: [],
        current_latitude: parseFloat(formData.current_latitude),
        current_longitude: parseFloat(formData.current_longitude),
        updated_at: new Date().toISOString()
      };

      let result;
      if (route) {
        result = await supabase
          .from('routes')
          .update(routeData)
          .eq('id', route.id);
      } else {
        result = await supabase
          .from('routes')
          .insert([routeData]);
      }

      if (result.error) throw result.error;

      toast.success(route ? 'Rota atualizada com sucesso!' : 'Rota criada com sucesso!');
      onSave();
    } catch (error) {
      console.error('Erro ao salvar rota:', error);
      toast.error('Erro ao salvar rota');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDriverChange = (driverId: string) => {
    const selectedDriver = drivers.find(d => d.id === driverId);
    setFormData(prev => ({
      ...prev,
      driver_id: driverId,
      driver_name: selectedDriver ? selectedDriver.name : ''
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{route ? 'Editar Rota' : 'Nova Rota'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Rota</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="driver">Motorista</Label>
              <Select value={formData.driver_id} onValueChange={handleDriverChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um motorista" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle_id">ID do Veículo</Label>
              <Input
                id="vehicle_id"
                value={formData.vehicle_id}
                onChange={(e) => handleInputChange('vehicle_id', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progresso (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange('progress', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_stops">Total de Paradas</Label>
              <Input
                id="total_stops"
                type="number"
                min="0"
                value={formData.total_stops}
                onChange={(e) => handleInputChange('total_stops', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="completed_stops">Paradas Concluídas</Label>
              <Input
                id="completed_stops"
                type="number"
                min="0"
                value={formData.completed_stops}
                onChange={(e) => handleInputChange('completed_stops', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_completion">Conclusão Estimada</Label>
              <Input
                id="estimated_completion"
                type="datetime-local"
                value={formData.estimated_completion}
                onChange={(e) => handleInputChange('estimated_completion', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_latitude">Latitude Atual</Label>
              <Input
                id="current_latitude"
                type="number"
                step="any"
                value={formData.current_latitude}
                onChange={(e) => handleInputChange('current_latitude', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_longitude">Longitude Atual</Label>
              <Input
                id="current_longitude"
                type="number"
                step="any"
                value={formData.current_longitude}
                onChange={(e) => handleInputChange('current_longitude', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {route ? 'Atualizar' : 'Criar'} Rota
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RouteForm;
