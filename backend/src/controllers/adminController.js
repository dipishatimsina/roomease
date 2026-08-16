const User = require('../models/User');

// @desc   Admin: verify an owner
// @route  PATCH /api/admin/verify-owner/:id
const verifyOwner = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role !== 'owner') {
      return res.status(400).json({ message: 'This user is not an owner' });
    }

    user.isVerifiedOwner = true;
    await user.save();

    res.json({ message: 'Owner verified', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Admin: get platform-wide stats (dashboard numbers)
// @route  GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const Property = require('../models/Property');
    const Room = require('../models/Room');

    const totalUsers = await User.countDocuments();
    const totalTenants = await User.countDocuments({ role: 'tenant' });
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalProperties = await Property.countDocuments();
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ availabilityStatus: 'available' });
    const occupiedRooms = await Room.countDocuments({ availabilityStatus: 'occupied' });
    const pendingProperties = await Property.countDocuments({ status: 'pending' });

    res.json({
      totalUsers,
      totalTenants,
      totalOwners,
      totalProperties,
      totalRooms,
      availableRooms,
      occupiedRooms,
      pendingProperties,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Admin: get all owners (for verification list)
// @route  GET /api/admin/owners
const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' }).select('-password').sort({ createdAt: -1 });
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { verifyOwner, getStats, getAllOwners };