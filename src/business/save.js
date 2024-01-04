const MODULE_NAME = 'BUSINESS.SAVE';

const logger = require('../utils/logger');
const formatDisplayAddress = require('../utils/format-display-address');

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
        where: {
          title: val.title,
        },
        create: {
          title: val.title,
          alias: val.title.trim().replace(' ', '_').toLowerCase(),
        },
      }));
    }

    let transactions = [];
    if (Array.isArray(data.transactions)) {
      transactions = data.transactions.map((val) => ({
        where: {
          name: val.name,
        },
        create: {
          name: val.name,
        },
      }));
    }

    const location = {
      address1: data.location.address1,
      address2: data.location.address2 || null,
      address3: data.location.address3 || null,
      city: data.location.city,
      zip_code: data.location.zip_code,
      state: data.location.state,
      country: data.location.country,
    };
    location.display_address = formatDisplayAddress(location);
    console.log(JSON.stringify(location, null, 4));

    const params = {
      data: {
        name: data.name,
        alias: data.alias || null, // todo
        is_closed: data.is_closed || false,
        phone: data.phone,
        display_phone: data.display_phone || null, // todo
        price: data.price,
        categories: {
          connectOrCreate: categories,
        },
        coordinates: {
          create: {
            latitude: data.coordinates.latitude,
            longitude: data.coordinates.longitude,
          },
        },
        location: {
          create: location,
        },
        transactions: {
          connectOrCreate: transactions,
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
