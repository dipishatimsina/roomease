const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: String, // e.g. "Itahari Chowk" - matches admin-managed locations later
      required: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    description: {
      type: String,
    },
    propertyType: {
      type: String, // e.g. "Rental House", "Apartment Building"
    },
    photos: [
      {
        type: String, // image URLs
      },
    ],
    facilities: [
      {
        type: String, // e.g. "Wi-Fi", "Parking"
      },
    ],
    isVerified: {
      type: Boolean,
      default: false, // Admin approves this (spec section 30)
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);