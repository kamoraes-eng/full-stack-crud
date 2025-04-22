export interface PasswordHasherGateway {
    hash(p: string): Promise<string>
    compare(p: string, h: string): Promise<boolean>
  }