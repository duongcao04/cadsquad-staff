import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger'
import { AdminGuard } from '../auth/admin.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { TokenPayload } from '../auth/dto/token-payload.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { ProtectUserResponseDto } from './dto/protect-user-response.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { UserService } from './user.service'
import { isUUID } from 'class-validator'

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HttpCode(201)
    @ResponseMessage('Create user successfully')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({
        status: 201,
        description: 'The user has been successfully created.',
        type: UserResponseDto,
    })
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    @Get()
    @HttpCode(200)
    @ResponseMessage('Get list of users successfully')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status: 200,
        description: 'Return a list of users.',
        type: [ProtectUserResponseDto],
    })
    async findAll() {
        return this.userService.findAll()
    }

    @Patch('update-password')
    @HttpCode(200)
    @UseGuards(JwtGuard)
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
    @UseGuards(JwtGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Reset the password for a user' })
    @ApiResponse({
        status: 200,
        description: 'The password has been successfully reset.',
    })
    async resetPassword(
        @Param('id') id: string,
        @Body() dto: ResetPasswordDto
    ) {
        return this.userService.resetPassword(id, dto)
    }

    @Get('username/:username')
    @HttpCode(200)
    @ResponseMessage('Check username successfully')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Check if a username is valid' })
    @ApiResponse({
        status: 200,
        description: 'Returns a boolean indicating if the username is valid.',
    })
    async checkUsernameValid(@Param('username') username: string) {
        return this.userService.checkUsernameValid(username)
    }

    // Handles both ID and Username
    @Get(':identifier')
    @HttpCode(200)
    @ResponseMessage('Get user detail successfully')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a user by ID or Username' })
    @ApiResponse({
        status: 200,
        description: 'Return a single user.',
        type: UserResponseDto,
    })
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
    @UseGuards(JwtGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({
        status: 200,
        description: 'The user has been successfully updated.',
        type: UserResponseDto,
    })
    async update(
        @Param('username') username: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.update(username, updateUserDto)
    }

    @Delete(':id')
    @HttpCode(200)
    @ResponseMessage('Delete user successfully')
    @UseGuards(JwtGuard, AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({
        status: 200,
        description: 'The user has been successfully deleted.',
    })
    async remove(@Param('id') id: string) {
        return this.userService.delete(id)
    }
}
