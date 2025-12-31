import {
    Controller,
    Get,
    UseGuards,
    Param,
    Query,
    Req,
    Body,
    Patch,
} from '@nestjs/common'
import { ClientService } from './client.service'
import { JwtGuard } from '../auth/jwt.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { UpdateClientDto } from './dto/update-client.dto'
import { TokenPayload } from '../auth/dto/token-payload.dto'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

@Controller('clients')
@UseGuards(JwtGuard)
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get()
    @ResponseMessage('Get all clients successfully')
    async getAll() {
        return this.clientService.findAll()
    }

    @Get('search-by-name')
    @ResponseMessage('Search client by name results')
    async getByName(@Query('name') name: string) {
        if (!name) return { result: null }

        const client = await this.clientService.findByName(name)
        return client
    }

    @Get(':id')
    @ResponseMessage('Get client details successfully')
    async getOne(@Param('id') id: string) {
        return this.clientService.findOne(id)
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ResponseMessage('Client updated successfully')
    async updateClient(
        @Req() request: Request,
        @Param('id') id: string,
        @Body() dto: UpdateClientDto
    ) {
        const user: TokenPayload = request['user']
        const updatedClient = await this.clientService.update(user.sub, id, dto)
        return updatedClient
    }
}
