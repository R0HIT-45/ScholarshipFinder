import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLog } from './activity-log.entity';
import { ActivityLogService } from './activity-log.service';
import { LogsController } from './logs.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog]), forwardRef(() => AuthModule)],
  providers: [ActivityLogService],
  controllers: [LogsController],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}

