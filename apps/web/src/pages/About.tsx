import {
  Sparkles,
  Target,
  Wrench,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Brain,
  Car,
  MessageCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">About Car Doctor</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold">
              Your AI-Powered Vehicle Maintenance Companion
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Car Doctor is an intelligent platform designed to help you track, manage, and optimize
              your vehicle maintenance with the power of artificial intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that car maintenance shouldn't be complicated or stressful. Our mission is
              to empower every car owner with the tools and insights they need to keep their
              vehicles running smoothly, safely, and efficiently.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              By combining intelligent tracking, AI-powered recommendations, and an intuitive
              interface, we make it easy to stay on top of your vehicle's needs and avoid costly
              repairs down the road.
            </p>
          </div>

          <div className="bg-muted/50 rounded-2xl p-8 space-y-6">
            <h3 className="text-2xl font-bold">Why Choose Car Doctor?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Reliable & Secure</h4>
                  <p className="text-sm text-muted-foreground">
                    Your data is protected with industry-standard security
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">Fast & Easy</h4>
                  <p className="text-sm text-muted-foreground">
                    Log maintenance in seconds with our streamlined interface
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-semibold">AI-Powered</h4>
                  <p className="text-sm text-muted-foreground">
                    Get intelligent insights and recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to maintain your vehicle in one intelligent platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-6 space-y-4 border">
              <div className="p-3 rounded-full bg-primary/10 w-fit">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Maintenance Tracking</h3>
              <p className="text-muted-foreground">
                Log all services, repairs, and maintenance with detailed records including cost,
                mileage, and dates.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 space-y-4 border">
              <div className="p-3 rounded-full bg-primary/10 w-fit">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Smart Reminders</h3>
              <p className="text-muted-foreground">
                Never miss an oil change or service again with intelligent reminders based on time
                and mileage.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 space-y-4 border">
              <div className="p-3 rounded-full bg-primary/10 w-fit">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Cost Analysis</h3>
              <p className="text-muted-foreground">
                Track your maintenance expenses over time and identify patterns to budget
                effectively.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 space-y-4 border">
              <div className="p-3 rounded-full bg-primary/10 w-fit">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">AI Chat Assistant</h3>
              <p className="text-muted-foreground">
                Get instant answers to your car maintenance questions with our intelligent chat
                assistant.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 space-y-4 border">
              <div className="p-3 rounded-full bg-primary/10 w-fit">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Multiple Vehicles</h3>
              <p className="text-muted-foreground">
                Manage maintenance for all your vehicles in one place with 3D visualization and
                detailed histories.
              </p>
            </div>

            <div className="bg-background rounded-xl p-6 space-y-4 border">
              <div className="p-3 rounded-full bg-primary/10 w-fit">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Service History</h3>
              <p className="text-muted-foreground">
                Complete timeline view of all maintenance activities with searchable and filterable
                records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-2xl font-bold text-primary">
              1
            </div>
            <h3 className="text-xl font-semibold">Add Your Vehicle</h3>
            <p className="text-muted-foreground">
              Enter your car's details - make, model, year, and color. View it in 3D!
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-2xl font-bold text-primary">
              2
            </div>
            <h3 className="text-xl font-semibold">Log Maintenance</h3>
            <p className="text-muted-foreground">
              Record oil changes, tire rotations, repairs, and more with all the details.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-2xl font-bold text-primary">
              3
            </div>
            <h3 className="text-xl font-semibold">Stay Informed</h3>
            <p className="text-muted-foreground">
              Get AI-powered insights, reminders, and chat assistance for optimal car care.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of car owners who are already using Car Doctor to maintain their vehicles
            with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/cars')}
              className="text-lg px-8"
            >
              <Users className="h-5 w-5 mr-2" />
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/')}
              className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              View Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
