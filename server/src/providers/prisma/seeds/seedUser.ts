import { fakerVI as faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { removeVietnameseAccent } from '../../../utils/removeVietnameseAccent'

const prisma = new PrismaClient()

const USERS_DATA = [
  {
    email: 'pt.phong@cadsquad.vn',
    username: 'pt.phong',
    displayName: 'Phạm Tiền Phong',
    avatar: 'https://ui-avatars.com/api/?name=Phong+Pham&background=random',
    phoneNumber: '+1-555-0002',
    role: 'ADMIN' as const,
    password: 'cadsquad123',
  },
  {
    email: 'ch.duong@cadsquad.vn',
    username: 'ch.duong',
    displayName: 'Cao Hải Dương',
    avatar: 'https://ui-avatars.com/api/?name=Duong+Cao&background=random',
    phoneNumber: '+84-862-248-332',
    role: 'ADMIN' as const,
    password: 'cadsquad123',
  },
  {
    email: 'dc.son@cadsquad.vn',
    username: 'dc.son',
    displayName: 'Đặng Ngọc Sơn',
    avatar: 'https://ui-avatars.com/api/?name=Son+Dang&background=random',
    phoneNumber: '+1-555-0003',
    role: 'USER' as const,
    password: 'cadsquad123',
  },
  {
    email: 'lt.dat@cadsquad.vn',
    username: 'lt.dat',
    displayName: 'Lê Thành Đạt',
    avatar: 'https://ui-avatars.com/api/?name=Dat+Le&background=random',
    phoneNumber: '+1-555-0004',
    role: 'USER' as const,
    password: 'cadsquad123',
  },
  {
    email: 'nc.hieu@cadsquad.vn',
    username: 'nc.hieu',
    displayName: 'Nguyễn Chí Hiếu',
    avatar: 'https://ui-avatars.com/api/?name=Hieu+Nguyen&background=random',
    phoneNumber: '+1-555-0005',
    role: 'USER' as const,
    password: 'cadsquad123',
  },
  {
    email: 'nkh.minh@cadsquad.vn',
    username: 'nkh.minh',
    displayName: 'Nguyễn Khoa Hải Minh',
    avatar: 'https://ui-avatars.com/api/?name=Minh+Nguyen&background=random',
    phoneNumber: '+1-555-0006',
    role: 'USER' as const,
    password: 'cadsquad123',
  },
  {
    email: 'nb.vy@cadsquad.vn',
    username: 'nb.vy',
    displayName: 'Nguyễn Bảo Vy',
    avatar: 'https://ui-avatars.com/api/?name=Vy+Nguyen&background=random',
    phoneNumber: '+1-555-0007',
    role: 'ACCOUNTING' as const,
    password: 'cadsquad123',
  },
]

const fakerUser = () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    email: faker.internet.email(),
    username:
      removeVietnameseAccent(firstName.toLowerCase()) +
      removeVietnameseAccent(lastName.toLowerCase()) +
      Date.now(),
    displayName: `${firstName} ${lastName}`,
    avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
    phoneNumber: faker.phone.number(),
    role: 'USER' as const,
    password: 'cadsquad123',
  }
}

async function fakerUsers(prisma: PrismaClient) {
  const fakerRounds = 20
  for (let i = 0; i < fakerRounds; i++) {
    const { ...userData } = fakerUser()
    await prisma.user.create({
      data: {
        ...userData,
      },
    })
  }
}

export const seedUsers = async (prisma: PrismaClient) => {
  return Promise.all(
    USERS_DATA.map(async (userData) => {
      return prisma.user.create({
        data: userData,
      })
    }),
  )
}

async function main() {
  await fakerUsers(prisma)
  await seedUsers(prisma)
}

main()
  .then(() => {
    console.log('Seed users successfully!')
  })
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
