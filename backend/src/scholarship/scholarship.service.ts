import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scholarship } from './entities/scholarship.entity';
import { Application } from './entities/application.entity';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { QueryScholarshipDto } from './dto/query-scholarship.dto';
import { ActivityLogService } from '../logs/activity-log.service';

@Injectable()
export class ScholarshipService {
  constructor(
    @InjectRepository(Scholarship)
    private scholarshipRepo: Repository<Scholarship>,
    @InjectRepository(Application)
    private applicationRepo: Repository<Application>,
    private readonly activityLogService: ActivityLogService,
  ) {}

  // 1. Get all scholarships with search/sort
  findAll(query: QueryScholarshipDto) {
    const qb = this.scholarshipRepo.createQueryBuilder('s');
    if (query.search) {
      qb.where(
        'LOWER(s.title) LIKE :search OR LOWER(s.description) LIKE :search',
        { search: `%${query.search.toLowerCase()}%` },
      );
    }
    qb.orderBy(
      `s.${query.sortBy || 'createdAt'}`,
      query.order || 'DESC',
    ).take(query.limit || 20);
    return qb.getMany();
  }

  // 2. Get one specific scholarship by ID
  findOne(id: number) {
    return this.scholarshipRepo.findOneBy({ id });
  }

  // 3. Create a scholarship
  async create(data: CreateScholarshipDto, userId?: number) {
    const saved = await this.scholarshipRepo.save(data);
    await this.activityLogService.log({
      userId,
      action: 'scholarship.created',
      entityType: 'scholarship',
      entityId: saved.id,
    });
    return saved;
  }

  // 4. Update scholarship
  async update(id: number, dto: UpdateScholarshipDto, userId?: number) {
    await this.scholarshipRepo.update(id, dto);
    const updated = await this.findOne(id);
    await this.activityLogService.log({
      userId,
      action: 'scholarship.updated',
      entityType: 'scholarship',
      entityId: id,
    });
    return updated;
  }

  // 5. Submit an application
  async apply(data: CreateApplicationDto, userId?: number) {
    const saved = await this.applicationRepo.save(data);
    await this.activityLogService.log({
      userId,
      action: 'application.submitted',
      entityType: 'application',
      entityId: saved.id,
      metadata: { scholarshipId: saved.scholarshipId },
    });
    return saved;
  }

  // 6. Get all Applications (For Admin)
  findAllApplications() {
    return this.applicationRepo.find({ order: { createdAt: 'DESC' } });
  }

  findApplicationsForUser(userId: number) {
    return this.applicationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Highlight feature: export applications as CSV for reporting
  async exportApplicationsCsv() {
    const apps = await this.applicationRepo.find({ order: { createdAt: 'DESC' } });
    const header = 'id,studentName,email,scholarshipId,status,createdAt';
    const rows = apps.map(
      (a) =>
        `${a.id},"${a.studentName}","${a.email}",${a.scholarshipId},${a.status},${a.createdAt.toISOString()}`,
    );
    return [header, ...rows].join('\n');
  }

  // 7. Update Application Status
  async updateStatus(id: number, status: string, userId?: number) {
    await this.applicationRepo.update(id, { status });
    await this.activityLogService.log({
      userId,
      action: 'application.status_updated',
      entityType: 'application',
      entityId: id,
      metadata: { status },
    });
    return this.applicationRepo.findOneBy({ id });
  }

  // 8. Get Dashboard Statistics
  async getStats() {
    const totalScholarships = await this.scholarshipRepo.count();
    const totalApps = await this.applicationRepo.count();
    const approvedApps = await this.applicationRepo.count({
      where: { status: 'Approved' },
    });
    const pendingApps = await this.applicationRepo.count({
      where: { status: 'Pending' },
    });
    const recentApplications = await this.applicationRepo.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalScholarships,
      totalApps,
      approvedApps,
      pendingApps,
      recentApplications,
    };
  }

  // 9. Delete a Scholarship
  async remove(id: number, userId?: number) {
    await this.scholarshipRepo.delete(id);
    await this.activityLogService.log({
      userId,
      action: 'scholarship.deleted',
      entityType: 'scholarship',
      entityId: id,
    });
    return { deleted: true };
  }

  // 10. Get specific application (for Read Full Essay page)
  findOneApplication(id: number) {
    return this.applicationRepo.findOneBy({ id });
  }

  // Count methods for dashboard
  count() {
    return this.scholarshipRepo.count();
  }

  countApplications() {
    return this.applicationRepo.count();
  }

  countApplicationsByStatus(status: string) {
    return this.applicationRepo.count({ where: { status } });
  }

  countUserApplications(userId: number) {
    return this.applicationRepo.count({ where: { userId } });
  }

  countUserApplicationsByStatus(userId: number, status: string) {
    return this.applicationRepo.count({ where: { userId, status } });
  }
}