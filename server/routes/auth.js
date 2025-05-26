import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
// import { sendResetPasswordEmail } from '../config/email.js'; // Disabled for production
import { t } from '../config/i18n.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message:  t('auth.errors.user_exists') });
    }

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      password
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: t('errors.server_error') });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    console.log('Received forgot password request for email:', req.body.email);
    
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found, generating reset token');

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();
    console.log('Reset token saved to user');

    // Generate reset link
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    console.log('Generated reset link:', resetLink);
    
    try {
      // console.log('Attempting to send reset email');
      // await sendResetPasswordEmail(email, resetLink);
      // console.log('Reset email sent successfully');
      
      res.json({ 
        message: 'Password reset instructions sent to email',
        resetLink // Only include this in development
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      res.status(500).json({ message: 'Failed to send reset email' });
    }
  } catch (error) {
    console.error('Error in forgot-password route:', error);
    res.status(500).json({ message: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;