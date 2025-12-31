// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Property = require('../models/Property');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      savedProperties
    ] = await Promise.all([
      Application.countDocuments({ user: userId }),
      Application.countDocuments({ user: userId, status: 'pending' }),
      Application.countDocuments({ user: userId, status: 'approved' }),
      Application.countDocuments({ user: userId, status: 'rejected' }),
      Property.countDocuments({ savedBy: userId })
    ]);

    res.json({
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      savedProperties
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recent applications
router.get('/applications/recent', auth, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate('property', 'title address price images')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('status createdAt referenceNumber');
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, address, dateOfBirth } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        firstName, 
        lastName, 
        phone, 
        address, 
        dateOfBirth,
        profileComplete: true 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile picture
router.put('/profile/picture', auth, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.put('/profile/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
