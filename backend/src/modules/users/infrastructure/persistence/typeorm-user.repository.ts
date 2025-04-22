import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserRepository } from '../../domain/repositories/user.repository'
import { UserOrmEntity } from './user.orm-entity'
import { User } from '../../domain/entities/user.entity'
import { EmailVO } from '../../domain/value-objects/email.vo'

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const ormEntity = this.toOrmEntity(user)
    const persisted = await this.ormRepository.save(ormEntity)
    return this.toDomainEntity(persisted)
  }

  async findAll(): Promise<User[]> {
    const ormEntities = await this.ormRepository.find()
    return ormEntities.map(entity => this.toDomainEntity(entity))
  }

  async findById(id: string): Promise<User | null> {
    const ormEntity = await this.ormRepository.findOneBy({ id })
    return ormEntity ? this.toDomainEntity(ormEntity) : null
  }

  async findByEmail(email: EmailVO): Promise<User | null> {
    const ormEntity = await this.ormRepository.findOneBy({ email: email.value })
    return ormEntity ? this.toDomainEntity(ormEntity, email) : null
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete({ id })
  }

  private toOrmEntity(user: User): UserOrmEntity {
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as UserOrmEntity
  }

  private toDomainEntity(orm: UserOrmEntity, emailVO?: EmailVO): User {
    return new User(
      orm.id,
      orm.name,
      emailVO ?? EmailVO.create(orm.email),
      orm.password,
      orm.createdAt,
      orm.updatedAt,
    )
  }
}
