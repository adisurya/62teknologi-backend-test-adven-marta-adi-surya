const MODULE_NAME = 'BUSINESS.UPSERT';

const haversine = require('haversine-distance');

const logger = require('../utils/logger');
const buildParamsCategories = require('./build-params-categories');
const buildParamsTransactions = require('./build-params-transactions');
const buildParamsLocation = require('./build-params-location');

/**
 * upsert business to database
 *
 * @param {object} data
 * @param {object} prisma
 * @param {object} center
 * @param {string} center.latitude
 * @param {string} center.longitude
 */
async function upsert(data, prisma, center) {
  try {
    const dbTrxs = [];
    const { coordinates } = data;

    let categories = [];
    if (Array.isArray(data.categories)) {
      categories = buildParamsCategories(data.categories);
    }

    let transactions = [];
    if (Array.isArray(data.transactions)) {
      transactions = buildParamsTransactions(data.transactions);
    }

    const location = buildParamsLocation(data.location);

    let distance = null;
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      distance = haversine(center, coordinates);
    }

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
        image_url: data.image_url || null,
        url: data.url || null,
        distance,
        categories: {
          connectOrCreate: categories,
        },
        coordinates: {
          create: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
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
        image_url: data.image_url || null,
        url: data.url || null,
        distance,
        categories: {
          connectOrCreate: categories,
        },
        transactions: {
          connectOrCreate: transactions,
        },
        coordinates: {
          update: {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
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

module.exports = upsert;
