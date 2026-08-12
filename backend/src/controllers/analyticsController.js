const Room = require('../models/Room');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const VisitRequest = require('../models/VisitRequest');
const Application = require('../models/Application');

// @desc   Owner: get analytics for a specific room
// @route  GET /api/analytics/room/:roomId
const getRoomAnalytics = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view analytics for this room' });
    }

    const saves = await User.countDocuments({ savedRooms: room._id });
    const inquiries = await Inquiry.countDocuments({ room: room._id });
    const visitRequests = await VisitRequest.countDocuments({ room: room._id });
    const applications = await Application.countDocuments({ room: room._id });

    res.json({
      roomId: room._id,
      roomNumber: room.roomNumber,
      views: room.views,
      saves,
      inquiries,
      visitRequests,
      applications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Owner: get analytics across ALL their rooms combined
// @route  GET /api/analytics/overview
const getOwnerAnalyticsOverview = async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user._id });
    const roomIds = rooms.map((r) => r._id);

    const totalViews = rooms.reduce((sum, r) => sum + (r.views || 0), 0);
    const totalSaves = await User.countDocuments({ savedRooms: { $in: roomIds } });
    const totalInquiries = await Inquiry.countDocuments({ room: { $in: roomIds } });
    const totalVisitRequests = await VisitRequest.countDocuments({ room: { $in: roomIds } });
    const totalApplications = await Application.countDocuments({ room: { $in: roomIds } });

    res.json({
      totalRooms: rooms.length,
      totalViews,
      totalSaves,
      totalInquiries,
      totalVisitRequests,
      totalApplications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRoomAnalytics, getOwnerAnalyticsOverview };