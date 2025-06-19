
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
import RouteForm from './RouteForm';

interface RouteManagerProps {
  routes: any[];
  drivers: any[];
  onUpdate: () => void;
}

const RouteManager = ({ routes, drivers, onUpdate }: RouteManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta rota?')) return;

    try {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Rota excluída com sucesso!');
      onUpdate();
    } catch (error) {
      console.error('Erro ao excluir rota:', error);
      toast.error('Erro ao excluir rota');
    }
  };

  const handleEdit = (route: any) => {
    setEditingRoute(route);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRoute(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'text-green-600 bg-green-100';
      case 'concluida': return 'text-blue-600 bg-blue-100';
      case 'pausada': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (showForm) {
    return (
      <RouteForm
        route={editingRoute}
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
        <CardTitle>Gerenciar Rotas</CardTitle>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Rota
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Paradas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell>{route.driver_name}</TableCell>
                  <TableCell>{route.vehicle_id}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                      {route.status}
                    </span>
                  </TableCell>
                  <TableCell>{route.progress}%</TableCell>
                  <TableCell>{route.completed_stops}/{route.total_stops}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(route)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(route.id)}
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

export default RouteManager;
