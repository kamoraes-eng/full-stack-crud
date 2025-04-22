import { EmailVO } from './email.vo'

describe('EmailVO', () => {
  it('should create a valid EmailVO for correct email', () => {
    const email = EmailVO.create('Test@Example.COM')
    expect(email.value).toBe('test@example.com')
  })

  it('should throw for invalid email format', () => {
    expect(() => EmailVO.create('invalid-email')).toThrow('invalid email')
  })

  it('equals() should return true for same email', () => {
    const e1 = EmailVO.create('a@b.c')
    const e2 = EmailVO.create('A@B.C')
    expect(e1.equals(e2)).toBe(true)
  })

  it('equals() should return false for different email', () => {
    const e1 = EmailVO.create('x@y.z')
    const e2 = EmailVO.create('other@domain.com')
    expect(e1.equals(e2)).toBe(false)
  })
})
