const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getReceivedApplications,
  respondToApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('tenant'), createApplication);
router.get('/mine', protect, authorize('tenant'), getMyApplications);
router.get('/received', protect, authorize('owner'), getReceivedApplications);
router.patch('/:id/respond', protect, authorize('owner'), respondToApplication);

module.exports = router;