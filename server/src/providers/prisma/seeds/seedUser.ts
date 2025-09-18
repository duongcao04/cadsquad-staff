import { fakerVI as faker } from '@faker-js/faker'
import { Prisma, PrismaClient, User } from '@prisma/client'
import { removeVietnameseAccent } from '../../../utils/removeVietnameseAccent'

const prisma = new PrismaClient()
const USERS_DATA: Prisma.UserCreateInput[] = [
  {
    email: 'pt.phong@cadsquad.vn',
    username: 'pt.phong',
    displayName: 'Phạm Tiền Phong',
    avatar: 'https://ui-avatars.com/api/?name=Phong+Pham&background=random',
    jobTitle: 'Founder',
    department: 'CEO',
    phoneNumber: '+1-555-0002',
    role: 'ADMIN' as const,
    password: 'cadsquad123',
  },
  {
    email: 'ch.duong@cadsquad.vn',
    username: 'ch.duong',
    displayName: 'Cao Hải Dương',
    avatar: 'https://ui-avatars.com/api/?name=Duong+Cao&background=random',
    jobTitle: 'Software Developer',
    department: 'IT Deparment',
    phoneNumber: '+84-862-248-332',
    role: 'ADMIN' as const,
    password: 'cadsquad123',
  },
  {
    email: 'dc.son@cadsquad.vn',
    username: 'dc.son',
    displayName: 'Đặng Ngọc Sơn',
    avatar: 'https://ui-avatars.com/api/?name=Son+Dang&background=random',
    jobTitle: 'Engineering',
    department: 'Engineering',
    phoneNumber: '+1-555-0003',
    role: 'USER' as const,
    password: 'cadsquad123',
  },
  {
    email: 'lt.dat@cadsquad.vn',
    username: 'lt.dat',
    displayName: 'Lê Thành Đạt',
    avatar: 'https://ui-avatars.com/api/?name=Dat+Le&background=random',
    jobTitle: 'Engineering',
    department: 'Engineering',
    phoneNumber: '+1-555-0004',
    role: 'USER' as const,
    password: 'cadsquad123',
  },
  {
    email: 'nc.hieu@cadsquad.vn',
    username: 'nc.hieu',
    displayName: 'Nguyễn Chí Hiếu',
    avatar: 'https://ui-avatars.com/api/?name=Hieu+Nguyen&background=random',
    jobTitle: 'Engineering',
    department: 'Engineering',
    phoneNumber: '+1-555-0005',
    role: 'USER' as const,
    password: 'cadsquad123',
  },
  {
    email: 'nkh.minh@cadsquad.vn',
    username: 'nkh.minh',
    displayName: 'Nguyễn Khoa Hải Minh',
    avatar: 'https://ui-avatars.com/api/?name=Minh+Nguyen&background=random',
    jobTitle: 'Engineering',
    department: 'Engineering',
    phoneNumber: '+1-555-0006',
    role: 'USER' as const,
    password: 'cadsquad123',
  },
  {
    email: 'nb.vy@cadsquad.vn',
    username: 'nb.vy',
    displayName: 'Nguyễn Bảo Vy',
    avatar: 'https://ui-avatars.com/api/?name=Vy+Nguyen&background=random',
    jobTitle: 'Accounting',
    department: 'Accounting Deparment',
    phoneNumber: '+1-555-0007',
    role: 'ACCOUNTING' as const,
    password: 'cadsquad123',
  },
]

const fakerUser = (): Prisma.UserCreateInput => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    email: faker.internet.email(),
    username:
      removeVietnameseAccent(firstName.toLowerCase()) +
      removeVietnameseAccent(lastName.toLowerCase()) +
      Date.now(),
    displayName: firstName + ' ' + lastName,
    avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
    jobTitle: 'Engineer',
    department: 'Engineer',
    phoneNumber: '+1-555-0007',
    role: 'USER' as const,
    password: 'cadsquad123',
  }
}
async function fakerUsers(prisma: PrismaClient) {
  const fakerRounds = 20
  for (let i = 0; i < fakerRounds; i++) {
    await prisma.user.create({ data: fakerUser() })
  }
}
export const seedUsers = async (prisma: PrismaClient) => {
  const result = await Promise.all(
    USERS_DATA.map(async (userData) => {
      return prisma.user.create({
        data: userData,
      })
    }),
  )
  return result
}
async function main() {
  await fakerUsers(prisma)
  await seedUsers(prisma)
}
main().then(() => {
  console.log('Seed users successfully!')
})
