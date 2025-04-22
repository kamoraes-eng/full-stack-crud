import { Injectable, Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { UserRepository } from '../../domain/repositories/user.repository'
import { User } from '../../domain/entities/user.entity'

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('CACHE_MANAGER') private readonly cache: Cache,
  ) {}

  async execute(): Promise<User[]> {
    const cached = await this.cache.get<User[]>('users:all')
    if (cached) return cached
    const users = await this.userRepository.findAll()
    await this.cache.set('users:all', users)
    return users
  }
}
