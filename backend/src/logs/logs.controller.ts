import { Controller, Get, UseGuards } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogsController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get('recent')
  @Roles('admin')
  recent() {
    return this.activityLogService.findRecent();
  }
}




