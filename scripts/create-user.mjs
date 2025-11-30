import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Change these values
const EMAIL = "newuser@example.com";
const PASSWORD = "password123";
const NAME = "New User";
const ROLE = "user"; // "user", "admin", or "agent"

async function main() {
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  const user = await prisma.user.create({
    data: {
      email: EMAIL,
      name: NAME,
      password: hashedPassword,
      role: ROLE,
    },
  });

  console.log("Created user:", user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
