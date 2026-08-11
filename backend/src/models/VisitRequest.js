const mongoose = require('mongoose');

const visitRequestSchema = new mongoose.Schema(
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
    visitDate: {
      type: Date,
      required: true,
    },
    visitTime: {
      type: String, // e.g. "4:00 PM"
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'rescheduled'],
      default: 'pending',
    },
    rescheduledDate: {
      type: Date,
    },
    rescheduledTime: {
      type: String,
    },
    ownerNote: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VisitRequest', visitRequestSchema);