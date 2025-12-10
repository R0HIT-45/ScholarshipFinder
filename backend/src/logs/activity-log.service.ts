import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './activity-log.entity';

export interface ActivityPayload {
  userId?: number;
  action: string;
  entityType?: string;
  entityId?: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly repo: Repository<ActivityLog>,
  ) {}

  async log(payload: ActivityPayload) {
    const entry = this.repo.create({
      userId: payload.userId,
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      metadata: payload.metadata,
    });
    return this.repo.save(entry);
  }

  findRecent(limit = 20) {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}




