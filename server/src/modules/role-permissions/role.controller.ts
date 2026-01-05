import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common'
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator'
import { JwtGuard } from '../auth/jwt.guard'
import { CreateRoleDto } from './dtos/create-role.dto'
import { UpdateRoleDto } from './dtos/update-role.dto'
import { PermissionService } from './permission.service'
import { RoleService } from './role.service'

@Controller('roles')
@UseGuards(JwtGuard) // Protect all routes
export class RoleController {
    constructor(
        private readonly rolesService: RoleService,
        private readonly permissionService: PermissionService
    ) {}

    @Get('permissions')
    @RequirePermissions('role.read')
    allPermissions() {
        return this.permissionService.findAll()
    }

    // Get structure for UI (e.g., Checkbox groups)
    @Get('permissions/grouped')
    @RequirePermissions('role.read')
    getPermissions() {
        return this.permissionService.findAllGrouped()
    }

    @Post()
    @RequirePermissions('role.manage') // Only admins
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto)
    }

    @Get()
    @RequirePermissions('role.read')
    findAll() {
        return this.rolesService.findAll()
    }

    @Get(':id')
    @RequirePermissions('role.read')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.rolesService.findOne(id)
    }

    // @Patch(':id')
    // @RequirePermissions('role.manage')
    // update(
    //     @Param('id', ParseIntPipe) id: string,
    //     @Body() updateRoleDto: UpdateRoleDto
    // ) {
    //     return this.rolesService.update(id, updateRoleDto)
    // }

    @Delete(':id')
    @RequirePermissions('role.manage')
    remove(@Param('id', ParseIntPipe) id: string) {
        return this.rolesService.remove(id)
    }
}
