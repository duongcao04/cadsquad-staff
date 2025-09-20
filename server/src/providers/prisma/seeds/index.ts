import { PrismaClient } from '@prisma/client'
import { seedJobStatus } from './seedJobStatus'
import { seedPaymentChannel } from './seedPaymentChannel'
import { seedJobType } from './seedJobType'
import { seedUsers } from './seedUser'
import { seedJob } from './seedJob'

const prisma = new PrismaClient()

async function main() {
  await seedUsers(prisma)
  await seedJobType(prisma)
  await seedJobStatus(prisma)
  await seedPaymentChannel(prisma)
  await seedJob(prisma)
}

main()
  .then(() => {
    console.log("Seed successfully!");
  })
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
