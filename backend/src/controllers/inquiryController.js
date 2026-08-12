const Inquiry = require('../models/Inquiry');
const Room = require('../models/Room');
const createNotification = require('../utils/createNotification');

// @desc   Tenant: send an inquiry about a room
// @route  POST /api/inquiries
const createInquiry = async (req, res) => {
  try {
    const { room, message, preferredViewingDate } = req.body;

    if (!room || !message) {
      return res.status(400).json({ message: 'room and message are required' });
    }

    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const inquiry = await Inquiry.create({
      tenant: req.user._id,
      owner: roomDoc.owner,
      room,
      message,
      preferredViewingDate,
    });

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Tenant: view their own sent inquiries
// @route  GET /api/inquiries/mine
const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ tenant: req.user._id })
      .populate('room', 'roomNumber roomType rent')
      .populate('owner', 'fullName')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Owner: view inquiries received about their rooms
// @route  GET /api/inquiries/received
const getReceivedInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ owner: req.user._id })
      .populate('room', 'roomNumber roomType rent')
      .populate('tenant', 'fullName phone email')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Owner: reply to an inquiry
// @route  PATCH /api/inquiries/:id/reply
const replyToInquiry = async (req, res) => {
  try {
    const { ownerReply } = req.body;

    if (!ownerReply) {
      return res.status(400).json({ message: 'ownerReply is required' });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    if (inquiry.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reply to this inquiry' });
    }

    inquiry.ownerReply = ownerReply;
    inquiry.status = 'replied';
    await inquiry.save();

    await createNotification(
      inquiry.tenant,
      'inquiry_replied',
      `The owner replied to your inquiry.`,
      inquiry.room
    );

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInquiry,
  getMyInquiries,
  getReceivedInquiries,
  replyToInquiry,
};