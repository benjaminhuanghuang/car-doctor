import { useQuery } from '@tanstack/react-query';
import { carApi, type Car } from '@/lib/api';
import { Car as CarIcon, Plus, Calendar, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import Error from '@/components/Error';

const CarList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const response = await carApi.getCars();
      if (response.error) throw new Error(response.error);
      return response.data!;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Error message={error instanceof Error ? error.message : 'An error occurred'} />;
  }

  const cars = data?.cars || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Cars</h1>
          <p className="text-muted-foreground mt-1">Manage and track your vehicles</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Car
        </Button>
      </div>

      {cars.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-100 border-2 border-dashed rounded-lg">
          <CarIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No cars yet</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-sm">
            Start by adding your first vehicle to keep track of maintenance and history
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Car
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

interface CarCardProps {
  car: Car;
}

const CarCard = ({ car }: CarCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <CarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{car.brand}</h3>
              <p className="text-sm text-muted-foreground">{car.model}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Year:</span>
            <span className="font-medium">{car.year}</span>
          </div>

          {car.color && (
            <div className="flex items-center gap-2 text-sm">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Color:</span>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border"
                  style={{ backgroundColor: car.color.toLowerCase() }}
                />
                <span className="font-medium capitalize">{car.color}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarList;
