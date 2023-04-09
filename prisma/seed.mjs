import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  console.debug("RUNNING");
  // const newUser = await prisma.user.create({
  //   data: {id: },
  // });
  const assets = [];
  for (let i = 0; i < 15; i++) {
    const newAsset = await prisma.asset.create({
      data: {
        name: `Asset #${i}`,
        user: { connect: { id: "user_2OAndFW8CGOilnO9Gf6zVydGM64" } },
        values: {
          create: {
            value: i + 100,
            user: { connect: { id: "user_2OAndFW8CGOilnO9Gf6zVydGM64" } },
          },
        },
      },
    });
    assets.push(newAsset);
  }
  const values = await Promise.all(
    assets.map(async (asset) => {
      const values = [];
      for (let i = 0; i < 1000; i++) {
        const newValue = await prisma.value.create({
          data: {
            value: i + 100,
            user: { connect: { id: "user_2OAndFW8CGOilnO9Gf6zVydGM64" } },
            asset: { connect: { id: asset.id } },
          },
        });
        values.push(newValue);
      }
      return values;
    })
  );
  console.debug(values);
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
