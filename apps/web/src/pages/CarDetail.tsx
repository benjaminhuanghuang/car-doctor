import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { carApi, maintenanceApi } from '@/lib/api';
import {
  Car as CarIcon,
  Calendar,
  Palette,
  ArrowLeft,
  Plus,
  Wrench,
  DollarSign,
  Gauge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import ErrorDisplay from '@/components/ErrorDisplay';
import { Car3D } from '@/components/Car3D';
import { AddMaintenanceDialog } from '@/components/AddMaintenanceDialog';
import { useState } from 'react';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false);

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

      <div className="mb-6">
        <Link to="/cars">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Car Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/10">
                <CarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{car.brand}</h1>
                <p className="text-muted-foreground">{car.model}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Year</span>
                </div>
                <span className="font-medium">{car.year}</span>
              </div>

              {car.color && (
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Palette className="h-4 w-4" />
                    <span>Color</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-5 w-5 rounded-full border-2"
                      style={{ backgroundColor: car.color.toLowerCase() }}
                    />
                    <span className="font-medium capitalize">{car.color}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wrench className="h-4 w-4" />
                  <span>Records</span>
                </div>
                <span className="font-medium">{maintenanceRecords.length}</span>
              </div>
            </div>

            <Button className="w-full mt-6 gap-2" onClick={() => setIsAddMaintenanceOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Maintenance
            </Button>
          </div>
        </div>

        {/* Right Column - 3D Car and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3D Car Visualization */}
          <div className="rounded-lg border bg-card overflow-hidden">
            <Car3D color={car.color || '#3b82f6'} />
          </div>

          {/* Maintenance Timeline */}
          <div className="rounded-lg border bg-card p-6">
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
              <div className="text-center py-12">
                <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No maintenance records yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start tracking your car's maintenance history
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {maintenanceRecords.map((record) => (
                  <div
                    key={record._id}
                    className="relative pl-8 pb-8 border-l-2 border-border last:pb-0 last:border-l-0"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{getMaintenanceTypeLabel(record.type)}</h3>
                          <p className="text-sm text-muted-foreground">{formatDate(record.date)}</p>
                        </div>
                        {record.cost > 0 && (
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <DollarSign className="h-4 w-4" />
                            {record.cost.toFixed(2)}
                          </div>
                        )}
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
      </div>
    </div>
  );
};

export default CarDetail;
