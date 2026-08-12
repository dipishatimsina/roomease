const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      enum: ['Single Room', 'Double Room', '1BHK', '2BHK', 'Flat', 'Hostel', 'PG'],
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    waterCharge: {
      type: Number,
      default: 0,
    },
    electricityCharge: {
      type: Number,
      default: 0,
    },
    internetCharge: {
      type: Number,
      default: 0,
    },
    bathroomType: {
      type: String, // "Attached" or "Shared"
    },
    kitchenType: {
      type: String, // "Shared", "Private", "None"
    },
    facilities: [
      {
        type: String, // "Wi-Fi", "Parking", "Furnished", etc.
      },
    ],
    photos: [
      {
        type: String,
      },
    ],
    availabilityStatus: {
      type: String,
      enum: ['available', 'occupied', 'reserved'],
      default: 'available',
    },
    lastConfirmedAt: {
      type: Date,
      default: Date.now, // spec section 31: outdated listing tracking
    },
    isVerified: {
      type: Boolean,
      default: false, // admin verifies before it's publicly visible
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);