const MODULE_NAME = 'UTILS.FORMAT-DISPLAY-ADDRESS';

// const { JsonArray } = require('prisma').JsonArray;
const logger = require('./logger');

module.exports = (location) => {
  try {
    const json = [];
    if (location && location.address1) {
      json.push(location.address1);
    }

    if (location && location.address2) {
      json.push(location.address2);
    }

    if (location && location.address3) {
      json.push(location.address3);
    }
    json.push(`${location.city.trim()}, ${location.state.trim()} ${location.zip_code.trim()}`);

    return json;
  } catch (e) {
    logger.error(`${MODULE_NAME} : Exception`, {
      eMessage: e.message,
      eCode: e.code,
    });

    throw e;
  }
};
