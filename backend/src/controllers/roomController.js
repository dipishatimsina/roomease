const Room = require('../models/Room');
const Property = require('../models/Property');

// @desc   Create a new room under a property (Owner only)
// @route  POST /api/rooms
const createRoom = async (req, res) => {
  try {
    const {
      property,
      roomNumber,
      roomType,
      rent,
      securityDeposit,
      waterCharge,
      electricityCharge,
      internetCharge,
      bathroomType,
      kitchenType,
      facilities,
      photos,
    } = req.body;

    if (!property || !roomNumber || !roomType || !rent) {
      return res.status(400).json({ message: 'property, roomNumber, roomType, and rent are required' });
    }

    // Confirm the property exists and belongs to this owner
    const propertyDoc = await Property.findById(property);
    if (!propertyDoc) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (propertyDoc.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this property' });
    }

    const room = await Room.create({
      property,
      owner: req.user._id,
      roomNumber,
      roomType,
      rent,
      securityDeposit,
      waterCharge,
      electricityCharge,
      internetCharge,
      bathroomType,
      kitchenType,
      facilities,
      photos,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all rooms under a specific property (public)
// @route  GET /api/rooms/property/:propertyId
const getRoomsByProperty = async (req, res) => {
  try {
    const rooms = await Room.find({ property: req.params.propertyId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all rooms belonging to the logged-in owner (across all their properties)
// @route  GET /api/rooms/mine
const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user._id }).populate('property', 'name location');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get a single room by ID (public)
// @route  GET /api/rooms/:id
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('property');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update a room (only the owning owner)
// @route  PUT /api/rooms/:id
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this room' });
    }

    Object.assign(room, req.body);
    const updated = await room.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update ONLY availability status (the 🟢🔴🟡 toggle from spec section 20)
// @route  PATCH /api/rooms/:id/availability
const updateAvailability = async (req, res) => {
  try {
    const { availabilityStatus } = req.body;

    if (!['available', 'occupied', 'reserved'].includes(availabilityStatus)) {
      return res.status(400).json({ message: 'Invalid availability status' });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this room' });
    }

    room.availabilityStatus = availabilityStatus;
    room.lastConfirmedAt = Date.now(); // also resets the "outdated listing" timer
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete a room
// @route  DELETE /api/rooms/:id
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }

    await room.deleteOne();
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Admin: verify a room (makes it visible in tenant search)
// @route  PATCH /api/rooms/:id/verify
const verifyRoom = async (req, res) => {
  try {
    const { isVerified } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.isVerified = !!isVerified;
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchRooms = async (req, res) => {
  try {
    const {
      location,
      minRent,
      maxRent,
      roomType,
      facilities,
      availableOnly,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { isVerified: true };

    if (roomType) filter.roomType = roomType;

    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }

    if (facilities) {
      const facilityList = facilities.split(',').map((f) => f.trim());
      filter.facilities = { $all: facilityList };
    }

    if (availableOnly === 'true') {
      filter.availabilityStatus = 'available';
    }

    // If searching by location, first find matching verified properties
    if (location) {
      const matchingProperties = await Property.find({
        location: { $regex: location, $options: 'i' },
        isVerified: true,
      }).select('_id');
      filter.property = { $in: matchingProperties.map((p) => p._id) };
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'lowest') sortOption = { rent: 1 };
    if (sortBy === 'highest') sortOption = { rent: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const rooms = await Room.find(filter)
      .populate('property', 'name location latitude longitude isVerified')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Room.countDocuments(filter);

    res.json({
      results: rooms,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Public: get multiple rooms by IDs for comparison
// @route  GET /api/rooms/compare?ids=id1,id2,id3
const compareRooms = async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ message: 'ids query param is required (comma-separated)' });
    }

    const idList = ids.split(',').map((id) => id.trim());

    if (idList.length < 2 || idList.length > 4) {
      return res.status(400).json({ message: 'Provide between 2 and 4 room IDs to compare' });
    }

    const rooms = await Room.find({ _id: { $in: idList } }).populate('property', 'name location');

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};