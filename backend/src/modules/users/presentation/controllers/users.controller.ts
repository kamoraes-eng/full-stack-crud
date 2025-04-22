import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common'
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase'
import { CreateUserDto } from '../dto/create-user.dto'


@Controller('users')
export class UsersController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUser.execute(dto.name, dto.email, dto.password)
    return { id: user.id, name: user.name, email: user.email.value, createdAt: user.createdAt }
  }

  @Get()
  findAll() { return [] }
}