import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserUseCase } from '../application/use-cases/create-user.usecase';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail = this.config.get('ADMIN_EMAIL');
    const adminPassword = this.config.get('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      console.warn('Admin credentials not configured, skipping seed');
      return;
    }

    try {
      await this.createUser.execute(
        'Admin',
        adminEmail,
        adminPassword,
        true
      );
      console.log('Admin user created successfully');
    } catch (error) {
      if (error.code !== '23505') { 
        console.error('Failed to seed admin user:', error.message);
      }
    }
  }
}