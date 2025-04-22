import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './modules/users/users.module'
import { typeOrmConfig } from './shared/infrastructure/typeorm.config'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-store'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        store: redisStore,
        url: `redis://${cfg.get('REDIS_HOST')}:${cfg.get('REDIS_PORT')}`,
        ttl: 60,
      }),
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
  ],
})
export class AppModule {}