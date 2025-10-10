import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common'
import { PaymentChannelService } from './payment-channel.service'
import { CreatePaymentChannelDto } from './dto/create-payment-channel.dto'
import { UpdatePaymentChannelDto } from './dto/update-payment-channel.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { AdminGuard } from '../auth/admin.guard'

@Controller('payment-channels')
export class PaymentChannelController {
  constructor(private readonly paymentChannelService: PaymentChannelService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Insert new payment channel successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async create(@Body() createPaymentChannelDto: CreatePaymentChannelDto) {
    return this.paymentChannelService.create(createPaymentChannelDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of payment channel successfully')
  @UseGuards(JwtGuard)
  async findAll() {
    return this.paymentChannelService.findAll()
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get payment channel detail successfully')
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string) {
    return this.paymentChannelService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update payment channel successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePaymentChannelDto: UpdatePaymentChannelDto,
  ) {
    return this.paymentChannelService.update(id, updatePaymentChannelDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Update payment channel successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async remove(@Param('id') id: string) {
    return this.paymentChannelService.delete(id)
  }
}
