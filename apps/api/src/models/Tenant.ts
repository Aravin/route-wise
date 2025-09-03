import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  slug: string;
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    favicon?: string;
  };
  paymentGateway: {
    stripe?: {
      publishableKey?: string;
      secretKey?: string;
      webhookSecret?: string;
    };
    razorpay?: {
      keyId?: string;
      keySecret?: string;
    };
  };
  notificationSettings: {
    email: {
      enabled: boolean;
      smtp?: {
        host?: string;
        port?: number;
        secure?: boolean;
        auth?: {
          user?: string;
          pass?: string;
        };
      };
    };
    sms: {
      enabled: boolean;
      provider: 'twilio' | 'aws-sns';
      credentials?: {
        accountSid?: string;
        authToken?: string;
        fromNumber?: string;
      };
    };
    push: {
      enabled: boolean;
      firebaseConfig?: {
        apiKey?: string;
        authDomain?: string;
        projectId?: string;
        storageBucket?: string;
        messagingSenderId?: string;
        appId?: string;
      };
    };
  };
  userRoles: Array<{
    name: string;
    permissions: string[];
  }>;
  settings: {
    currency: string;
    timezone: string;
    bookingPolicy: {
      advanceBookingDays: number;
      cancellationPolicy?: {
        hoursBeforeDeparture?: number;
        refundPercentage?: number;
      };
    };
  };
  status: 'active' | 'inactive' | 'suspended';
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise';
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
  };
}

const tenantSchema = new Schema<ITenant>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  branding: {
    logo: String,
    primaryColor: {
      type: String,
      default: '#3B82F6',
    },
    secondaryColor: {
      type: String,
      default: '#1E40AF',
    },
    favicon: String,
  },
  paymentGateway: {
    stripe: {
      publishableKey: String,
      secretKey: String,
      webhookSecret: String,
    },
    razorpay: {
      keyId: String,
      keySecret: String,
    },
  },
  notificationSettings: {
    email: {
      enabled: { type: Boolean, default: true },
      smtp: {
        host: String,
        port: Number,
        secure: Boolean,
        auth: {
          user: String,
          pass: String,
        },
      },
    },
    sms: {
      enabled: { type: Boolean, default: false },
      provider: {
        type: String,
        enum: ['twilio', 'aws-sns'],
        default: 'twilio',
      },
      credentials: {
        accountSid: String,
        authToken: String,
        fromNumber: String,
      },
    },
    push: {
      enabled: { type: Boolean, default: true },
      firebaseConfig: {
        apiKey: String,
        authDomain: String,
        projectId: String,
        storageBucket: String,
        messagingSenderId: String,
        appId: String,
      },
    },
  },
  userRoles: [{
    name: {
      type: String,
      required: true,
    },
    permissions: [{
      type: String,
      enum: [
        'manage_bookings',
        'manage_routes',
        'manage_buses',
        'manage_depots',
        'view_analytics',
        'manage_users',
        'manage_settings',
      ],
    }],
  }],
  settings: {
    currency: {
      type: String,
      default: 'INR',
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    bookingPolicy: {
      advanceBookingDays: {
        type: Number,
        default: 30,
      },
      cancellationPolicy: {
        hoursBeforeDeparture: Number,
        refundPercentage: Number,
      },
    },
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      default: 'basic',
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
}, {
  timestamps: true,
});

// Indexes
tenantSchema.index({ status: 1 });

export const TenantModel = mongoose.model<ITenant>('Tenant', tenantSchema);
