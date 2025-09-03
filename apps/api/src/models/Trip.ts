import mongoose, { Document, Schema } from 'mongoose';

export interface ITrip extends Document {
  tenantId: mongoose.Types.ObjectId;
  busId: mongoose.Types.ObjectId;
  routeId: mongoose.Types.ObjectId;
  departureTime: Date;
  arrivalTime: Date;
  fare: {
    baseFare: number;
    farePerKm: number;
    totalFare: number;
    currency: string;
  };
  availableSeats: number;
  totalSeats: number;
  seatMap: Array<{
    seatNumber: string;
    isAvailable: boolean;
    isBooked: boolean;
    passengerId?: mongoose.Types.ObjectId;
    bookingId?: mongoose.Types.ObjectId;
  }>;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled' | 'delayed';
  delay?: {
    reason?: string;
    estimatedDelay: number; // in minutes
    updatedAt: Date;
  };
  driver: {
    name: string;
    licenseNumber: string;
    phone: string;
    experience: number; // in years
  };
  conductor?: {
    name: string;
    phone: string;
    employeeId: string;
  };
  amenities: string[];
  boardingPoints: Array<{
    depotId: mongoose.Types.ObjectId;
    time: string;
    fare: number;
  }>;
  droppingPoints: Array<{
    depotId: mongoose.Types.ObjectId;
    time: string;
  }>;
  operatingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  isRecurring: boolean;
  parentTripId?: mongoose.Types.ObjectId; // For recurring trips
  metadata?: any;
}

const tripSchema = new Schema<ITrip>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  busId: {
    type: Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  routeId: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  fare: {
    baseFare: {
      type: Number,
      required: true,
    },
    farePerKm: {
      type: Number,
      required: true,
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
  availableSeats: {
    type: Number,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  seatMap: [{
    seatNumber: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    passengerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
  }],
  status: {
    type: String,
    enum: ['scheduled', 'boarding', 'departed', 'arrived', 'cancelled', 'delayed'],
    default: 'scheduled',
  },
  delay: {
    reason: String,
    estimatedDelay: {
      type: Number,
      default: 0,
    },
    updatedAt: Date,
  },
  driver: {
    name: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      default: 0,
    },
  },
  conductor: {
    name: String,
    phone: String,
    employeeId: String,
  },
  amenities: [{
    type: String,
  }],
  boardingPoints: [{
    depotId: {
      type: Schema.Types.ObjectId,
      ref: 'Depot',
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
  }],
  droppingPoints: [{
    depotId: {
      type: Schema.Types.ObjectId,
      ref: 'Depot',
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  }],
  operatingDays: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    sunday: { type: Boolean, default: true },
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  parentTripId: {
    type: Schema.Types.ObjectId,
    ref: 'Trip',
  },
  metadata: Schema.Types.Mixed,
}, {
  timestamps: true,
});

// Indexes
tripSchema.index({ tenantId: 1 });
tripSchema.index({ busId: 1 });
tripSchema.index({ routeId: 1 });
tripSchema.index({ departureTime: 1 });
tripSchema.index({ status: 1 });
tripSchema.index({ 'boardingPoints.depotId': 1 });
tripSchema.index({ 'droppingPoints.depotId': 1 });

export const TripModel = mongoose.model<ITrip>('Trip', tripSchema);
