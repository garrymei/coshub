import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReportDTO } from "@coshub/types";
import { Prisma } from "@prisma/client";

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async createReport(dto: CreateReportDTO) {
    return this.prisma.report.create({
      data: {
        type: dto.type as any,
        targetType: dto.targetType as any,
        targetId: dto.targetId,
        reason: dto.reason as any,
        description: dto.description,
        content: dto.content,
        reporterId: dto.reporterId,
        evidence: dto.evidence || [],
      },
    });
  }

  async getReports(page = 1, limit = 20) {
    return this.prisma.report.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            nickname: true,
          },
        },
      },
    });
  }
}
