import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { getIsMongoConnected } from '../config/db.js';
import { storeService } from '../services/storeService.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  try {
    const decoded = verifyToken(token);

    if (getIsMongoConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
      }
      req.user = user;
    } else {
      const user = storeService.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
      }
      req.user = user;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired token.',
      error: err.message,
    });
  }
};

