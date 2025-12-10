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
      host: 'localhost',
      port: 5432,
      username: 'postgres', // <--- CHECK THIS
      password: 'postgres', // <--- CHANGE THIS TO YOUR POSTGRES PASSWORD
      database: 'scholarship',
      entities: [Scholarship, Application, User, ActivityLog],
      synchronize: true,
    }),
    ScholarshipModule,
    AuthModule,
    UsersModule,
    ActivityLogModule,
    DashboardModule,
  ],
})
export class AppModule {}