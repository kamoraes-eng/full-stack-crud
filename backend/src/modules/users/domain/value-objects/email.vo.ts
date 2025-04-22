export class EmailVO {
    private constructor(private readonly email: string) {}
    static create(raw: string): EmailVO {
      if (!/^\\S+@\\S+\\.\\S+$/.test(raw)) throw new Error('invalid email')
      return new EmailVO(raw.toLowerCase())
    }
    get value(): string { return this.email }
    equals(other: EmailVO): boolean { return this.email === other.email }
  }
  