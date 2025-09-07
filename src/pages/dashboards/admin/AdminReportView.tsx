import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, StatusBadge } from "../../../components";
import { useSubmittedReports } from "../../../hooks/useSubmittedReports";

export const AdminReportView: React.FC = () => {
    const { reportId, projectId } = useParams<{
        reportId: string;
        projectId: string;
    }>();
    const navigate = useNavigate();

    // Fetch submitted reports to find the specific report
    const {
        reports: submittedReports,
        loading: reportsLoading,
        error: reportsError,
    } = useSubmittedReports({
        projectId: projectId || "",
        page: 1,
        pageSize: 100, // Get all reports to find the specific one
    });

    const report = submittedReports.find((r) => r.id === reportId);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case "SUBMITTED":
                return "info";
            case "APPROVED":
                return "success";
            case "REJECTED":
                return "error";
            case "PENDING":
                return "warning";
            default:
                return "info";
        }
    };

    if (reportsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (reportsError || !report) {
        return (
            <div className="text-center py-12">
                <div className="text-secondary-500 mb-4">
                    {reportsError || "Report not found"}
                </div>
                <Button onClick={() => navigate(`/admin/projects/${projectId}`)}>
                    Back to Project
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="secondary"
                        onClick={() => navigate(`/admin/projects/${projectId}`)}
                        className="flex items-center"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Project
                    </Button>
                    <div>
                        <h1 className="text-heading-1 mb-2">Report Submission</h1>
                        <p className="text-body-large text-secondary-600">
                            View submitted report details
                        </p>
                    </div>
                </div>
                <StatusBadge status={getStatusColor(report.status)}>
                    {report.status}
                </StatusBadge>
            </div>

            {/* Report Information */}
            <Card className="p-6">
                <h2 className="text-heading-2 mb-4">Report Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Submitted Date
                        </label>
                        <p className="text-secondary-900">{formatDate(report.createdAt)}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Last Updated
                        </label>
                        <p className="text-secondary-900">{formatDate(report.updatedAt)}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Status
                        </label>
                        <StatusBadge status={getStatusColor(report.status)}>
                            {report.status}
                        </StatusBadge>
                    </div>
                    {report.approvedAt && (
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                Approved Date
                            </label>
                            <p className="text-success-600">
                                {formatDate(report.approvedAt)}
                            </p>
                        </div>
                    )}
                    {report.rejectedAt && (
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">
                                Rejected Date
                            </label>
                            <p className="text-error-600">{formatDate(report.rejectedAt)}</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                            Project
                        </label>
                        <p className="text-secondary-900">{report.project.name}</p>
                    </div>
                </div>

                {/* Comments */}
                {(report.approvalComments || report.rejectionComments) && (
                    <div className="mt-6 space-y-4">
                        {report.approvalComments && (
                            <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                                <h3 className="text-sm font-medium text-success-800 mb-2">
                                    Approval Comments
                                </h3>
                                <p className="text-sm text-success-700">
                                    {report.approvalComments}
                                </p>
                            </div>
                        )}
                        {report.rejectionComments && (
                            <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                                <h3 className="text-sm font-medium text-error-800 mb-2">
                                    Rejection Comments
                                </h3>
                                <p className="text-sm text-error-700">
                                    {report.rejectionComments}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Report Data */}
            <Card className="p-6">
                <h2 className="text-heading-2 mb-4">Report Data</h2>
                <div className="space-y-6">
                    {report.reportData.map((section) => (
                        <div
                            key={section.id}
                            className="border-b border-secondary-200 pb-6 last:border-b-0"
                        >
                            <h3 className="text-heading-3 text-secondary-900 mb-4">
                                {section.name}
                            </h3>
                            {section.description && section.description !== section.name && (
                                <p className="text-sm text-secondary-600 mb-4">
                                    {section.description}
                                </p>
                            )}
                            <div className="space-y-4">
                                {section.data.map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        <label className="block text-sm font-medium text-secondary-700">
                                            {field.name}
                                            <span className="text-xs text-secondary-500 ml-2">
                                                ({field.type})
                                            </span>
                                        </label>
                                        <div className="p-3 bg-secondary-50 border border-secondary-200 rounded-md">
                                            {field.type === "image" ? (
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={field.value}
                                                        alt="Submitted image"
                                                        className="max-h-32 rounded-md"
                                                    />
                                                    <div>
                                                        <p className="text-sm text-secondary-600">
                                                            Image attachment
                                                        </p>
                                                        <a
                                                            href={field.value}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-primary-600 hover:text-primary-700"
                                                        >
                                                            View full size
                                                        </a>
                                                    </div>
                                                </div>
                                            ) : field.type === "boolean" ||
                                                field.type === "checkbox" ? (
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${field.value === "true"
                                                        ? "bg-success-100 text-success-800"
                                                        : "bg-secondary-100 text-secondary-800"
                                                        }`}
                                                >
                                                    {field.value === "true" ? "Yes" : "No"}
                                                </span>
                                            ) : field.type === "textarea" ? (
                                                <pre className="whitespace-pre-wrap text-sm text-secondary-900">
                                                    {field.value}
                                                </pre>
                                            ) : (
                                                <p className="text-sm text-secondary-900">
                                                    {field.value}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>


            {/* Admin Actions */}
            {report.status === 'PENDING' && (
                <Card className="p-6">
                    <h2 className="text-heading-2 mb-4">Admin Actions</h2>
                    <div className="flex space-x-4">
                        <Button
                            variant="success"
                            onClick={() => {
                                // TODO: Implement approve functionality
                                console.log('Approve report:', report.id);
                            }}
                            className="flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve Report
                        </Button>
                        <Button
                            variant="error"
                            onClick={() => {
                                // TODO: Implement reject functionality
                                console.log('Reject report:', report.id);
                            }}
                            className="flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject Report
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};
