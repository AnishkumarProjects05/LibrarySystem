const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (req.user.id && !req.user._id) {
      req.user._id = req.user.id;
    }
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid' });
  }
};

module.exports = authMiddleware;
