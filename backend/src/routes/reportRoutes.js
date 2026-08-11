const express = require('express');
const router = express.Router();
const { createReport, getAllReports, actionReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('tenant'), createReport);
router.get('/', protect, authorize('admin'), getAllReports);
router.patch('/:id/action', protect, authorize('admin'), actionReport);

module.exports = router;