import { PrismaClient } from '@prisma/client'
import { seedJobStatus } from './seedJobStatus'
import { seedPaymentChannel } from './seedPaymentChannel'
import { seedJobType } from './seedJobType'
import { seedJobTitle } from './seedJobTitle'
import { seedDepartment } from './seedDepartment'

const prisma = new PrismaClient()

async function main() {
  seedJobTitle(prisma)
  seedJobType(prisma)
  seedPaymentChannel(prisma)
  seedJobStatus(prisma)
  seedDepartment(prisma)
}

main()
  .then(() => {
    console.log("Seed successfully!");
  })
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
