import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { ActivityLogModule } from '../logs/activity-log.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'supersecret_jwt_key',
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => ActivityLogModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [JwtAuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
