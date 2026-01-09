const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle specific error types
  if (err.message.includes('required') || err.message.includes('Invalid')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  if (err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      error: err.message
    });
  }

  if (err.message.includes('already')) {
    return res.status(409).json({
      success: false,
      error: err.message
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;

