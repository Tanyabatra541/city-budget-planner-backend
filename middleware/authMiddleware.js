const jwt = require('jsonwebtoken');


exports.protect = (req, res, next) => {
  let token;

  

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract token after 'Bearer'
  }

  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token using the secret
    req.user = decoded;  // Attach user to request
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ message: 'Token failed, authorization denied' });
  }
};