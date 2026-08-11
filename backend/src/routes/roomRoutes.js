const express = require('express');
const router = express.Router();
const {
  createRoom,
  getRoomsByProperty,
  getMyRooms,
  getRoomById,
  updateRoom,
  updateAvailability,
  deleteRoom,
  verifyRoom,
  searchRooms,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('owner'), createRoom);
router.get('/mine', protect, authorize('owner'), getMyRooms);
router.get('/property/:propertyId', getRoomsByProperty); // public
router.get('/:id', getRoomById); // public
router.put('/:id', protect, authorize('owner'), updateRoom);
router.patch('/:id/availability', protect, authorize('owner'), updateAvailability);
router.patch('/:id/verify', protect, authorize('admin'), verifyRoom);
router.get('/', searchRooms); // public search — GET /api/rooms?location=...&minRent=...
router.delete('/:id', protect, authorize('owner'), deleteRoom);

module.exports = router;