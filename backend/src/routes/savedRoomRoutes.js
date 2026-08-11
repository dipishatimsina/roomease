const express = require('express');
const router = express.Router();
const { saveRoom, unsaveRoom, getSavedRooms } = require('../controllers/savedRoomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:roomId', protect, authorize('tenant'), saveRoom);
router.delete('/:roomId', protect, authorize('tenant'), unsaveRoom);
router.get('/', protect, authorize('tenant'), getSavedRooms);

module.exports = router;