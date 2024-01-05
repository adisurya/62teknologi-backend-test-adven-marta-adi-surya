const MODULE_NAME = 'BUSINESS.UPSERT';

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
    const dbTrxs = [];

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

    if (data.id) {
      const deleteCategory = prisma.$executeRaw`DELETE FROM _BusinessToCategory WHERE A = ${data.id}`;
      const deleteTransaction = prisma.$executeRaw`DELETE FROM _BusinessToTransaction WHERE A = ${data.id}`;

      dbTrxs.push(deleteCategory, deleteTransaction);
    }

    const updateBusiness = prisma.business.upsert({
      where: {
        id: data.id,
      },
      create: {
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
      update: {
        name: data.name,
        alias: data.alias || null, // todo
        is_closed: data.is_closed || false,
        phone: data.phone,
        display_phone: data.display_phone || null, // todo
        price: data.price,
        categories: {
          connectOrCreate: categories,
        },
        transactions: {
          connectOrCreate: transactions,
        },
        coordinates: {
          update: {
            latitude: data.coordinates.latitude,
            longitude: data.coordinates.longitude,
          },
        },
        location: {
          update: location,
        },
      },
    });
    dbTrxs.push(updateBusiness);

    const results = await prisma.$transaction(dbTrxs);

    return results[2]; // return business objects
  } catch (e) {
    logger.error(`${MODULE_NAME} 9B92C424: Exeption`, {
      eMessage: e.message,
      eCode: e.code,
    });
    throw new Error('Error when updating business');
  }
}

module.exports = save;
