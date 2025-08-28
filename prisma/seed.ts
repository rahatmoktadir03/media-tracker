import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a default user if none exists
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    await prisma.user.create({
      data: {
        email: "user@example.com",
        name: "Default User",
      },
    });
    console.log("Created default user");
  } else {
    console.log("Users already exist");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
