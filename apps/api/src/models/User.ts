import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
// Define User interface locally
interface User {
  _id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    profilePicture?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    language?: string;
    currency?: string;
    timezone?: string;
  };
  tenantId?: string;
  role: 'user' | 'admin' | 'operator' | 'driver' | 'conductor';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser extends User, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    profilePicture: {
      type: String,
    },
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India',
    },
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
    language: {
      type: String,
      default: 'en',
    },
    currency: {
      type: String,
      default: 'INR',
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
  },
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'operator', 'driver', 'conductor'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  lastLoginAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
userSchema.index({ tenantId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const UserModel = mongoose.model<IUser>('User', userSchema);
