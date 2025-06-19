
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DeliveryForm from './DeliveryForm';

interface DeliveryManagerProps {
  deliveries: any[];
  drivers: any[];
  onUpdate: () => void;
}

const DeliveryManager = ({ deliveries, drivers, onUpdate }: DeliveryManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta entrega?')) return;

    try {
      const { error } = await supabase
        .from('deliveries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Entrega excluída com sucesso!');
      onUpdate();
    } catch (error) {
      console.error('Erro ao excluir entrega:', error);
      toast.error('Erro ao excluir entrega');
    }
  };

  const handleEdit = (delivery: any) => {
    setEditingDelivery(delivery);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDelivery(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregue': return 'text-green-600 bg-green-100';
      case 'em-transito': return 'text-blue-600 bg-blue-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'atrasada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (showForm) {
    return (
      <DeliveryForm
        delivery={editingDelivery}
        drivers={drivers}
        onSave={() => {
          onUpdate();
          handleFormClose();
        }}
        onCancel={handleFormClose}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciar Entregas</CardTitle>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Entrega
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.tracking_code}</TableCell>
                  <TableCell>{delivery.customer_name}</TableCell>
                  <TableCell>{delivery.destination}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </TableCell>
                  <TableCell>{delivery.driver_name}</TableCell>
                  <TableCell>R$ {delivery.cost}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(delivery)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(delivery.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryManager;
