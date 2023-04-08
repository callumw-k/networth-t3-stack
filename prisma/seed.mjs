import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  console.debug("RUNNING");
  const newUser = await prisma.user.create({
    data: { name: "Callum" },
  });
  const assets = [];
  for (let i = 0; i < 15; i++) {
    const newAsset = await prisma.asset.create({
      data: {
        name: `Asset #${i}`,
        user: { connect: { id: newUser.id } },
        values: {
          create: {
            value: i + 1000,
            user: { connect: { id: newUser.id } },
          },
        },
      },
    });
    console.debug(typeof newAsset.createdAt);
    assets.push(newAsset);
  }
  const values = await Promise.all(
    assets.map(async (asset) => {
      for (let i = 0; i < 1000; i++) {
        const newValue = await prisma.value.create({
          data: {
            value: i + 100,
            user: { connect: { id: newUser.id } },
            asset: { connect: { id: asset.id } },
          },
        });
      }
    })
  );
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
