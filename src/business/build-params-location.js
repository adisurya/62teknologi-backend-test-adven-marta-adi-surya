const { process } = require('uniqid');
const haversine = require('haversine-distance');

const formatDisplayAddress = require('../utils/format-display-address');

module.exports = (location, coordinates, center) => {
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

  if (coordinates && coordinates.latitude && coordinates.longitude) {
    loc.distance = haversine(center, coordinates);
  }

  return loc;
};
