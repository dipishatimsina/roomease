const express = require('express');
const router = express.Router();
const { createReview, getReviewsByProperty, moderateReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('tenant'), createReview);
router.get('/property/:propertyId', getReviewsByProperty);
router.patch('/:id/moderate', protect, authorize('admin'), moderateReview);

module.exports = router;