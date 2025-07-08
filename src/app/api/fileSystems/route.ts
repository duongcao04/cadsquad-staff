import { NextRequest, NextResponse } from 'next/server'

import prisma from '@/lib/prisma'

// GET /api/fileSystems - Get all file systems
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const search = searchParams.get('search')
        const type = searchParams.get('type')
        const createdBy = searchParams.get('createdBy')

        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (type) {
            where.type = type
        }

        if (createdBy) {
            where.createdById = createdBy
        }

        const [fileSystems, total] = await Promise.all([
            prisma.fileSystem.findMany({
                where,
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    visibleToUsers: {
                        select: {
                            id: true,
                            username: true,
                            name: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.fileSystem.count({ where }),
        ])

        return NextResponse.json({
            success: true,
            data: fileSystems,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching file systems:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch file systems' },
            { status: 500 }
        )
    }
}

// POST /api/fileSystems - Create a new file system
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            name,
            slug,
            type,
            size,
            color,
            items,
            path,
            createdById,
            visibleToUserIds,
        } = body

        // Validate required fields
        if (!name || !slug || !type || !createdById) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if slug already exists
        const existingFileSystem = await prisma.fileSystem.findFirst({
            where: { slug },
        })

        if (existingFileSystem) {
            return NextResponse.json(
                { success: false, error: 'Slug already exists' },
                { status: 409 }
            )
        }

        // Create file system
        const fileSystem = await prisma.fileSystem.create({
            data: {
                name,
                slug,
                type,
                size,
                items,
                color,
                path: path || [],
                createdById,
                visibleToUsers: visibleToUserIds
                    ? {
                          connect: visibleToUserIds.map((id: string) => ({
                              id,
                          })),
                      }
                    : undefined,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
                visibleToUsers: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        })

        return NextResponse.json(
            {
                success: true,
                data: fileSystem,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating file system:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create file system' },
            { status: 500 }
        )
    }
}

// PUT /api/fileSystems - Update multiple file systems (bulk update)
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { ids, updates } = body

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Invalid or missing file system IDs' },
                { status: 400 }
            )
        }

        const updatedFileSystems = await prisma.fileSystem.updateMany({
            where: {
                id: { in: ids },
            },
            data: updates,
        })

        return NextResponse.json({
            success: true,
            data: { count: updatedFileSystems.count },
        })
    } catch (error) {
        console.error('Error updating file systems:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update file systems' },
            { status: 500 }
        )
    }
}

// DELETE /api/fileSystems - Delete multiple file systems
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const ids = searchParams.get('ids')?.split(',')

        if (!ids || ids.length === 0) {
            return NextResponse.json(
                { success: false, error: 'No file system IDs provided' },
                { status: 400 }
            )
        }

        const deletedFileSystems = await prisma.fileSystem.deleteMany({
            where: {
                id: { in: ids },
            },
        })

        return NextResponse.json({
            success: true,
            data: { count: deletedFileSystems.count },
        })
    } catch (error) {
        console.error('Error deleting file systems:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete file systems' },
            { status: 500 }
        )
    }
}
