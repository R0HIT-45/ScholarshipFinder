import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcryptjs';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await hash(dto.password, 10);
    const user = this.repo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role ?? 'user',
    });
    const saved = await this.repo.save(user);
    return this.sanitize(saved);
  }

  async validateUser(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) return null;
    const isValid = await compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async listAll() {
    const users = await this.repo.find({ order: { createdAt: 'DESC' } });
    return users.map((u) => this.sanitize(u));
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    Object.assign(user, dto);
    await this.repo.save(user);
    return this.sanitize(user);
  }

  async setResetToken(userId: number, token: string, expires: Date) {
    await this.repo.update(userId, { resetToken: token, resetTokenExpires: expires });
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.repo.findOne({ where: { resetToken: token } });
    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Reset link is invalid or expired');
    }
    user.passwordHash = await hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await this.repo.save(user);
    return this.sanitize(user);
  }

  async updatePassword(userId: number, newPassword: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.passwordHash = await hash(newPassword, 10);
    await this.repo.save(user);
    return this.sanitize(user);
  }

  sanitize(user: User) {
    const { passwordHash, resetToken, resetTokenExpires, ...rest } = user;
    return rest;
  }

  count() {
    return this.repo.count();
  }

  async delete(id: number) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.repo.delete(id);
    return { deleted: true };
  }
}

