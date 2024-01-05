module.exports = (categories) => categories.map((val) => ({
  where: {
    title: val.title,
  },
  create: {
    title: val.title,
    alias: val.title.trim().replace(' ', '_').toLowerCase(),
  },
}));
