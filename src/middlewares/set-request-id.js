const uniqid = require('uniqid');

/**
 * Set request id to res.locals.rid
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (req, res, next) => {
  res.locals.rid = uniqid();
  next();
};
