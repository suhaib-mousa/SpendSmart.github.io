import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
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
    req.user = verified;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

export default auth;