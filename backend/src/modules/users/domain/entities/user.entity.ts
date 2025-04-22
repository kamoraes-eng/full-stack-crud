import { EmailVO } from "../value-objects/email.vo";

export class User {
    constructor(
      readonly id: string,
      readonly name: string,
      readonly email: EmailVO,
      readonly password: string,
      readonly createdAt: Date,
      readonly updatedAt: Date,
    ) {}
  }