const Property = require('../models/Property');

// @desc   Create a new property (Owner only)
// @route  POST /api/properties
const createProperty = async (req, res) => {
  try {
    const { name, address, location, latitude, longitude, description, propertyType, photos, facilities } = req.body;

    if (!name || !address || !location) {
      return res.status(400).json({ message: 'Name, address, and location are required' });
    }

    const property = await Property.create({
      owner: req.user._id,
      name,
      address,
      location,
      latitude,
      longitude,
      description,
      propertyType,
      photos,
      facilities,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all properties belonging to the logged-in owner
// @route  GET /api/properties/mine
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get a single property by ID
// @route  GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update a property (only the owning owner can update)
// @route  PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Ownership check — an owner can only edit their own property
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this property' });
    }

    Object.assign(property, req.body);
    const updated = await property.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete a property
// @route  DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProperty,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};