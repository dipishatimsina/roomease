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
  compareRooms,
  confirmStillAvailable,
  getRoomsNeedingConfirmation,
  getAllRoomsForAdmin,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', searchRooms);
router.get('/compare', compareRooms);
router.get('/needs-confirmation', protect, authorize('owner'), getRoomsNeedingConfirmation);
router.post('/', protect, authorize('owner'), createRoom);
router.get('/mine', protect, authorize('owner'), getMyRooms);
router.get('/property/:propertyId', getRoomsByProperty);
router.get('/admin/all', protect, authorize('admin'), getAllRoomsForAdmin);
router.get('/:id', getRoomById);
router.put('/:id', protect, authorize('owner'), updateRoom);
router.patch('/:id/availability', protect, authorize('owner'), updateAvailability);
router.patch('/:id/verify', protect, authorize('admin'), verifyRoom);
router.patch('/:id/confirm', protect, authorize('owner'), confirmStillAvailable);
router.delete('/:id', protect, authorize('owner'), deleteRoom);


module.exports = router;