import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScholarshipService } from './scholarship.service';
import { ScholarshipController } from './scholarship.controller';
import { Scholarship } from './entities/scholarship.entity';
import { Application } from './entities/application.entity';
import { ActivityLogModule } from '../logs/activity-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Scholarship, Application]), ActivityLogModule],
  controllers: [ScholarshipController],
  providers: [ScholarshipService],
  exports: [ScholarshipService, TypeOrmModule],
})
export class ScholarshipModule {}