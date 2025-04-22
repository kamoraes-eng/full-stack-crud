import { Injectable, Inject } from '@nestjs/common'
import { UserRepository } from '../../domain/repositories/user.repository'
import { PasswordHasherGateway } from '../gateways/password-hasher.gateway'
import { EmailVO } from '../../domain/value-objects/email.vo'
import { User } from '../../domain/entities/user.entity'
import { v4 as uuid } from 'uuid'

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('PasswordHasherGateway') private readonly passwordHasher: PasswordHasherGateway,
  ) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    const emailVO = EmailVO.create(email)
    const hash = await this.passwordHasher.hash(password)
    const now = new Date()
    const newUser = new User(uuid(), name, emailVO, hash, now, now)
    return this.userRepository.save(newUser)
  }
}
