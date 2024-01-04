const { PrismaClient } = require('@prisma/client');

const categories = require('./categories.json');

const prisma = new PrismaClient();

async function main() {
  // eslint-disable-next-line no-restricted-syntax
  for (const category of categories) {
    // eslint-disable-next-line no-await-in-loop
    const result = await prisma.category.upsert({
      where: { title: category.title },
      update: {},
      create: category,
    });
    console.log(result);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
