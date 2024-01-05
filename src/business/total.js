const MODULE_NAME = 'BUSINESS.TOTAL';

const logger = require('../utils/logger');
const paginateConditions = require('./paginate-conditions');
/**
 * total business in database
 *
 * @param {object} query
 * @param {object} prisma
 */
async function paginate(query, prisma) {
  try {
    const conditions = paginateConditions(query);

    const total = prisma.business.aggregate({
      where: conditions,
      _count: true,
    });

    return total;
  } catch (e) {
    logger.error(`${MODULE_NAME} 33B95868: Exeption`, {
      eMessage: e.message,
      eCode: e.code,
    });
    throw new Error('Error when counting business');
  }
}

module.exports = paginate;
