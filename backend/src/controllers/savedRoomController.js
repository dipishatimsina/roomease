const User = require('../models/User');

// @desc   Tenant: save a room
// @route  POST /api/saved-rooms/:roomId
const saveRoom = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.savedRooms.includes(req.params.roomId)) {
      return res.status(400).json({ message: 'Room already saved' });
    }

    user.savedRooms.push(req.params.roomId);
    await user.save();

    res.json({ message: 'Room saved', savedRooms: user.savedRooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Tenant: unsave a room
// @route  DELETE /api/saved-rooms/:roomId
const unsaveRoom = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.savedRooms = user.savedRooms.filter(
      (id) => id.toString() !== req.params.roomId
    );
    await user.save();

    res.json({ message: 'Room removed from saved', savedRooms: user.savedRooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Tenant: view their saved rooms (full room details)
// @route  GET /api/saved-rooms
const getSavedRooms = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedRooms',
      populate: { path: 'property', select: 'name location' },
    });

    res.json(user.savedRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveRoom, unsaveRoom, getSavedRooms };