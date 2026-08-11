const mongoose = require('mongoose');

const tenancySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    moveInDate: {
      type: Date,
      required: true,
    },
    moveOutDate: {
      type: Date,
    },
    rent: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'ended'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tenancy', tenancySchema);