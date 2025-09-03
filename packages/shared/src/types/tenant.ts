import { z } from 'zod';

// Tenant Schema
export const TenantSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Tenant name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  branding: z.object({
    logo: z.string().url().optional(),
    primaryColor: z.string().default('#3B82F6'),
    secondaryColor: z.string().default('#1E40AF'),
    favicon: z.string().url().optional(),
  }).default({}),
  paymentGateway: z.object({
    stripe: z.object({
      publishableKey: z.string().optional(),
      secretKey: z.string().optional(),
      webhookSecret: z.string().optional(),
    }).optional(),
    razorpay: z.object({
      keyId: z.string().optional(),
      keySecret: z.string().optional(),
    }).optional(),
  }).default({}),
  notificationSettings: z.object({
    email: z.object({
      enabled: z.boolean().default(true),
      smtp: z.object({
        host: z.string().optional(),
        port: z.number().optional(),
        secure: z.boolean().optional(),
        auth: z.object({
          user: z.string().optional(),
          pass: z.string().optional(),
        }).optional(),
      }).optional(),
    }).default({}),
    sms: z.object({
      enabled: z.boolean().default(false),
      provider: z.enum(['twilio', 'aws-sns']).default('twilio'),
      credentials: z.object({
        accountSid: z.string().optional(),
        authToken: z.string().optional(),
        fromNumber: z.string().optional(),
      }).optional(),
    }).default({}),
    push: z.object({
      enabled: z.boolean().default(true),
      firebaseConfig: z.object({
        apiKey: z.string().optional(),
        authDomain: z.string().optional(),
        projectId: z.string().optional(),
        storageBucket: z.string().optional(),
        messagingSenderId: z.string().optional(),
        appId: z.string().optional(),
      }).optional(),
    }).default({}),
  }).default({}),
  userRoles: z.array(z.object({
    name: z.string(),
    permissions: z.array(z.enum([
      'manage_bookings',
      'manage_routes',
      'manage_buses',
      'manage_depots',
      'view_analytics',
      'manage_users',
      'manage_settings'
    ])),
  })).default([]),
  settings: z.object({
    currency: z.string().default('INR'),
    timezone: z.string().default('Asia/Kolkata'),
    bookingPolicy: z.object({
      advanceBookingDays: z.number().default(30),
      cancellationPolicy: z.object({
        hoursBeforeDeparture: z.number().optional(),
        refundPercentage: z.number().optional(),
      }).optional(),
    }).default({}),
  }).default({}),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  subscription: z.object({
    plan: z.enum(['basic', 'premium', 'enterprise']).default('basic'),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    isActive: z.boolean().default(true),
  }).default({}),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Tenant = z.infer<typeof TenantSchema>;

// Sub-Tenant Schema
export const SubTenantSchema = z.object({
  _id: z.string().optional(),
  tenantId: z.string(),
  name: z.string().min(1, 'Sub-tenant name is required'),
  location: z.object({
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string().min(1, 'Pincode is required'),
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }).optional(),
  }),
  contactDetails: z.object({
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email format'),
    alternatePhone: z.string().optional(),
    website: z.string().url().optional(),
  }),
  manager: z.object({
    name: z.string().min(1, 'Manager name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(1, 'Manager phone is required'),
  }),
  settings: z.object({
    operatingHours: z.object({
      start: z.string().default('06:00'),
      end: z.string().default('22:00'),
    }).default({}),
    bookingSettings: z.object({
      allowOnlineBooking: z.boolean().default(true),
      advanceBookingDays: z.number().default(30),
    }).default({}),
  }).default({}),
  status: z.enum(['active', 'inactive']).default('active'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type SubTenant = z.infer<typeof SubTenantSchema>;
