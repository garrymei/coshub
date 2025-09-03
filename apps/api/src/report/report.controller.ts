import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportDTO, ReportQueryDTO } from "@coshub/types";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { Permission } from "@coshub/types";

@Controller("reports")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.CREATE_REPORT)
  async create(@Body() dto: CreateReportDTO) {
    try {
      return await this.reportService.createReport(dto);
    } catch (error) {
      throw new HttpException(
        "Failed to create report",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  @UseGuards(PermissionGuard)
  @RequirePermissions(Permission.VIEW_REPORTS)
  async findAll(@Query() query: ReportQueryDTO) {
    return this.reportService.getReports(query.page, query.limit);
  }
}