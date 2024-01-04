const MODULE_NAME = 'BUSINESS.DELETE';

const logger = require('../utils/logger');

/**
 * save business to database
 *
 * @param {object} business
 * @param {object} prisma
 */
async function save(business, prisma) {
  try {
    const transactions = [];

    const deleteBusiness = prisma.business.delete({
      where: {
        id: business.id,
      },
    });
    transactions.push(deleteBusiness);

    if (business.coordinate_id) {
      const deleteCoordinate = prisma.coordinate.delete({
        where: {
          id: business.coordinate_id,
        },
      });
      transactions.push(deleteCoordinate);
    }

    if (business.location_id) {
      const deleteLocation = prisma.location.delete({
        where: {
          id: business.location_id,
        },
      });
      transactions.push(deleteLocation);
    }

    return await prisma.$transaction(transactions);
  } catch (e) {
    logger.error(`${MODULE_NAME} D1B518FB: Exeption`, {
      eMessage: e.message,
      eCode: e.code,
    });
    throw new Error('Error when deleting business');
  }
}

module.exports = save;
