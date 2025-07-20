import { PrismaClientType, ensureConnection } from '@/lib/prisma'

export class JobStatusService {
    private prisma!: PrismaClientType
    constructor() {
        this.init()
    }

    private async init() {
        this.prisma = await ensureConnection()
    }

    async getAll() {
        try {
            const records = await this.prisma.jobStatus.findMany({
                orderBy: {
                    order: 'asc',
                },
                include: {
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
