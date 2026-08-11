const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    reason: {
      type: String,
      enum: [
        'Fake property',
        'Wrong location',
        'Wrong price',
        'Already rented',
        'Misleading photos',
        'Suspicious owner',
        'Other',
      ],
      required: true,
    },
    details: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminAction: {
      type: String, // e.g. "Owner warned", "Listing suspended"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);