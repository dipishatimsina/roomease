const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'inquiry_replied',
        'visit_accepted',
        'visit_rejected',
        'visit_rescheduled',
        'application_accepted',
        'application_rejected',
        'room_unavailable',
        'owner_verified',
        'property_approved',
        'property_rejected',
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);