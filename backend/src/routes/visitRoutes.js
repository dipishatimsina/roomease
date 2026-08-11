const express = require('express');
const router = express.Router();
const {
  createVisitRequest,
  getMyVisitRequests,
  getReceivedVisitRequests,
  respondToVisitRequest,
} = require('../controllers/visitRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('tenant'), createVisitRequest);
router.get('/mine', protect, authorize('tenant'), getMyVisitRequests);
router.get('/received', protect, authorize('owner'), getReceivedVisitRequests);
router.patch('/:id/respond', protect, authorize('owner'), respondToVisitRequest);

module.exports = router;