import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScholarshipModule } from './scholarship/scholarship.module';
import { AuthModule } from './auth/auth.module';
import { Scholarship } from './scholarship/entities/scholarship.entity';
import { Application } from './scholarship/entities/application.entity';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { ActivityLog } from './logs/activity-log.entity';
import { ActivityLogModule } from './logs/activity-log.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Scholarship, Application, User, ActivityLog],
      synchronize: true, // Set to false in production!
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
    ScholarshipModule,
    AuthModule,
    UsersModule,
    ActivityLogModule,
    DashboardModule,
  ],
})
export class AppModule {}