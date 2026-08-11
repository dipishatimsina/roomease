const Application = require('../models/Application');
const Room = require('../models/Room');

// @desc   Tenant: apply for a room
// @route  POST /api/applications
const createApplication = async (req, res) => {
  try {
    const { room, preferredMoveInDate, note } = req.body;

    if (!room || !preferredMoveInDate) {
      return res.status(400).json({ message: 'room and preferredMoveInDate are required' });
    }

    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (roomDoc.availabilityStatus === 'occupied') {
      return res.status(400).json({ message: 'This room is already occupied' });
    }

    const application = await Application.create({
      tenant: req.user._id,
      owner: roomDoc.owner,
      room,
      preferredMoveInDate,
      note,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Tenant: view their own applications
// @route  GET /api/applications/mine
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ tenant: req.user._id })
      .populate('room', 'roomNumber roomType rent')
      .populate('owner', 'fullName phone')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Owner: view applications received for their rooms
// @route  GET /api/applications/received
const getReceivedApplications = async (req, res) => {
  try {
    const applications = await Application.find({ owner: req.user._id })
      .populate('room', 'roomNumber roomType rent')
      .populate('tenant', 'fullName phone email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Owner: accept or reject an application
// @route  PATCH /api/applications/:id/respond
const respondToApplication = async (req, res) => {
  try {
    const { action } = req.body; // "accept" | "reject"

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (application.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this application' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: `Application is already ${application.status}` });
    }

    if (action === 'accept') {
      application.status = 'accepted';
      await application.save();

      // Core spec rule: Application accepted → Room becomes Occupied → Listing Unavailable
      const room = await Room.findById(application.room);
      room.availabilityStatus = 'occupied';
      room.lastConfirmedAt = Date.now();
      await room.save();

      // Auto-reject all other pending applications for this same room
      await Application.updateMany(
        { room: application.room, _id: { $ne: application._id }, status: 'pending' },
        { status: 'rejected' }
      );

      // Create the ongoing tenancy record (spec section 24)
      const Tenancy = require('../models/Tenancy');
      await Tenancy.create({
        owner: application.owner,
        tenant: application.tenant,
        room: application.room,
        moveInDate: application.preferredMoveInDate,
        rent: room.rent,
      });
    } else {

      application.status = 'rejected';
      await application.save();
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getReceivedApplications,
  respondToApplication,
};