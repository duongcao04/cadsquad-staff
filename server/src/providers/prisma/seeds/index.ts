import { PrismaClient } from '@prisma/client'
import { fakerVI as faker } from '@faker-js/faker'
import { seedJobStatus } from './seedJobStatus'
import { seedPaymentChannel } from './seedPaymentChannel'
import { seedJobType } from './seedJobType'
import { seedUsers } from './seedUser'
import { seedJob } from './seedJob'

const prisma = new PrismaClient()

const fakerUser = (): any => ({
  name: faker.person.firstName() + faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
})

async function main() {
  await seedJobStatus(prisma)
  await seedPaymentChannel(prisma)
  await seedJobType(prisma)
  await seedUsers(prisma)
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
