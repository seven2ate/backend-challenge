const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  try {
    const token = header.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const verifiedUser = await jwt.verify(token, secret);
    if (verifiedUser) {
      req.userId = verifiedUser.userId; // Attach userId to request object
      next();
    } else {
      return res.status(401).json({ error: 'Token cannot be validated' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate;
