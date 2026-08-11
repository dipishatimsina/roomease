const express = require('express');
const router = express.Router();
const { getMyTenancies, updateTenancy } = require('../controllers/tenancyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('owner'), getMyTenancies);
router.put('/:id', protect, authorize('owner'), updateTenancy);

module.exports = router;