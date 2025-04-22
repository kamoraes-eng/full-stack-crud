
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../users/domain/repositories/user.repository';
import { PasswordHasherGateway } from '../../users/application/gateways/password-hasher.gateway';
import { EmailVO } from '../../users/domain/value-objects/email.vo';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('PasswordHasherGateway')
    private readonly passwordHasher: PasswordHasherGateway,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const emailVO = EmailVO.create(email);
    const user = await this.userRepository.findByEmail(emailVO);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    
    const valid = await this.passwordHasher.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    
    return user;
  }

  async login(user: { id: string; email: EmailVO }) {  
    const payload = { 
      sub: user.id, 
      email: user.email.value  
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}