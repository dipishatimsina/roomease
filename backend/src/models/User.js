const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['tenant', 'owner', 'admin'],
      default: 'tenant',
      required: true,
    },
    // Tenant-specific (optional fields)
    gender: {
      type: String,
    },
    occupation: {
      type: String,
    },
    preferredLocation: {
      type: String,
    },
    // Owner-specific
    isVerifiedOwner: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);