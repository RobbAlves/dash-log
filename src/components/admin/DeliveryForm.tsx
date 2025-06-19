
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DeliveryFormProps {
  delivery?: any;
  drivers: any[];
  onSave: () => void;
  onCancel: () => void;
}

const DeliveryForm = ({ delivery, drivers, onSave, onCancel }: DeliveryFormProps) => {
  const [formData, setFormData] = useState({
    tracking_code: '',
    customer_name: '',
    destination: '',
    district: '',
    city: '',
    status: 'pendente',
    driver_name: '',
    vehicle_id: '',
    scheduled_time: '',
    delivered_time: '',
    cost: '',
    latitude: '',
    longitude: '',
    estimated_delivery: ''
  });

  useEffect(() => {
    if (delivery) {
      setFormData({
        tracking_code: delivery.tracking_code || '',
        customer_name: delivery.customer_name || '',
        destination: delivery.destination || '',
        district: delivery.district || '',
        city: delivery.city || '',
        status: delivery.status || 'pendente',
        driver_name: delivery.driver_name || '',
        vehicle_id: delivery.vehicle_id || '',
        scheduled_time: delivery.scheduled_time ? new Date(delivery.scheduled_time).toISOString().slice(0, 16) : '',
        delivered_time: delivery.delivered_time ? new Date(delivery.delivered_time).toISOString().slice(0, 16) : '',
        cost: delivery.cost ? delivery.cost.toString() : '',
        latitude: delivery.latitude ? delivery.latitude.toString() : '',
        longitude: delivery.longitude ? delivery.longitude.toString() : '',
        estimated_delivery: delivery.estimated_delivery ? new Date(delivery.estimated_delivery).toISOString().slice(0, 16) : ''
      });
    }
  }, [delivery]);

  const validateCoordinates = (lat: string, lng: string) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return false;
    }
    
    // Validar faixa de coordenadas válidas
    if (latitude < -90 || latitude > 90) {
      return false;
    }
    
    if (longitude < -180 || longitude > 180) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validar coordenadas antes de enviar
      if (!validateCoordinates(formData.latitude, formData.longitude)) {
        toast.error('Coordenadas inválidas. Latitude deve estar entre -90 e 90, longitude entre -180 e 180.');
        return;
      }

      const deliveryData = {
        tracking_code: formData.tracking_code,
        customer_name: formData.customer_name,
        destination: formData.destination,
        district: formData.district,
        city: formData.city,
        status: formData.status,
        driver_name: formData.driver_name,
        vehicle_id: formData.vehicle_id,
        scheduled_time: formData.scheduled_time,
        delivered_time: formData.delivered_time || null,
        cost: parseFloat(formData.cost),
        // Arredondar coordenadas para evitar overflow
        latitude: Math.round(parseFloat(formData.latitude) * 1000000) / 1000000,
        longitude: Math.round(parseFloat(formData.longitude) * 1000000) / 1000000,
        estimated_delivery: formData.estimated_delivery,
        updated_at: new Date().toISOString()
      };

      console.log('Dados da entrega a serem salvos:', deliveryData);

      let result;
      if (delivery) {
        result = await supabase
          .from('deliveries')
          .update(deliveryData)
          .eq('id', delivery.id);
      } else {
        result = await supabase
          .from('deliveries')
          .insert([deliveryData]);
      }

      if (result.error) {
        console.error('Erro do Supabase:', result.error);
        throw result.error;
      }

      console.log('Entrega salva com sucesso:', result);
      toast.success(delivery ? 'Entrega atualizada com sucesso!' : 'Entrega criada com sucesso!');
      onSave();
    } catch (error) {
      console.error('Erro ao salvar entrega:', error);
      toast.error('Erro ao salvar entrega: ' + (error?.message || 'Erro desconhecido'));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateSampleCoordinates = () => {
    // Coordenadas de exemplo para São Paulo
    const sampleCoordinates = [
      { lat: '-23.550520', lng: '-46.633309' }, // Centro de SP
      { lat: '-23.561684', lng: '-46.656139' }, // Paulista
      { lat: '-23.533773', lng: '-46.625290' }, // Liberdade
      { lat: '-23.574524', lng: '-46.624832' }, // Vila Olímpia
      { lat: '-23.587416', lng: '-46.632335' }, // Ibirapuera
    ];
    
    const randomCoord = sampleCoordinates[Math.floor(Math.random() * sampleCoordinates.length)];
    setFormData(prev => ({
      ...prev,
      latitude: randomCoord.lat,
      longitude: randomCoord.lng
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{delivery ? 'Editar Entrega' : 'Nova Entrega'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tracking_code">Código de Rastreamento</Label>
              <Input
                id="tracking_code"
                value={formData.tracking_code}
                onChange={(e) => handleInputChange('tracking_code', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer_name">Nome do Cliente</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => handleInputChange('customer_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Endereço de Destino</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">Bairro</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
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
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em-transito">Em Trânsito</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="atrasada">Atrasada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driver_name">Motorista</Label>
              <Select value={formData.driver_name} onValueChange={(value) => handleInputChange('driver_name', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um motorista" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.name}>
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
              <Label htmlFor="cost">Valor (R$)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <div className="flex gap-2">
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="Ex: -23.550520"
                  required
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={generateSampleCoordinates}
                >
                  Exemplo
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
                placeholder="Ex: -46.633309"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_time">Horário Agendado</Label>
              <Input
                id="scheduled_time"
                type="datetime-local"
                value={formData.scheduled_time}
                onChange={(e) => handleInputChange('scheduled_time', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_delivery">Entrega Estimada</Label>
              <Input
                id="estimated_delivery"
                type="datetime-local"
                value={formData.estimated_delivery}
                onChange={(e) => handleInputChange('estimated_delivery', e.target.value)}
                required
              />
            </div>

            {formData.status === 'entregue' && (
              <div className="space-y-2">
                <Label htmlFor="delivered_time">Horário de Entrega</Label>
                <Input
                  id="delivered_time"
                  type="datetime-local"
                  value={formData.delivered_time}
                  onChange={(e) => handleInputChange('delivered_time', e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {delivery ? 'Atualizar' : 'Criar'} Entrega
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DeliveryForm;
