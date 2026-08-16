const express = require('express');
const router = express.Router();
const { verifyOwner, getStats, getAllOwners } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.patch('/verify-owner/:id', protect, authorize('admin'), verifyOwner);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/owners', protect, authorize('admin'), getAllOwners);

module.exports = router;