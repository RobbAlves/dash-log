
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DriverFormProps {
  driver?: any;
  onSave: () => void;
  onCancel: () => void;
}

const DriverForm = ({ driver, onSave, onCancel }: DriverFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    deliveries_today: '0',
    on_time_rate: '0',
    avg_delivery_time: '0',
    rating: '0',
    status: 'ativo'
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || '',
        deliveries_today: driver.deliveries_today ? driver.deliveries_today.toString() : '0',
        on_time_rate: driver.on_time_rate ? driver.on_time_rate.toString() : '0',
        avg_delivery_time: driver.avg_delivery_time ? driver.avg_delivery_time.toString() : '0',
        rating: driver.rating ? driver.rating.toString() : '0',
        status: driver.status || 'ativo'
      });
    }
  }, [driver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const driverData = {
        name: formData.name,
        deliveries_today: parseInt(formData.deliveries_today),
        on_time_rate: parseFloat(formData.on_time_rate),
        avg_delivery_time: parseInt(formData.avg_delivery_time),
        rating: parseFloat(formData.rating),
        status: formData.status,
        updated_at: new Date().toISOString()
      };

      let result;
      if (driver) {
        result = await supabase
          .from('drivers')
          .update(driverData)
          .eq('id', driver.id);
      } else {
        result = await supabase
          .from('drivers')
          .insert([driverData]);
      }

      if (result.error) throw result.error;

      toast.success(driver ? 'Motorista atualizado com sucesso!' : 'Motorista criado com sucesso!');
      onSave();
    } catch (error) {
      console.error('Erro ao salvar motorista:', error);
      toast.error('Erro ao salvar motorista');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{driver ? 'Editar Motorista' : 'Novo Motorista'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveries_today">Entregas Hoje</Label>
              <Input
                id="deliveries_today"
                type="number"
                min="0"
                value={formData.deliveries_today}
                onChange={(e) => handleInputChange('deliveries_today', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="on_time_rate">Taxa de Pontualidade (%)</Label>
              <Input
                id="on_time_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.on_time_rate}
                onChange={(e) => handleInputChange('on_time_rate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avg_delivery_time">Tempo Médio de Entrega (min)</Label>
              <Input
                id="avg_delivery_time"
                type="number"
                min="0"
                value={formData.avg_delivery_time}
                onChange={(e) => handleInputChange('avg_delivery_time', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Avaliação (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', e.target.value)}
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
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="em-rota">Em Rota</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {driver ? 'Atualizar' : 'Criar'} Motorista
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DriverForm;
