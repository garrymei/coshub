"use client";

import { useState, useEffect } from "react";

interface Report {
  id: string;
  type: string;
  targetType: string;
  targetId: string;
  reason: string;
  description: string;
  reporterName: string;
  status: "pending" | "processing" | "resolved" | "rejected";
  createdAt: Date;
  content?: string;
}

export default function ReportManagementPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "processing" | "resolved" | "rejected"
  >("all");

  // 模拟数据
  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: "1",
        type: "inappropriate_content",
        targetType: "post",
        targetId: "post1",
        reason: "不当内容",
        description: "这个帖子包含不当内容，违反了社区规定",
        reporterName: "用户001",
        status: "pending",
        createdAt: new Date("2024-01-15"),
        content: "这个帖子包含不当内容...",
      },
      {
        id: "2",
        type: "spam",
        targetType: "skill_post",
        targetId: "skill1",
        reason: "垃圾信息",
        description: "这是垃圾广告信息",
        reporterName: "用户002",
        status: "processing",
        createdAt: new Date("2024-01-14"),
        content: "垃圾广告内容...",
      },
    ];
    setReports(mockReports);
    setLoading(false);
  }, []);

  const handleProcess = async (id: string) => {
    // TODO: 调用API开始处理
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: "processing" } : report,
      ),
    );
  };

  const handleResolve = async (id: string) => {
    const action = prompt("请输入处理结果（如：已删除、已警告等）：");
    if (action) {
      // TODO: 调用API标记为已解决
      setReports((prev) =>
        prev.map((report) =>
          report.id === id ? { ...report, status: "resolved" } : report,
        ),
      );
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("请输入驳回原因：");
    if (reason) {
      // TODO: 调用API驳回举报
      setReports((prev) =>
        prev.map((report) =>
          report.id === id ? { ...report, status: "rejected" } : report,
        ),
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "待处理";
      case "processing":
        return "处理中";
      case "resolved":
        return "已解决";
      case "rejected":
        return "已驳回";
      default:
        return "未知";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "inappropriate_content":
        return "不当内容";
      case "spam":
        return "垃圾信息";
      case "harassment":
        return "骚扰行为";
      case "copyright_violation":
        return "版权侵犯";
      default:
        return type;
    }
  };

  const filteredReports = reports.filter((report) => {
    if (filter === "all") return true;
    return report.status === filter;
  });

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">举报处理</h1>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">全部</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="resolved">已解决</option>
            <option value="rejected">已驳回</option>
          </select>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {reports.length}
          </div>
          <div className="text-sm text-gray-600">总举报数</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {reports.filter((r) => r.status === "pending").length}
          </div>
          <div className="text-sm text-gray-600">待处理</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {reports.filter((r) => r.status === "processing").length}
          </div>
          <div className="text-sm text-gray-600">处理中</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {reports.filter((r) => r.status === "resolved").length}
          </div>
          <div className="text-sm text-gray-600">已解决</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {reports.filter((r) => r.status === "rejected").length}
          </div>
          <div className="text-sm text-gray-600">已驳回</div>
        </div>
      </div>

      {/* 举报列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                举报信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                举报人
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                举报类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                举报时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      举报目标:{" "}
                      {report.targetType === "post" ? "帖子" : "技能帖"} #
                      {report.targetId}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      原因: {report.reason}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                      描述: {report.description}
                    </div>
                    {report.content && (
                      <div className="text-sm text-gray-400 mt-1 max-w-xs truncate">
                        内容: {report.content}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.reporterName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {getTypeText(report.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}
                  >
                    {getStatusText(report.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {report.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {report.status === "pending" && (
                    <button
                      onClick={() => handleProcess(report.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      开始处理
                    </button>
                  )}
                  {report.status === "processing" && (
                    <>
                      <button
                        onClick={() => handleResolve(report.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        标记解决
                      </button>
                      <button
                        onClick={() => handleReject(report.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        驳回
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          没有找到符合条件的举报
        </div>
      )}
    </div>
  );
}
