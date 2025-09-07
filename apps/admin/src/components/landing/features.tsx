import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bus, MapPin, Clock, Shield, Smartphone, Headphones } from 'lucide-react'

const features = [
  {
    icon: Bus,
    title: 'Wide Network',
    description: 'Access to thousands of bus routes across multiple operators with real-time availability.',
  },
  {
    icon: MapPin,
    title: 'Smart Routing',
    description: 'Find the best routes with detailed information about stops, timings, and amenities.',
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Get instant notifications about delays, cancellations, and schedule changes.',
  },
  {
    icon: Shield,
    title: 'Secure Booking',
    description: 'Safe and secure payment processing with multiple payment options and data protection.',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Optimized for mobile devices with a responsive design and intuitive interface.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to help you with bookings and travel assistance.',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Why Choose RouteWise?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of bus travel with our comprehensive platform designed for modern travelers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
