import { fakerVI as faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { removeVietnameseAccent } from '../../../utils/removeVietnameseAccent'

const prisma = new PrismaClient()

const USERS_DATA = [
  {
    id: 'a9f843e6-dce5-47b4-a6a9-97f7a38b9a0d',
    email: 'pt.phong@cadsquad.vn',
    username: 'pt.phong',
    displayName: 'Phạm Tiền Phong',
    avatar: 'https://ui-avatars.com/api/?name=Phong+Pham&background=random',
    phoneNumber: '+1-555-0002',
    role: 'ADMIN' as const,
    password: 'cadsquad123',
    departmentId: '5aac88f8-e4f7-47e2-a9ef-652c44116c8c'
  },
  {
    id: '2d17d7c3-1b1f-4b3b-9551-f1cdbdb69b70',
    email: 'ch.duong@cadsquad.vn',
    username: 'ch.duong',
    displayName: 'Cao Hải Dương',
    avatar: 'https://ui-avatars.com/api/?name=Duong+Cao&background=random',
    phoneNumber: '+84-862-248-332',
    role: 'ADMIN' as const,
    password: 'cadsquad123',
    departmentId: 'b92a66c3-a0e6-4b4c-a4c6-2759ea97a9c2'
  },
  {
    id: 'bc08c27c-1dd3-4e88-9b3f-8c8a9d71b290',
    email: 'dc.son@cadsquad.vn',
    username: 'dc.son',
    displayName: 'Đặng Ngọc Sơn',
    avatar: 'https://ui-avatars.com/api/?name=Son+Dang&background=random',
    phoneNumber: '+1-555-0003',
    role: 'USER' as const,
    password: 'cadsquad123',
    departmentId: '760a1ffa-2ce5-435c-b778-7a109b74e220'
  },
  {
    id: 'e3f41716-3f91-4e6c-8f4c-2df89a9cf403',
    email: 'lt.dat@cadsquad.vn',
    username: 'lt.dat',
    displayName: 'Lê Thành Đạt',
    avatar: 'https://ui-avatars.com/api/?name=Dat+Le&background=random',
    phoneNumber: '+1-555-0004',
    role: 'USER' as const,
    password: 'cadsquad123',
    departmentId: '760a1ffa-2ce5-435c-b778-7a109b74e220'
  },
  {
    id: 'f77e8bb3-d633-46cb-a269-4e2f17e91173',
    email: 'nc.hieu@cadsquad.vn',
    username: 'nc.hieu',
    displayName: 'Nguyễn Chí Hiếu',
    avatar: 'https://ui-avatars.com/api/?name=Hieu+Nguyen&background=random',
    phoneNumber: '+1-555-0005',
    role: 'USER' as const,
    password: 'cadsquad123',
    departmentId: '760a1ffa-2ce5-435c-b778-7a109b74e220'
  },
  {
    id: 'b9f2ab5c-8442-4f1c-84b8-6471e6a51c65',
    email: 'nkh.minh@cadsquad.vn',
    username: 'nkh.minh',
    displayName: 'Nguyễn Khoa Hải Minh',
    avatar: 'https://ui-avatars.com/api/?name=Minh+Nguyen&background=random',
    phoneNumber: '+1-555-0006',
    role: 'USER' as const,
    password: 'cadsquad123',
    departmentId: '760a1ffa-2ce5-435c-b778-7a109b74e220'
  },
  {
    id: 'c4d35f1b-9b37-4a3f-804b-373f7b0e1a24',
    email: 'nb.vy@cadsquad.vn',
    username: 'nb.vy',
    displayName: 'Nguyễn Bảo Vy',
    avatar: 'https://ui-avatars.com/api/?name=Vy+Nguyen&background=random',
    phoneNumber: '+1-555-0007',
    role: 'ACCOUNTING' as const,
    password: 'cadsquad123',
    departmentId: '09f4216e-e20c-4bf5-aa3e-3c65da7613eb'
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
  // await fakerUsers(prisma)
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
