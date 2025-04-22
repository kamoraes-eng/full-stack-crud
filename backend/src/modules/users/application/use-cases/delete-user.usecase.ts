import { Injectable, Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { UserRepository } from '../../domain/repositories/user.repository'

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('CACHE_MANAGER') private readonly cache: Cache,
  ) {}

  async execute(id: string): Promise<void> {
    await this.userRepository.delete(id)
    await this.cache.del('users:all')
  }
}
