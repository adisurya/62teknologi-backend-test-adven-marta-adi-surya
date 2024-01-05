module.exports = (transactions) => transactions.map((val) => ({
  where: {
    name: val.name,
  },
  create: {
    name: val.name,
  },
}));
