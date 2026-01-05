import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { RoleEnum } from '@prisma/client'
import { isUUID } from 'class-validator'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { TokenPayload } from '../auth/dto/token-payload.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { RolesGuard } from '../auth/roles.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { ProtectUserResponseDto } from './dto/protect-user-response.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { UserService } from './user.service'
import { UserQueryDto } from './dto/user-query.dto'

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HttpCode(201)
    @ResponseMessage('Create user successfully')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({
        status: 201,
        description: 'The user has been successfully created.',
        type: UserResponseDto,
    })
    async create(
        @Body() createUserDto: CreateUserDto,
        @Query() sendInviteEmail: '0' | '1'
    ) {
        const isSendInviteEmail = Boolean(sendInviteEmail)
        return this.userService.create(createUserDto, isSendInviteEmail)
    }

    @Get()
    @HttpCode(200)
    @ResponseMessage('Get list of users successfully')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status: 200,
        description: 'Return a list of users.',
        type: [ProtectUserResponseDto],
    })
    async findAll(@Query() query: UserQueryDto) {
        return this.userService.findAll(query)
    }

    @Patch('update-password')
    @HttpCode(200)
    @ApiBearerAuth()
    @ResponseMessage('Update password successfully')
    @ApiOperation({ summary: 'Update the password for the current user' })
    @ApiResponse({
        status: 200,
        description: 'The password has been successfully updated.',
    })
    async updatePassword(
        @Req() request: Request,
        @Body() dto: UpdatePasswordDto
    ) {
        const userPayload: TokenPayload = await request['user']
        return this.userService.updatePassword(userPayload.sub, dto)
    }

    @Patch(':id/reset-password')
    @HttpCode(200)
    @ResponseMessage('Reset password successfully')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Reset the password for a user' })
    @ApiResponse({
        status: 200,
        description: 'The password has been successfully reset.',
    })
    @UseGuards(RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async resetPassword(
        @Param('id') id: string,
        @Body() dto: ResetPasswordDto
    ) {
        return this.userService.resetPassword(id, dto)
    }

    @Get('check-username')
    @HttpCode(200)
    @ResponseMessage('Check username successfully')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Check if a username is valid' })
    @ApiResponse({
        status: 200,
        description: 'Returns a boolean indicating if the username is valid.',
    })
    async checkUsernameTaken(@Query('username') username: string) {
        const isExist = await this.userService.isUsernameTaken(username)
        return { isExist }
    }

    // Handles both ID and Username
    @Get(':identifier')
    @HttpCode(200)
    @ResponseMessage('Get user detail successfully')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a user by ID or Username' })
    @ApiResponse({
        status: 200,
        description: 'Return a single user.',
        type: UserResponseDto,
    })
    @UseGuards(RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async findOne(@Param('identifier') identifier: string) {
        // Check if the parameter looks like a UUID
        if (isUUID(identifier)) {
            return this.userService.findById(identifier)
        }
        // Otherwise treat it as a username
        return this.userService.findByUsername(identifier)
    }

    @Patch(':username')
    @HttpCode(200)
    @ResponseMessage('Update user successfully')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({
        status: 200,
        description: 'The user has been successfully updated.',
        type: UserResponseDto,
    })
    @UseGuards(RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async update(
        @Param('username') username: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.update(username, updateUserDto)
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @ResponseMessage('User status updated successfully')
    async toggleStatus(
        @Param('id') id: string,
        @Req() request: Request,
        @Query('isActive') isActive: string
    ) {
        const userPayload: TokenPayload = await request['user']
        return this.userService.toggleUserStatus(userPayload.role, id, isActive)
    }

    @Delete(':id')
    @HttpCode(200)
    @ResponseMessage('Delete user successfully')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({
        status: 200,
        description: 'The user has been successfully deleted.',
    })
    @UseGuards(RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async remove(@Param('id') id: string) {
        return this.userService.delete(id)
    }
}
