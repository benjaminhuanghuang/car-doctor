import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { carApi } from '@/lib/api';
import { Car as CarIcon, Calendar, Palette, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import ErrorDisplay from '@/components/ErrorDisplay';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/cars">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="bg-primary/5 p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <CarIcon className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{car.brand}</h1>
                <p className="text-xl text-muted-foreground mt-1">{car.model}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-semibold">{car.year}</p>
                </div>
              </div>

              {car.color && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Color</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="h-6 w-6 rounded-full border-2 border-border"
                        style={{ backgroundColor: car.color.toLowerCase() }}
                      />
                      <p className="font-semibold capitalize">{car.color}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t flex gap-3">
              <Button variant="outline" className="gap-2 flex-1">
                <Edit className="h-4 w-4" />
                Edit Car
              </Button>
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-6 rounded-lg border bg-muted/30">
          <h2 className="text-lg font-semibold mb-2">Maintenance History</h2>
          <p className="text-muted-foreground text-sm">
            No maintenance records yet. Start tracking your car's maintenance to keep it in top
            shape.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
