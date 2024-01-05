const MODULE_NAME = 'BUSINESS.FIND-BY-NAME';

const logger = require('../utils/logger');

/**
 * find business by email
 *
 * @param {object} query
 * @param {object} prisma
 */
async function findByEmail(name, id, prisma) {
  try {
    const conditions = {
      name,
    };

    if (id) {
      conditions.id = {
        not: id,
      };
    }

    const business = await prisma.business.findFirst({
      where: conditions,
    });
    return business;
  } catch (e) {
    logger.error(`${MODULE_NAME} 6B1F7E8A: Exeption`, {
      eMessage: e.message,
      eCode: e.code,
    });
    throw new Error('Error when find business by name');
  }
}

module.exports = findByEmail;
