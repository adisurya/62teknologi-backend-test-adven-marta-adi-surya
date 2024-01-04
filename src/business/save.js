const MODULE_NAME = 'BUSINESS.SAVE';

const logger = require('../utils/logger');

/**
 * save business to database
 *
 * @param {object} data
 * @param {object} prisma
 */
async function save(data, prisma) {
  try {
    let categories = [];
    if (Array.isArray(data.categories)) {
      categories = data.categories.map((val) => ({
        created_at: new Date(),
        category: {
          connectOrCreate: {
            where: {
              title: val.title,
            },
            create: {
              title: val.title,
              alias: val.title.trim().replace(' ', '_').toLowerCase(),
            },
          },
        },
      }));
    }
    const params = {
      data: {
        name: data.name,
        alias: data.alias || null, // todo
        is_closed: data.is_closed || false,
        phone: data.phone,
        display_phone: data.display_phone || null, // todo
        price: data.price,
        categories: {
          create: categories,
        },
        coordinates: {
          create: {
            latitude: data.coordinates.latitude,
            longitude: data.coordinates.longitude,
          },
        },
      },
    };

    return prisma.business.create(params);
  } catch (e) {
    logger.error(`${MODULE_NAME} 08D08DBC: Exeption`, {
      eMessage: e.message,
      eCode: e.code,
    });
    throw new Error('Error when adding business');
  }
}

module.exports = save;
