import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity'
import { UsersController } from './presentation/controllers/users.controller'
import { CreateUserUseCase } from './application/use-cases/create-user.usecase'
import { ListUsersUseCase } from './application/use-cases/list-users.usecase'
import { UpdateUserUseCase } from './application/use-cases/update-user.usecase'
import { DeleteUserUseCase } from './application/use-cases/delete-user.usecase'
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository'
import { BcryptAdapter } from './infrastructure/security/bcrypt.adapter'
import { SeedService } from './infrastructure/seed.service'

@Module({
imports: [
TypeOrmModule.forFeature([UserOrmEntity]),
],
controllers: [UsersController],
providers: [
{ provide: 'UserRepository', useClass: TypeOrmUserRepository },
{ provide: 'PasswordHasherGateway', useClass: BcryptAdapter },
CreateUserUseCase,
ListUsersUseCase,
UpdateUserUseCase,
DeleteUserUseCase,
SeedService,
],
exports: [
'UserRepository',
'PasswordHasherGateway',
CreateUserUseCase,
ListUsersUseCase,
UpdateUserUseCase,
DeleteUserUseCase,
],
})
export class UsersModule {}
