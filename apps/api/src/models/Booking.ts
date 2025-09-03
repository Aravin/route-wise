import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  userId: mongoose.Types.ObjectId;
  tenantId: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  passengers: Array<{
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    seatNumber: string;
    idProof?: {
      type: 'aadhar' | 'pan' | 'passport' | 'driving_license';
      number: string;
    };
  }>;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  fare: {
    baseFare: number;
    taxes: number;
    totalFare: number;
    currency: string;
  };
  payment: {
    method: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cash';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    gatewayResponse?: any;
    paidAt?: Date;
  };
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  cancellation?: {
    reason?: string;
    cancelledAt: Date;
    refundAmount: number;
    refundStatus: 'pending' | 'processed' | 'failed';
    refundTransactionId?: string;
  };
  boardingPoint: {
    depotId: mongoose.Types.ObjectId;
    time: string;
    address: string;
  };
  droppingPoint: {
    depotId: mongoose.Types.ObjectId;
    time: string;
    address: string;
  };
  specialRequests?: string;
  bookingSource: 'web' | 'mobile' | 'api';
  metadata?: any;
}

const bookingSchema = new Schema<IBooking>({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  passengers: [{
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    idProof: {
      type: {
        type: String,
        enum: ['aadhar', 'pan', 'passport', 'driving_license'],
      },
      number: String,
    },
  }],
  contactInfo: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  fare: {
    baseFare: {
      type: Number,
      required: true,
    },
    taxes: {
      type: Number,
      default: 0,
    },
    totalFare: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cash'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: String,
    gatewayResponse: Schema.Types.Mixed,
    paidAt: Date,
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'pending',
  },
  cancellation: {
    reason: String,
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
    },
    refundTransactionId: String,
  },
  boardingPoint: {
    depotId: {
      type: Schema.Types.ObjectId,
      ref: 'Depot',
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  droppingPoint: {
    depotId: {
      type: Schema.Types.ObjectId,
      ref: 'Depot',
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  specialRequests: String,
  bookingSource: {
    type: String,
    enum: ['web', 'mobile', 'api'],
    default: 'web',
  },
  metadata: Schema.Types.Mixed,
}, {
  timestamps: true,
});

// Indexes
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ tenantId: 1 });
bookingSchema.index({ tripId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ createdAt: -1 });

// Generate booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const count = await this.constructor.countDocuments();
    this.bookingId = `RW${Date.now().toString().slice(-8)}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

export const BookingModel = mongoose.model<IBooking>('Booking', bookingSchema);
