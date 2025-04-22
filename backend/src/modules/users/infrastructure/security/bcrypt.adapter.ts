import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import { PasswordHasherGateway } from '../../application/gateways/password-hasher.gateway'

@Injectable()
export class BcryptAdapter implements PasswordHasherGateway {
  hash(p: string) { return bcrypt.hash(p, 10) }
  compare(p: string, h: string) { return bcrypt.compare(p, h) }
}
