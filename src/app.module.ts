import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenAuthGuard } from './common/guard/access-token-auth.guard';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenAuthGuard,
    },
  ],
})
export class AppModule {}
