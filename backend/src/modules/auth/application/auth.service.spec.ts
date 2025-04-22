import { AuthService } from './auth.service'
import { UnauthorizedException } from '@nestjs/common'
import { EmailVO } from '../../users/domain/value-objects/email.vo'

describe('AuthService', () => {
  let authService: AuthService
  const userRepo = { findByEmail: jest.fn() }
  const hasher = { compare: jest.fn() }
  const jwtService = { sign: jest.fn(() => 'signed-token') }

  beforeEach(() => {
    authService = new AuthService(
      userRepo as any,
      hasher as any,
      jwtService as any,
    )
  })

  it('throws if user not found', async () => {
    userRepo.findByEmail.mockResolvedValue(null)
    await expect(
      authService.validateUser('a@b.com', 'pwd'),
    ).rejects.toThrow(UnauthorizedException)
  })

  it('throws if password invalid', async () => {
    userRepo.findByEmail.mockResolvedValue({
      id: '1',
      email: EmailVO.create('a@b.com'),
      password: 'hash',
    })
    hasher.compare.mockResolvedValue(false)
    await expect(
      authService.validateUser('a@b.com', 'pwd'),
    ).rejects.toThrow(UnauthorizedException)
  })

  it('returns user if valid', async () => {
    const user = {
      id: '1',
      email: EmailVO.create('a@b.com'),
      password: 'hash',
    }
    userRepo.findByEmail.mockResolvedValue(user)
    hasher.compare.mockResolvedValue(true)
    await expect(
      authService.validateUser('a@b.com', 'pwd'),
    ).resolves.toEqual(user)
  })

  it('login returns access_token', async () => {
    const user = { id: '1', email: EmailVO.create('a@b.com') }
    const res = await authService.login(user)
    expect(res).toEqual({ access_token: 'signed-token' })
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: '1',
      email: 'a@b.com',
    })
  })
})
