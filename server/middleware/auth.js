import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware started');
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    console.log('Token received:', token);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, user:', verified);
    
    // Get full user data from database
    const user = await User.findById(verified.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user data to request
    req.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

export default auth;