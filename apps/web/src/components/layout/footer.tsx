import Link from 'next/link'
import { Bus, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bus className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold gradient-text">RouteWise</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your Journey, Simplified. Smart bus booking for smarter travel across multiple operators and routes.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/search" className="block text-muted-foreground hover:text-primary transition-colors">
                Search Buses
              </Link>
              <Link href="/routes" className="block text-muted-foreground hover:text-primary transition-colors">
                Popular Routes
              </Link>
              <Link href="/offers" className="block text-muted-foreground hover:text-primary transition-colors">
                Offers & Deals
              </Link>
              <Link href="/cancellation" className="block text-muted-foreground hover:text-primary transition-colors">
                Cancellation Policy
              </Link>
              <Link href="/refund" className="block text-muted-foreground hover:text-primary transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2 text-sm">
              <Link href="/help" className="block text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link href="/faq" className="block text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
              <Link href="/feedback" className="block text-muted-foreground hover:text-primary transition-colors">
                Feedback
              </Link>
              <Link href="/complaints" className="block text-muted-foreground hover:text-primary transition-colors">
                Complaints
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">support@routewise.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+91 98765 43210</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">
                  123 Tech Park,<br />
                  Bangalore, Karnataka 560001
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 RouteWise. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
