import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDeviceDto } from './dto/create-user-device.dto';
import { UpdateUserDeviceDto } from './dto/update-user-device.dto';
import { PrismaService } from '../../providers/prisma/prisma.service';

@Injectable()
export class UserDevicesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDeviceDto: CreateUserDeviceDto) {
    return this.prisma.userDevices.create({
      data: createUserDeviceDto,
    });
  }

  async findAll() {
    return this.prisma.userDevices.findMany({
      include: { user: true },
    });
  }

  async findOne(id: string) {
    const device = await this.prisma.userDevices.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!device) throw new NotFoundException(`Device with ID ${id} not found`);
    return device;
  }

  async findByUser(userId: string) {
    return this.prisma.userDevices.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async update(id: string, updateUserDeviceDto: UpdateUserDeviceDto) {
    const existing = await this.prisma.userDevices.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Device with ID ${id} not found`);

    return this.prisma.userDevices.update({
      where: { id },
      data: updateUserDeviceDto,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.userDevices.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Device with ID ${id} not found`);

    return this.prisma.userDevices.delete({ where: { id } });
  }
}