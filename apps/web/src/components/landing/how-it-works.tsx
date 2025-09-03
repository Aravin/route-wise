import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, CreditCard, CheckCircle } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Search & Select',
    description: 'Enter your travel details and browse through available buses with real-time pricing and seat availability.',
  },
  {
    step: '02',
    icon: CreditCard,
    title: 'Book & Pay',
    description: 'Select your preferred seats and complete the booking with secure payment options including cards, UPI, and wallets.',
  },
  {
    step: '03',
    icon: CheckCircle,
    title: 'Travel Confirmed',
    description: 'Get instant confirmation with e-ticket and boarding pass. Receive updates about your journey via SMS and email.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Book your bus ticket in just three simple steps and enjoy a hassle-free journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 relative">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border transform -translate-y-1/2 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
