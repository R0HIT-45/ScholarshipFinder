import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScholarshipService } from '../scholarship/scholarship.service';
import { ActivityLogService } from '../logs/activity-log.service';
import { UsersService } from '../users/users.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly scholarshipService: ScholarshipService,
    private readonly activityLogService: ActivityLogService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getDashboard(@Request() req: any) {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const [stats, recentActivity] = await Promise.all([
      isAdmin ? this.getAdminStats() : this.getUserStats(userId),
      this.activityLogService.findRecent(10),
    ]);

    return {
      stats,
      recentActivity,
      isAdmin,
    };
  }

  private async getAdminStats() {
    const [totalScholarships, totalApplications, totalUsers] = await Promise.all([
      this.scholarshipService.count(),
      this.scholarshipService.countApplications(),
      this.usersService.count(),
    ]);

    const [approved, pending, rejected] = await Promise.all([
      this.scholarshipService.countApplicationsByStatus('approved'),
      this.scholarshipService.countApplicationsByStatus('pending'),
      this.scholarshipService.countApplicationsByStatus('rejected'),
    ]);

    return {
      totalScholarships,
      totalApplications,
      totalUsers,
      applicationStats: { approved, pending, rejected },
    };
  }

  private async getUserStats(userId: number) {
    const [myApplications, myApprovedCount] = await Promise.all([
      this.scholarshipService.countUserApplications(userId),
      this.scholarshipService.countUserApplicationsByStatus(userId, 'approved'),
    ]);

    return {
      myApplications,
      myApprovedCount,
      myRejectedCount: await this.scholarshipService.countUserApplicationsByStatus(userId, 'rejected'),
    };
  }
}
