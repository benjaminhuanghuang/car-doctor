import { Car3D } from '@/components/Car3D';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Wrench, Calendar, TrendingUp } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-150">
          {/* Left Side - Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Car Care</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Your Smart Car
              <span className="block text-primary">Doctor Assistant</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Track maintenance, get AI-powered recommendations, and keep your vehicle running
              smoothly with intelligent insights and reminders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" onClick={() => navigate('/cars')} className="text-lg px-8">
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/about')}
                className="text-lg px-8"
              >
                Learn More
              </Button>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Smart Tracking</h3>
                  <p className="text-sm text-muted-foreground">Log all maintenance records</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Reminders</h3>
                  <p className="text-sm text-muted-foreground">Never miss a service</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Cost Analysis</h3>
                  <p className="text-sm text-muted-foreground">Track your expenses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - 3D Car */}
          <div className="relative h-150 bg-linear-to-br from-primary/5 to-primary/10 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Car3D color="#3b82f6" />
            </div>
            {/* Decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 right-10 w-20 h-20 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
