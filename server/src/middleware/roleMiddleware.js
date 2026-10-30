/**
 * Restricts access to specific role(s)
 * e.g. authorize('student'), authorize('company'), authorize('admin')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource. Allowed roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

