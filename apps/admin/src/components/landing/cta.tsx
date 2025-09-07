import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Download, Smartphone } from 'lucide-react'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
          <CardContent className="p-12 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-xl opacity-90">
                  Join thousands of travelers who have made RouteWise their preferred choice for bus bookings.
                  Experience seamless travel planning today!
                </p>
              </div>

              <div className="flex justify-center">
                <Link href="/search">
                  <Button size="lg" variant="secondary">
                    Book Your Bus Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm opacity-80">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>Mobile App Coming Soon</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download for iOS & Android</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
