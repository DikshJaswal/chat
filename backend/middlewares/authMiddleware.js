const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
  try {
    // Safely get cookie from request headers
    const cookie = req.headers.cookie;
    
    if (!cookie) {
      return res.status(401).json({
        success: false,
        message: 'No token, Authorization denied'
      });
    }

    // Extract token from cookie
    const tokenCookie = cookie
      .split(';')
      .find(c => c.trim().startsWith('token='));
    
    if (!tokenCookie) {
      return res.status(401).json({
        success: false,
        message: 'No token found in cookie'
      });
    }

    const token = tokenCookie.split('=')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // Verify token with your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_KEY || 'xY7!kL9@qW3nR$sE5vG2#mP8&wZ6^tB1uN4oQcV7jX2%aF9');
    
    // Add user info to request object
    req.user = decoded;
    next();
    
  } catch (err) {
    console.error('JWT Verification Error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

module.exports = authToken;