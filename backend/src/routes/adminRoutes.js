const express = require('express');
const router = express.Router();
const { verifyOwner, getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.patch('/verify-owner/:id', protect, authorize('admin'), verifyOwner);
router.get('/stats', protect, authorize('admin'), getStats);

module.exports = router;