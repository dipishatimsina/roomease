const Report = require('../models/Report');
const Room = require('../models/Room');
const Property = require('../models/Property');

// @desc   Tenant: report a listing
// @route  POST /api/reports
const createReport = async (req, res) => {
  try {
    const { room, reason, details } = req.body;

    if (!room || !reason) {
      return res.status(400).json({ message: 'room and reason are required' });
    }

    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const report = await Report.create({
      reportedBy: req.user._id,
      room,
      reason,
      details,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Admin: view all reports
// @route  GET /api/reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('room', 'roomNumber roomType')
      .populate('reportedBy', 'fullName')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Admin: take action on a report
// @route  PATCH /api/reports/:id/action
const actionReport = async (req, res) => {
  try {
    const { status, adminAction, suspendRoom, suspendProperty } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (status) report.status = status;
    if (adminAction) report.adminAction = adminAction;
    await report.save();

    // Optional: admin can directly suspend the room/property from here
    if (suspendRoom) {
      const room = await Room.findById(report.room);
      if (room) {
        room.isVerified = false;
        await room.save();
      }
    }

    if (suspendProperty) {
      const room = await Room.findById(report.room);
      if (room) {
        const property = await Property.findById(room.property);
        if (property) {
          property.status = 'suspended';
          property.isVerified = false;
          await property.save();
        }
      }
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReport, getAllReports, actionReport };