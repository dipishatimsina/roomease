const Review = require('../models/Review');

// @desc   Tenant: leave a review for a property
// @route  POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { property, locationRating, cleanlinessRating, facilitiesRating, ownerRating, comment } = req.body;

    if (!property || !locationRating || !cleanlinessRating || !facilitiesRating || !ownerRating) {
      return res.status(400).json({ message: 'property and all four ratings are required' });
    }

    const review = await Review.create({
      tenant: req.user._id,
      property,
      locationRating,
      cleanlinessRating,
      facilitiesRating,
      ownerRating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Public: get all reviews for a property
// @route  GET /api/reviews/property/:propertyId
const getReviewsByProperty = async (req, res) => {
  try {
    const reviews = await Review.find({
      property: req.params.propertyId,
      isHidden: false,
    })
      .populate('tenant', 'fullName')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Admin: hide or unhide a review (moderation)
// @route  PATCH /api/reviews/:id/moderate
const moderateReview = async (req, res) => {
  try {
    const { isHidden } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isHidden = !!isHidden;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getReviewsByProperty, moderateReview };