const { ConflictError } = require('./ConflictError');
const { ForbiddenError } = require('./ForbiddenError');
const { NotFoundError } = require('./NotFoundError');
const { AuthError } = require('./AuthError');
const { BadRequestError } = require('./BadRequestError');

module.exports = {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  AuthError,
  BadRequestError,
};
