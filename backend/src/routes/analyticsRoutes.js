const express = require('express');
const router = express.Router();
const { getRoomAnalytics, getOwnerAnalyticsOverview } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/overview', protect, authorize('owner'), getOwnerAnalyticsOverview);
router.get('/room/:roomId', protect, authorize('owner'), getRoomAnalytics);

module.exports = router;