function notFound(req, res, next) {
  res.status(404).json({ message: "Route not found." });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err.message);

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid identifier." });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `That ${field} is already in use.` });
  }

  const status = err.statusCode || err.status || 500;
  if (status >= 400 && status < 500) {
    return res.status(status).json({ message: err.message || "Request failed." });
  }
  console.error(err.stack);
  return res.status(500).json({ message: "Internal server error." });
}

export { notFound, errorHandler };
