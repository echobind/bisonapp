import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // TODO: seeds
  console.log('no seeds yet!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
