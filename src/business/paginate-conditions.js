function parsePrice(params) {
  const prices = params.split(',');
  const formatteds = [];
  for (let i = 0; i < prices.length; i += 1) {
    const intPrice = parseInt(prices[i], 10);

    if (intPrice > 0 && intPrice < 5) {
      formatteds.push('$'.repeat(intPrice));
    }
  }
  return formatteds;
}

module.exports = (query) => {
  const conditions = {};

  if (query.price) {
    conditions.price = { in: parsePrice(query.price) };
  }

  if (typeof query.open_now !== 'undefined') {
    conditions.is_closed = !query.open_now;
  }

  if (query.location) {
    conditions.location = {
      OR: [
        { state: query.location },
        { city: query.location },
        { zip_code: query.location },
        { address1: { contains: query.location } },
      ],
    };
  }

  if (query.categories) {
    conditions.categories = {
      some: { alias: { in: query.categories.split(',') } },
    };
  }

  return conditions;
};
