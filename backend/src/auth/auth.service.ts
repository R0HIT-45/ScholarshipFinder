import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ActivityLogService } from '../logs/activity-log.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async onModuleInit() {
    const adminEmail = 'admin@eduequity.com';
    const existing = await this.usersService.findByEmail(adminEmail);
    if (!existing) {
      await this.usersService.create({
        name: 'Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
      });
    }
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create({ ...dto, role: 'user' });
    const accessToken = await this.signToken(user.id, user.email, user.role);
    await this.activityLogService.log({
      userId: user.id,
      action: 'user.register',
      metadata: { email: user.email },
    });
    return { user, accessToken };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const accessToken = await this.signToken(user.id, user.email, user.role);
    await this.activityLogService.log({
      userId: user.id,
      action: 'user.login',
    });
    return { user: this.usersService.sanitize(user), accessToken };
  }

  async me(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return this.usersService.sanitize(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return { message: 'If the email exists, a reset link will be sent.' };
    }
    const token = randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    await this.usersService.setResetToken(user.id, token, expires);
    await this.activityLogService.log({
      userId: user.id,
      action: 'user.password_reset_requested',
    });
    // In production we would email the token. For now, return it so frontend can display.
    return {
      message: 'Password reset link created',
      token,
      expiresAt: expires,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (!dto.token) throw new BadRequestException('Token is required');
    const user = await this.usersService.resetPassword(
      dto.token,
      dto.password,
    );
    await this.activityLogService.log({
      userId: user.id,
      action: 'user.password_reset',
    });
    return { user, message: 'Password updated successfully' };
  }

  private signToken(userId: number, email: string, role: string) {
    return this.jwtService.signAsync(
      { sub: userId, email, role },
      { expiresIn: '1d' },
    );
  }
}
