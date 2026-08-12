const Notification = require('../models/Notification');

const createNotification = async (userId, type, message, relatedRoom = null) => {
  try {
    await Notification.create({ user: userId, type, message, relatedRoom });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = createNotification;