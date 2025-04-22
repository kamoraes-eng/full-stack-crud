import { Injectable, Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { UserRepository } from '../../domain/repositories/user.repository'
import { PasswordHasherGateway } from '../gateways/password-hasher.gateway'
import { EmailVO } from '../../domain/value-objects/email.vo'
import { User } from '../../domain/entities/user.entity'

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('PasswordHasherGateway') private readonly passwordHasher: PasswordHasherGateway,
    @Inject('CACHE_MANAGER') private readonly cache: Cache,
  ) {}

  async execute(
    id: string,
    name?: string,
    email?: string,
    password?: string,
  ): Promise<User> {
    const existing = await this.userRepository.findById(id)
    if (!existing) throw new Error('not found')
    const newName = name ?? existing.name
    const newEmail = email ? EmailVO.create(email) : existing.email
    const newPassword = password ? await this.passwordHasher.hash(password) : existing.password
    const updated = new User(
      existing.id,
      newName,
      newEmail,
      newPassword,
      existing.createdAt,
      new Date(),
    )
    const persisted = await this.userRepository.save(updated)
    await this.cache.del('users:all')
    return persisted
  }
}
