const { PrismaClient } = require('@prisma/client');

const categories = require('./categories.json');
const transactions = require('./transactions.json');

const prisma = new PrismaClient();

async function main() {
  const categoryPromises = categories.map(async (category) => prisma.category.upsert({
    where: { title: category.title },
    update: {},
    create: category,
  }));
  const categoryResults = await Promise.all(categoryPromises);
  console.log(categoryResults);

  const transactionsPromises = transactions.map(async (transaction) => prisma.transaction.upsert({
    where: { name: transaction },
    update: {},
    create: { name: transaction },
  }));
  const transactionResults = await Promise.all(transactionsPromises);
  console.log(transactionResults);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
