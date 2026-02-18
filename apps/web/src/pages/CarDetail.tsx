import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { carApi, maintenanceApi, type MaintenanceRecord } from '@/lib/api';
import {
  Car as CarIcon,
  Calendar,
  ArrowLeft,
  Plus,
  Wrench,
  DollarSign,
  Gauge,
  Trash2,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import ErrorDisplay from '@/components/ErrorDisplay';
import { Car3D } from '@/components/Car3D';
import { AddMaintenanceDialog } from '@/components/AddMaintenanceDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ChatPanel } from '@/components/ChatPanel';
import { useState } from 'react';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);
  const [deletingMaintenance, setDeletingMaintenance] = useState<MaintenanceRecord | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['car', id],
    queryFn: async () => {
      if (!id) throw new Error('Car ID is required');
      const response = await carApi.getCarById(id);
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    enabled: !!id,
  });

  const {
    data: maintenanceData,
    isLoading: isLoadingMaintenance,
    error: maintenanceError,
  } = useQuery({
    queryKey: ['maintenance', id],
    queryFn: async () => {
      if (!id) throw new Error('Car ID is required');
      const response = await maintenanceApi.getMaintenanceRecords(id);
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
    enabled: !!id,
  });

  const deleteMaintenanceMutation = useMutation({
    mutationFn: async (maintenanceId: string) => {
      const response = await maintenanceApi.deleteMaintenanceRecord(maintenanceId);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
      queryClient.invalidateQueries({ queryKey: ['car', id] });
      setDeletingMaintenance(null);
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data?.car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message={error instanceof Error ? error.message : 'Car not found'} />
        <div className="mt-4">
          <Button variant="outline" onClick={() => navigate('/cars')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
        </div>
      </div>
    );
  }

  const car = data.car;
  const maintenanceRecords = maintenanceData?.records || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getMaintenanceTypeLabel = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AddMaintenanceDialog
        open={isAddMaintenanceOpen}
        onOpenChange={setIsAddMaintenanceOpen}
        carId={car._id}
      />

      <ConfirmDialog
        open={!!deletingMaintenance}
        onOpenChange={(open) => !open && setDeletingMaintenance(null)}
        title="Delete Maintenance Record"
        description={`Are you sure you want to delete this ${
          deletingMaintenance ? getMaintenanceTypeLabel(deletingMaintenance.type) : 'maintenance'
        } record? This action cannot be undone.`}
        onConfirm={() =>
          deletingMaintenance && deleteMaintenanceMutation.mutate(deletingMaintenance._id)
        }
        confirmText="Delete"
        isLoading={deleteMaintenanceMutation.isPending}
      />

      <ChatPanel
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
        carInfo={{
          brand: car.brand,
          model: car.model,
          year: car.year,
          maintenanceCount: maintenanceRecords.length,
        }}
      />

      {/* Top Section - Car Info */}
      <div className="rounded-lg border bg-card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <CarIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="flex flex-row items-start gap-4">
              <h1 className="text-xl font-bold">
                {car.brand} {car.model}
              </h1>
              <div className="flex items-center gap-4 text-sm mt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{car.year}</span>
                </div>

                {car.color && (
                  <>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-4 w-4 rounded-full border-2"
                        style={{ backgroundColor: car.color.toLowerCase() }}
                      />
                      <span className="font-medium capitalize">{car.color}</span>
                    </div>
                  </>
                )}

                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{maintenanceRecords.length} records</span>
                </div>
              </div>
            </div>
          </div>
          <Button className="gap-2" onClick={() => setIsAddMaintenanceOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Maintenance
          </Button>
        </div>
      </div>

      {/* Bottom Section - 3D Car (Left) and History (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-150">
        {/* Left Column - 3D Car Visualization */}
        <div className="rounded-lg border bg-card overflow-hidden h-full">
          <Car3D color={car.color || '#3b82f6'} />
        </div>

        {/* Right Column - Maintenance Timeline */}
        <div className="rounded-lg border bg-card p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Maintenance History</h2>
            {maintenanceRecords.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {maintenanceRecords.length} record{maintenanceRecords.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {isLoadingMaintenance ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : maintenanceError ? (
            <ErrorDisplay
              message={
                maintenanceError instanceof Error
                  ? maintenanceError.message
                  : 'Failed to load maintenance records'
              }
            />
          ) : maintenanceRecords.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No maintenance records yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start tracking your car's maintenance history
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {maintenanceRecords.map((record) => (
                <div
                  key={record._id}
                  className="relative pl-8 pb-8 border-l-2 border-border last:pb-0 last:border-l-0"
                >
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{getMaintenanceTypeLabel(record.type)}</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(record.date)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {record.cost > 0 && (
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <DollarSign className="h-4 w-4" />
                            {record.cost.toFixed(2)}
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDeletingMaintenance(record)}
                          title="Delete maintenance record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm mb-3">{record.description}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Gauge className="h-3 w-3" />
                        {record.mileage.toLocaleString()} mi
                      </div>
                      {record.nextDueMileage && (
                        <div>Next: {record.nextDueMileage.toLocaleString()} mi</div>
                      )}
                      {record.nextDueDate && <div>Due: {formatDate(record.nextDueDate)}</div>}
                    </div>

                    {record.notes && (
                      <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                        <strong>Notes:</strong> {record.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg z-40"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default CarDetail;
