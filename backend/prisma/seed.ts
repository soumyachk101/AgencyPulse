import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
 const agency = await prisma.agency.upsert({
 where: { slug: "demo-agency" },
 update: {},
 create: {
 name: "Demo Agency",
 slug: "demo-agency",
 ownerId: "",
 },
 });

 const hashedPassword = await bcrypt.hash("demo-password-123", 10);

 const owner = await prisma.user.upsert({
 where: { email: "demo@agencypulse.io" },
 update: {},
 create: {
 email: "demo@agencypulse.io",
 password: hashedPassword,
 name: "Demo Owner",
 agencyId: agency.id,
 role: "OWNER",
 },
 });

 await prisma.agency.update({
 where: { id: agency.id },
 data: { ownerId: owner.id },
 });

 console.log("Seed complete:", { agency: agency.id, owner: owner.id });
}

main()
 .catch((err) => {
 console.error(err);
 process.exit(1);
 })
 .finally(async () => {
 await prisma.$disconnect();
 });
