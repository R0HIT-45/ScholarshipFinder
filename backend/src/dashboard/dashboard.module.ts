import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ScholarshipModule } from '../scholarship/scholarship.module';
import { ActivityLogModule } from '../logs/activity-log.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ScholarshipModule, ActivityLogModule, UsersModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
