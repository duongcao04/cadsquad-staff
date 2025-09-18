import * as dotenv from 'dotenv'
import path from 'node:path'
import type { PrismaConfig } from 'prisma'

dotenv.config()
export default {
  schema: path.join('src', 'providers', 'prisma', 'schema.prisma'),
  migrations: {
    path: path.join('src', 'providers', 'prisma', 'migrations'),
  },
  views: {
    path: path.join('src', 'providers', 'prisma', 'views'),
  },
  typedSql: {
    path: path.join('src', 'providers', 'prisma', 'queries'),
  },
} satisfies PrismaConfig
