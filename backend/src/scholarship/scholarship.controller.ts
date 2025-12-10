import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ScholarshipService } from './scholarship.service';
import { CreateScholarshipDto } from './dto/create-scholarship.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateScholarshipDto } from './dto/update-scholarship.dto';
import { QueryScholarshipDto } from './dto/query-scholarship.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('scholarships')
export class ScholarshipController {
  constructor(private readonly scholarshipService: ScholarshipService) {}

  // Public: list scholarships with search & filters
  @Get()
  findAll(@Query() query: QueryScholarshipDto) {
    return this.scholarshipService.findAll(query);
  }

  // Admin: view applications
  @Get('applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAllApps() {
    return this.scholarshipService.findAllApplications();
  }

  @Get('applications/me')
  @UseGuards(JwtAuthGuard)
  myApps(@Request() req: any) {
    return this.scholarshipService.findApplicationsForUser(req.user.id);
  }

  @Get('applications/export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async export(@Res() res: Response) {
    const csv = await this.scholarshipService.exportApplicationsCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
    res.send(csv);
  }

  // Public: get scholarship
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scholarshipService.findOne(+id);
  }

  // Admin: create scholarship
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() body: CreateScholarshipDto, @Request() req: any) {
    return this.scholarshipService.create(body, req.user?.id);
  }

  // Public: submit application
  @Post('apply')
  apply(@Body() body: CreateApplicationDto, @Request() req: any) {
    return this.scholarshipService.apply(body, req.user?.id);
  }

  // Admin: update scholarship
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateScholarshipDto,
    @Request() req: any,
  ) {
    return this.scholarshipService.update(+id, dto, req.user?.id);
  }

  // Admin: update application status
  @Patch('applications/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    return this.scholarshipService.updateStatus(+id, status, req.user?.id);
  }

  // Admin: stats
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getStats() {
    return this.scholarshipService.getStats();
  }

  // Admin: delete scholarship
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.scholarshipService.remove(+id, req.user?.id);
  }

  // Admin: specific application
  @Get('applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOneApplication(@Param('id') id: string) {
    return this.scholarshipService.findOneApplication(+id);
  }
}