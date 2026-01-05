import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { EntityEnum, Permission } from '@prisma/client' // Import Permission type
import { PrismaService } from '../../providers/prisma/prisma.service'
import { CreateRoleDto } from './dtos/create-role.dto'
import { UpdateRoleDto } from './dtos/update-role.dto'
import slugify from 'slugify'

@Injectable()
export class RoleService {
    constructor(private prisma: PrismaService) {}

    // 1. Create a new Role
    async create(dto: CreateRoleDto) {
        // Check for duplicate name
        const exists = await this.prisma.role.findUnique({
            where: { displayName: dto.name },
        })
        if (exists) throw new BadRequestException('Role name already exists')

        // Generate a safe code (e.g. "Human Resources" -> "human-resources")
        const generatedCode = slugify(dto.name, { lower: true, strict: true })

        return this.prisma.role.create({
            data: {
                displayName: dto.name,
                code: generatedCode,
                permissions: {
                    // Connect existing permissions by ID (UUID String)
                    connect: dto.permissionIds.map((id) => ({ id })),
                },
            },
            include: {
                permissions: true,
            },
        })
    }

    // 2. Get All Roles
    async findAll() {
        const result = await this.prisma.role.findMany({
            include: {
                permissions: true,
                _count: {
                    select: { users: true },
                },
            },
        })
        return {
            roles: result,
            total: result.length,
        }
    }

    // 3. Get One Role
    // FIX: Changed id type from number to string (UUID)
    async findOne(id: string) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: {
                permissions: true,
            },
        })
        if (!role) throw new NotFoundException(`Role #${id} not found`)
        return role
    }

    // // 4. Update Role
    // // FIX: Changed id type from number to string (UUID)
    // async update(id: string, dto: UpdateRoleDto) {
    //     // Optional: If name changes, you might want to update the code,
    //     // but usually 'code' should remain static after creation to not break logic.
    //     // Here we only update displayName and Permissions.

    //     return this.prisma.role.update({
    //         where: { id },
    //         data: {
    //             displayName: dto.name,
    //             permissions: dto.permissionIds
    //                 ? {
    //                       // 'set' replaces ALL existing relations with the new list
    //                       set: dto.permissionIds.map((permId) => ({
    //                           id: permId,
    //                       })),
    //                   }
    //                 : undefined,
    //         },
    //         include: { permissions: true },
    //     })
    // }

    // FIX: Changed id type from number to string (UUID)
    async remove(id: string) {
        // Check if role exists first
        await this.findOne(id)
        return this.prisma.role.delete({ where: { id } })
    }

    // --- Helper for UI ---
    // Note: If you are using PermissionGroup table, consider moving this logic
    // to PermissionsService and grouping by 'permissionGroup' instead.
    async getGroupedPermissions() {
        const permissions = await this.prisma.permission.findMany({
            orderBy: { entity: 'asc' },
        })

        // Grouping logic: { "JOB": [Permission, ...], "USER": [Permission, ...] }
        return permissions.reduce(
            (acc, curr) => {
                const key = curr.entity
                if (!acc[key]) acc[key] = []
                acc[key].push(curr)
                return acc
            },
            {} as Record<EntityEnum, Permission[]>
        )
    }
}
