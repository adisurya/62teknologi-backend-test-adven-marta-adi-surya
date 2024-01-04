const MODULE_NAME = 'BUSINESS.PAGINATE';

const logger = require('../utils/logger');

/**
 * save business to database
 *
 * @param {object} query
 * @param {object} prisma
 */
async function paginate(query, prisma) {
  try {
    const businesses = prisma.business.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        coordinates: {
          select: {
            latitude: true,
            longitude: true,
          },
        },
      },
    });
    return businesses;
  } catch (e) {
    logger.error(`${MODULE_NAME} F675FDB5: Exeption`, {
      eMessage: e.message,
      eCode: e.code,
    });
    throw new Error('Error when paginating business');
  }
}

module.exports = paginate;
