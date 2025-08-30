import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Zap, Users, Star, Check, TreePine, AlertCircle, BarChart3, Award, MapPin, Map, Cloud } from "lucide-react";
import heroImage from "@/assets/hero-mangroves.jpg";
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState({
    stats: [],
    features: [],
    testimonials: []
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/home/stats');
        setHomeData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching home data:', error);
        toast({
          title: "Error",
          description: "Using fallback data while server connection is restored.",
          variant: "destructive"
        });
        // Use fallback data when API fails
        setHomeData({
          stats: stats,
          features: fallbackFeatures,
          testimonials: testimonials
        });
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Fallback features in case API fails
  const fallbackFeatures = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee for environmental data",
      color: "text-primary"
    },
    {
      icon: AlertCircle,
      title: "Report Damage",
      description: "Easily report mangrove damage with photos and location data",
      color: "text-coral"
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Monitor conservation efforts and see real impact data",
      color: "text-ocean-deep"
    },
    {
      icon: Users,
      title: "Community Power",
      description: "Join a growing community of environmental protectors",
      color: "text-mangrove"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Marine Biologist",
      content: "This platform has revolutionized how our team monitors mangrove ecosystems. Highly recommended!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Environmental Scientist",
      content: "The best conservation tool we've used. Clean interface and powerful environmental tracking features.",
      rating: 5,
      avatar: "MC"
    }
  ];

  const pricingPlans = [
    {
      name: "Community",
      price: "Free",
      features: ["Up to 5 reports", "Basic tracking", "Community access"],
      popular: false
    },
    {
      name: "Guardian",
      price: "$9",
      period: "/month",
      features: ["Unlimited reports", "Advanced analytics", "Priority support", "Team collaboration"],
      popular: true
    },
    {
      name: "Protector",
      price: "$29",
      period: "/month", 
      features: ["Everything in Guardian", "API access", "Custom integrations", "Dedicated support"],
      popular: false
    }
  ];

  const stats = [
    { label: "Reports Submitted", value: "1,247", icon: MapPin },
    { label: "Active Protectors", value: "892", icon: Users },
    { label: "Areas Protected", value: "156", icon: Shield },
    { label: "Impact Score", value: "94%", icon: Award }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Protect Our
            <span className="block bg-gradient-to-r from-mangrove-light to-ocean-light bg-clip-text text-transparent">
              Mangrove Forests
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join the global community monitoring and protecting vital mangrove ecosystems. 
            Every report makes a difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-mangrove hover:shadow-floating transition-slow text-lg px-8 py-3">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-mangrove hover:shadow-floating transition-slow text-lg px-8 py-3">
                    <TreePine className="mr-2 h-5 w-5" />
                    Join the Mission
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-slow text-lg px-8 py-3">
                    <Users className="mr-2 h-5 w-5" />
                    Sign In
                  </Button>
                </Link>
              </>
            )}
            <Link to="/report">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-slow text-lg px-8 py-3">
                <AlertCircle className="mr-2 h-5 w-5" />
                Report Damage
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {(loading ? stats : homeData.stats).map((stat, index) => {
              const iconMap = {
                'MapPin': MapPin,
                'Users': Users,
                'Shield': Shield,
                'Award': Award
              };
              const IconComponent = iconMap[stat.icon] || Shield; // Fallback to Shield if icon not found

              return (
                <Card key={index} className="text-center shadow-nature hover:shadow-floating transition-slow">
                  <CardContent className="pt-6">
                    <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-mangrove bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple tools for powerful conservation impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(loading ? fallbackFeatures : homeData.features).map((feature, index) => {
              const iconMap = {
                'TreePine': TreePine,
                'Cloud': Cloud,
                'Users': Users,
                'Map': Map
              };
              const IconComponent = iconMap[feature.icon] || feature.icon || Shield; // Use provided icon or fallback to Shield
              
              return (
                <Card key={index} className="text-center shadow-nature hover:shadow-floating transition-slow border-border/50 bg-gradient-card">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex justify-center">
                      <IconComponent className={`h-12 w-12 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-mangrove bg-clip-text text-transparent">
              What Our Community Says
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of environmental protectors making a real difference
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-nature hover:shadow-floating transition-slow border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-mangrove rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-mangrove bg-clip-text text-transparent">
              Choose Your Impact Level
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start protecting mangrove forests today with a plan that fits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative shadow-nature hover:shadow-floating transition-slow border-border/50 ${
                plan.popular ? 'border-primary ring-2 ring-primary/20 scale-105' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-mangrove text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-gradient-mangrove hover:shadow-floating' 
                        : 'bg-secondary hover:bg-secondary/80'
                    } transition-all duration-300`}
                  >
                    {isAuthenticated ? 'Upgrade Plan' : 'Get Started'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-mangrove">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our global community of mangrove protectors and help preserve these vital ecosystems for future generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <Link to="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3 bg-white text-primary hover:bg-white/90">
                  <TreePine className="mr-2 h-5 w-5" />
                  Start Protecting Today
                </Button>
              </Link>
            )}
            <Link to="/report">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-3">
                <AlertCircle className="mr-2 h-5 w-5" />
                Report Environmental Damage
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;