const MODULE_NAME = 'BUSINESS.PAGINATE';

const logger = require('../utils/logger');
const paginateConditions = require('./paginate-conditions');
/**
 * save business to database
 *
 * @param {object} query
 * @param {object} prisma
 */
async function paginate(query, prisma) {
  try {
    const conditions = paginateConditions(query);
    console.log(conditions);
    const businesses = prisma.business.findMany({
      skip: query.offset || 0,
      take: query.limit || 20,
      where: conditions,
      include: {
        categories: {
          select: {
            alias: true,
            title: true,
          },
        },
        coordinates: {
          select: {
            latitude: true,
            longitude: true,
          },
        },
        location: {
          select: {
            address1: true,
            address2: true,
            address3: true,
            city: true,
            zip_code: true,
            country: true,
            state: true,
            display_address: true,
          },
        },
        transactions: {
          select: {
            name: true,
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
