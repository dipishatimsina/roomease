const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getMyInquiries,
  getReceivedInquiries,
  replyToInquiry,
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('tenant'), createInquiry);
router.get('/mine', protect, authorize('tenant'), getMyInquiries);
router.get('/received', protect, authorize('owner'), getReceivedInquiries);
router.patch('/:id/reply', protect, authorize('owner'), replyToInquiry);

module.exports = router;