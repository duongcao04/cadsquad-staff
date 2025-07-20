import { PrismaClientType, ensureConnection } from '@/lib/prisma'

export class JobTypeService {
    private prisma!: PrismaClientType
    constructor() {
        this.init()
    }

    private async init() {
        this.prisma = await ensureConnection()
    }

    async getAll() {
        try {
            const records = await this.prisma.jobType.findMany({
                orderBy: {
                    name: 'asc',
                },
                include: {
                    projects: {},
                    _count: {
                        select: {
                            projects: true,
                        },
                    },
                },
            })
            return { records }
        } catch (error) {
            console.error('Error fetching projects:', error)
            return { error: 'Internal server error', status: 500 }
        }
    }
}
