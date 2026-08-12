const Location = require('../models/Location');
const Facility = require('../models/Facility');

// ===== LOCATIONS =====

// @desc   Admin: add a new location
// @route  POST /api/locations
const addLocation = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });

    const exists = await Location.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Location already exists' });

    const location = await Location.create({ name });
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Public: get all active locations (for search dropdowns)
// @route  GET /api/locations
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true }).sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Admin: activate/deactivate or delete a location
// @route  PATCH /api/locations/:id
const updateLocation = async (req, res) => {
  try {
    const { isActive, name } = req.body;
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });

    if (isActive !== undefined) location.isActive = isActive;
    if (name) location.name = name;
    await location.save();

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Admin: delete a location
// @route  DELETE /api/locations/:id
const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    await location.deleteOne();
    res.json({ message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===== FACILITIES =====

const addFacility = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });

    const exists = await Facility.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Facility already exists' });

    const facility = await Facility.create({ name });
    res.status(201).json(facility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({ isActive: true }).sort({ name: 1 });
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFacility = async (req, res) => {
  try {
    const { isActive, name } = req.body;
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });

    if (isActive !== undefined) facility.isActive = isActive;
    if (name) facility.name = name;
    await facility.save();

    res.json(facility);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    await facility.deleteOne();
    res.json({ message: 'Facility deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addLocation,
  getLocations,
  updateLocation,
  deleteLocation,
  addFacility,
  getFacilities,
  updateFacility,
  deleteFacility,
};