const Tenancy = require('../models/Tenancy');

// @desc   Owner: view all their tenants
// @route  GET /api/tenancies
const getMyTenancies = async (req, res) => {
  try {
    const tenancies = await Tenancy.find({ owner: req.user._id })
      .populate('tenant', 'fullName phone email')
      .populate('room', 'roomNumber roomType rent')
      .sort({ createdAt: -1 });

    res.json(tenancies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Owner: update a tenancy (notes, move-out date, mark ended)
// @route  PUT /api/tenancies/:id
const updateTenancy = async (req, res) => {
  try {
    const tenancy = await Tenancy.findById(req.params.id);
    if (!tenancy) {
      return res.status(404).json({ message: 'Tenancy not found' });
    }
    if (tenancy.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { moveOutDate, notes, status } = req.body;
    if (moveOutDate) tenancy.moveOutDate = moveOutDate;
    if (notes !== undefined) tenancy.notes = notes;
    if (status) tenancy.status = status;

    await tenancy.save();

    // If tenancy ends, free up the room again
    if (status === 'ended') {
      const Room = require('../models/Room');
      const room = await Room.findById(tenancy.room);
      if (room) {
        room.availabilityStatus = 'available';
        room.lastConfirmedAt = Date.now();
        await room.save();
      }
    }

    res.json(tenancy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyTenancies, updateTenancy };