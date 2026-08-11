const VisitRequest = require('../models/VisitRequest');
const Room = require('../models/Room');

// @desc   Tenant: request a room visit
// @route  POST /api/visits
const createVisitRequest = async (req, res) => {
  try {
    const { room, visitDate, visitTime } = req.body;

    if (!room || !visitDate || !visitTime) {
      return res.status(400).json({ message: 'room, visitDate, and visitTime are required' });
    }

    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const visit = await VisitRequest.create({
      tenant: req.user._id,
      owner: roomDoc.owner,
      room,
      visitDate,
      visitTime,
    });

    res.status(201).json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Tenant: view their own visit requests
// @route  GET /api/visits/mine
const getMyVisitRequests = async (req, res) => {
  try {
    const visits = await VisitRequest.find({ tenant: req.user._id })
      .populate('room', 'roomNumber roomType rent')
      .populate('owner', 'fullName phone')
      .sort({ createdAt: -1 });

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Owner: view visit requests received for their rooms
// @route  GET /api/visits/received
const getReceivedVisitRequests = async (req, res) => {
  try {
    const visits = await VisitRequest.find({ owner: req.user._id })
      .populate('room', 'roomNumber roomType rent')
      .populate('tenant', 'fullName phone email')
      .sort({ createdAt: -1 });

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Owner: accept, reject, or reschedule a visit request
// @route  PATCH /api/visits/:id/respond
const respondToVisitRequest = async (req, res) => {
  try {
    const { action, rescheduledDate, rescheduledTime, ownerNote } = req.body;
    // action: "accept" | "reject" | "reschedule"

    if (!['accept', 'reject', 'reschedule'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const visit = await VisitRequest.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: 'Visit request not found' });
    }
    if (visit.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this visit request' });
    }

    if (action === 'accept') {
      visit.status = 'accepted';
    } else if (action === 'reject') {
      visit.status = 'rejected';
    } else if (action === 'reschedule') {
      if (!rescheduledDate || !rescheduledTime) {
        return res.status(400).json({ message: 'rescheduledDate and rescheduledTime are required' });
      }
      visit.status = 'rescheduled';
      visit.rescheduledDate = rescheduledDate;
      visit.rescheduledTime = rescheduledTime;
    }

    if (ownerNote) visit.ownerNote = ownerNote;

    await visit.save();
    res.json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVisitRequest,
  getMyVisitRequests,
  getReceivedVisitRequests,
  respondToVisitRequest,
};