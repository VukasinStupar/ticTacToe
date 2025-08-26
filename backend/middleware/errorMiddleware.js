
function errorMiddleware(err, req, res, next) {
  console.error(err); 

  if (err instanceof AuthenticationError) {
    return res.status(401).json({ error: err.message || "Authentication failed" });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message || "Validation error" });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message || "Resource not found" });
  }

  return res.status(500).json({ error: "Internal server error" });
}

module.exports = errorMiddleware;
