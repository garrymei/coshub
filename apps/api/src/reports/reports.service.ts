import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReportDTO } from "@coshub/types";

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: CreateReportDTO) {
    // 内容安全检查（预留接口）
    const contentCheckResult = await this.performContentSafetyCheck(
      createReportDto.content,
      createReportDto.type,
    );

    if (!contentCheckResult.safe) {
      // 内容不安全，记录并返回错误
      await this.logUnsafeContent(createReportDto, contentCheckResult);
      throw new Error("内容包含违规信息");
    }

    // 创建举报记录
    const report = await this.prisma.report.create({
      data: {
        type: createReportDto.type as any,
        targetType: createReportDto.targetType as any,
        targetId: createReportDto.targetId,
        reason: createReportDto.reason as any,
        description: createReportDto.description,
        reporterId: createReportDto.reporterId,
        status: "PENDING",
        contentCheckResult: contentCheckResult as any,
      },
    });

    // 异步处理审核队列
    this.processAuditQueue(report.id).catch(console.error);

    return report;
  }

  private async performContentSafetyCheck(
    content: string,
    type: string,
  ): Promise<{
    safe: boolean;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    violations: string[];
    confidence: number;
  }> {
    try {
      // TODO: 接入内容安全服务
      // 这里预留接口，后续可以接入：
      // - 文本内容安全（敏感词、政治敏感等）
      // - 图片内容安全（色情、暴力等）
      // - AI内容检测

      // 临时实现：基础敏感词检查
      const sensitiveWords = ["暴力", "色情", "政治敏感"];
      const violations = sensitiveWords.filter((word) =>
        content.includes(word),
      );

      return {
        safe: violations.length === 0,
        riskLevel: violations.length > 0 ? "HIGH" : "LOW",
        violations,
        confidence: 0.8,
      };
    } catch (error) {
      // 降级策略：检查失败时默认通过，但记录日志
      console.warn("内容安全检查失败，降级处理:", error);
      return {
        safe: true,
        riskLevel: "LOW",
        violations: [],
        confidence: 0.5,
      };
    }
  }

  private async logUnsafeContent(
    reportData: CreateReportDTO,
    checkResult: any,
  ) {
    // 先创建举报记录（状态为 PENDING）
    const report = await this.prisma.report.create({
      data: {
        type: reportData.type as any,
        targetType: reportData.targetType as any,
        targetId: reportData.targetId,
        reason: reportData.reason as any,
        description: reportData.description,
        reporterId: reportData.reporterId,
        status: "PENDING",
        contentCheckResult: checkResult as any,
      },
    });

    // 记录不安全内容，用于后续分析
    await this.prisma.contentViolationLog.create({
      data: {
        reportId: report.id,
        content: reportData.content || "",
        contentType: "text",
        checkResult: {
          violations: checkResult.violations,
          riskLevel: checkResult.riskLevel,
          timestamp: new Date().toISOString(),
          checkType: "ai_content_safety"
        }
      }
    });
  }

  private async processAuditQueue(reportId: string) {
    // 异步处理审核队列
    // TODO: 实现审核队列逻辑
    console.log(`处理审核队列，举报ID: ${reportId}`);
  }

  async getAuditQueue() {
    // 获取审核队列
    return this.prisma.report.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        reporter: true,
      },
    });
  }
}
