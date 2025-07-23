function notFount(req, res, next) {
  res.status(404);
  res.json({
    message: "Not Found",
  });
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.json({
    message: err.message,
    responseData: err.data,
  });
}

module.exports = { notFount, errorHandler };
