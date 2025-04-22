import { User } from '../entities/user.entity'
import { EmailVO } from '../value-objects/email.vo'

export interface UserRepository {
  save(u: User): Promise<User>
  findAll(): Promise<User[]>
  findById(id: string): Promise<User | null>
  findByEmail(e: EmailVO): Promise<User | null>
  delete(id: string): Promise<void>
}