const { INTERNAL_SERVER_ERROR } = require('../utils/errors');

module.exports = (err, req, res, next) => {
  console.error(err);

  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === INTERNAL_SERVER_ERROR
        ? 'An error occurred on the server'
        : message,
  });
};