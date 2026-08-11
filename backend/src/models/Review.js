const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    locationRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    cleanlinessRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    facilitiesRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    ownerRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
    isHidden: {
      type: Boolean,
      default: false, // admin can moderate/hide reviews
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);