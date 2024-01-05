const formatDisplayAddress = require('../utils/format-display-address');

module.exports = (location) => {
  const loc = {
    address1: location.address1,
    address2: location.address2 || null,
    address3: location.address3 || null,
    city: location.city,
    zip_code: location.zip_code,
    state: location.state,
    country: location.country,
  };
  loc.display_address = formatDisplayAddress(location);
  return loc;
};
