import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasherGateway } from '../gateways/password-hasher.gateway';
import { EmailVO } from '../../domain/value-objects/email.vo';
import { User } from '../../domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') 
    private readonly repo: UserRepository,
    @Inject('PasswordHasherGateway') 
    private readonly hasher: PasswordHasherGateway,
  ) {}

  async execute(
    name: string,
    email: string,
    password: string,
    isAdmin: boolean = false
  ): Promise<User> {
    const emailVO = EmailVO.create(email);
    const hash = await this.hasher.hash(password);
    const now = new Date();
    
    const user = new User(
      uuidv4(),
      name,
      emailVO,
      hash,
      isAdmin,
      now,
      now
    );
  
    return this.repo.save(user);
  }
}