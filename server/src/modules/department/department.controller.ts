import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common'
import { DepartmentService } from './department.service'
import { CreateDepartmentDto } from './dto/create-department.dto'
import { UpdateDepartmentDto } from './dto/update-department.dto'
import { JwtGuard } from '../auth/jwt.guard'
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator'
import { AdminGuard } from '../auth/admin.guard'

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  @HttpCode(201)
  @ResponseMessage('Insert new department successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto)
  }

  @Get()
  @HttpCode(200)
  @ResponseMessage('Get list of departments successfully')
  @UseGuards(JwtGuard)
  async findAll() {
    return this.departmentService.findAll()
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Get department detail successfully')
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string) {
    return this.departmentService.findById(id)
  }

  @Patch(':id')
  @HttpCode(200)
  @ResponseMessage('Update department successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(id, updateDepartmentDto)
  }

  @Delete(':id')
  @HttpCode(200)
  @ResponseMessage('Delete department successfully')
  @UseGuards(JwtGuard, AdminGuard)
  async remove(@Param('id') id: string) {
    return this.departmentService.delete(id)
  }
}
