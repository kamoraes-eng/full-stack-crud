import { User } from './user.entity'
import { EmailVO } from '../value-objects/email.vo'

describe('User Entity', () => {
  const now = new Date()
  const emailVO = EmailVO.create('u@d.io')

  it('should construct a User with correct properties', () => {
    const user = new User('123', 'Bob', emailVO, 'pass', now, now)
    expect(user.id).toBe('123')
    expect(user.name).toBe('Bob')
    expect(user.email).toBe(emailVO)
    expect(user.password).toBe('pass')
    expect(user.createdAt).toBe(now)
    expect(user.updatedAt).toBe(now)
  })
})
