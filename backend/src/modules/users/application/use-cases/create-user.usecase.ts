import { Injectable, Inject } from '@nestjs/common'
import { UserRepository } from '../../domain/repositories/user.repository'
import { PasswordHasherGateway } from '../gateways/password-hasher.gateway'
import { EmailVO } from '../../domain/value-objects/email.vo'
import { User } from '../../domain/entities/user.entity'
import { v4 as uuid } from 'uuid'

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private repo: UserRepository,
    @Inject('PasswordHasherGateway') private hasher: PasswordHasherGateway,
  ) {}
  async execute(name: string, email: string, password: string): Promise<User> {
    const emailVO = EmailVO.create(email)
    const hash = await this.hasher.hash(password)
    const now = new Date()
    const user = new User(uuid(), name, emailVO, now, now)
    return this.repo.save({ ...user, password: hash } as any)
  }
}
