import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { CreateReportDTO } from "@coshub/types";
import { ApiResponse } from "@coshub/types";

@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createReportDto: CreateReportDTO,
  ): Promise<ApiResponse<any>> {
    try {
      const report = await this.reportsService.create(createReportDto);

      return {
        success: true,
        data: report,
        message: "举报提交成功",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: "REPORT_CREATE_FAILED",
            message: "提交举报失败",
            details: error.message,
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
