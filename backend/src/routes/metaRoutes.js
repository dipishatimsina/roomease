const express = require('express');
const router = express.Router();
const {
  addLocation,
  getLocations,
  updateLocation,
  deleteLocation,
  addFacility,
  getFacilities,
  updateFacility,
  deleteFacility,
} = require('../controllers/metaController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/locations', getLocations);
router.post('/locations', protect, authorize('admin'), addLocation);
router.patch('/locations/:id', protect, authorize('admin'), updateLocation);
router.delete('/locations/:id', protect, authorize('admin'), deleteLocation);

router.get('/facilities', getFacilities);
router.post('/facilities', protect, authorize('admin'), addFacility);
router.patch('/facilities/:id', protect, authorize('admin'), updateFacility);
router.delete('/facilities/:id', protect, authorize('admin'), deleteFacility);

module.exports = router;