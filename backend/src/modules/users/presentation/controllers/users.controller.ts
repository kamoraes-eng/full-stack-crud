import { Controller, Post, Body, Get, Patch, Param, Delete, NotFoundException, Inject } from '@nestjs/common'
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase'
import { ListUsersUseCase } from '../../application/use-cases/list-users.usecase'
import { UpdateUserUseCase } from '../../application/use-cases/update-user.usecase'
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.usecase'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { UserRepository } from '../../domain/repositories/user.repository'


@Controller('users')
export class UsersController {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly createUser: CreateUserUseCase,
    private readonly listUsers: ListUsersUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUser.execute(dto.name, dto.email, dto.password)
    return { id: user.id, name: user.name, email: user.email.value, createdAt: user.createdAt }
  }

  @Get()
  async list() {
    const users = await this.listUsers.execute()
    return users.map(u => ({ id: u.id, name: u.name, email: u.email.value }))
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { 
      id: user.id, 
      name: user.name, 
      email: user.email.value,
      createdAt: user.createdAt
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.updateUser.execute(id, dto.name, dto.email, dto.password)
    return { id: user.id, name: user.name, email: user.email.value, updatedAt: user.updatedAt }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUser.execute(id)
    return { id }
  }
}
