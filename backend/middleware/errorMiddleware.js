const { AuthenticationError, ValidationError, NotFoundError, ForbiddenError , InternalServerError  } = require('../utils/errors');

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AuthenticationError) return res.status(401).json({ success: false, message: err.message });
  if (err instanceof ValidationError) return res.status(400).json({ success: false, message: err.message });
  if (err instanceof NotFoundError) return res.status(404).json({ success: false, message: err.message });
  if (err instanceof ForbiddenError) return res.status(403).json({ success: false, message: err.message });
  if (err instanceof InternalServerError) return res.status(500).json({ success: false, message: err.message });

  return res.status(500).json({ success: false, message: 'Internal Server Error' });
};

module.exports = errorMiddleware;