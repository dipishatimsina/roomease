const express = require('express');
const router = express.Router();
const {
  createProperty,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  verifyProperty,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes below require login; creation/edit/delete require 'owner' role
router.post('/', protect, authorize('owner'), createProperty);
router.get('/mine', protect, authorize('owner'), getMyProperties);
router.get('/:id', getPropertyById); // public — anyone can view a property
router.put('/:id', protect, authorize('owner'), updateProperty);
router.patch('/:id/verify', protect, authorize('admin'), verifyProperty);
router.delete('/:id', protect, authorize('owner'), deleteProperty);

module.exports = router;