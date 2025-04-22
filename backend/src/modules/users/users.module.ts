import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity'
import { UsersController } from './presentation/controllers/users.controller'
import { CreateUserUseCase } from './application/use-cases/create-user.usecase'
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository'
import { BcryptAdapter } from './infrastructure/security/bcrypt.adapter'

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    { provide: 'UserRepository', useClass: TypeOrmUserRepository },
    { provide: 'PasswordHasherGateway', useClass: BcryptAdapter },
    CreateUserUseCase,
  ],
})
export class UsersModule {}
