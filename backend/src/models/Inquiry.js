const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    preferredViewingDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'replied', 'closed'],
      default: 'pending',
    },
    ownerReply: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);