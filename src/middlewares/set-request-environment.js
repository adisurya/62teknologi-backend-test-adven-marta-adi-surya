/**
 * Set environment variable to req.environments
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = (req, res, next) => {
  req.environments = process.env;
  next();
};
