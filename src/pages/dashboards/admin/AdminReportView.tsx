import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, StatusBadge, Modal, Textarea } from "../../../components";
import { useSubmittedReports } from "../../../hooks/useSubmittedReports";
import { apiService } from "../../../services/apiService";

export const AdminReportView: React.FC = () => {
    const { reportId, projectId } = useParams<{
        reportId: string;
        projectId: string;
    }>();
    const navigate = useNavigate();

    // Modal states
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [comments, setComments] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    // Action handlers
    const handleApprove = async () => {
        if (!reportId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiService.approveReport(reportId, comments);
            if (response.status) {
                setIsApproveModalOpen(false);
                setComments("");
                // Refresh the page to show updated status
                window.location.reload();
            } else {
                setError(response.message || "Failed to approve report");
            }
        } catch (err) {
            setError("An error occurred while approving the report");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!reportId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiService.rejectReport(reportId, comments);
            if (response.status) {
                setIsRejectModalOpen(false);
                setComments("");
                // Refresh the page to show updated status
                window.location.reload();
            } else {
                setError(response.message || "Failed to reject report");
            }
        } catch (err) {
            setError("An error occurred while rejecting the report");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!reportId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiService.deleteReport(reportId);
            if (response.status) {
                setIsDeleteModalOpen(false);
                // Navigate back to project details
                navigate(`/admin/projects/${projectId}`);
            } else {
                setError(response.message || "Failed to delete report");
            }
        } catch (err) {
            setError("An error occurred while deleting the report");
        } finally {
            setIsLoading(false);
        }
    };

    const resetModals = () => {
        setIsApproveModalOpen(false);
        setIsRejectModalOpen(false);
        setIsDeleteModalOpen(false);
        setComments("");
        setError(null);
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
            <Card className="p-6">
                <h2 className="text-heading-2 mb-4">Admin Actions</h2>
                {error && (
                    <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-md">
                        <p className="text-error-600 text-sm">{error}</p>
                    </div>
                )}
                <div className="flex space-x-4">
                    {report.status === 'SUBMITTED' && (
                        <>
                            <Button
                                variant="success"
                                onClick={() => setIsApproveModalOpen(true)}
                                disabled={isLoading}
                                className="flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Approve Report
                            </Button>
                            <Button
                                variant="error"
                                onClick={() => setIsRejectModalOpen(true)}
                                disabled={isLoading}
                                className="flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reject Report
                            </Button>
                        </>
                    )}
                    <Button
                        variant="secondary"
                        onClick={() => setIsDeleteModalOpen(true)}
                        disabled={isLoading}
                        className="flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Report
                    </Button>
                </div>
            </Card>

            {/* Approve Modal */}
            <Modal
                isOpen={isApproveModalOpen}
                onClose={resetModals}
                title="Approve Report"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-secondary-600">
                        Are you sure you want to approve this report? Please provide any comments below.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Approval Comments
                        </label>
                        <Textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Enter approval comments (optional)"
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="secondary"
                            onClick={resetModals}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleApprove}
                            disabled={isLoading}
                            className="flex items-center"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            Approve Report
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Reject Modal */}
            <Modal
                isOpen={isRejectModalOpen}
                onClose={resetModals}
                title="Reject Report"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-secondary-600">
                        Are you sure you want to reject this report? Please provide the reason for rejection below.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Rejection Comments <span className="text-error-500">*</span>
                        </label>
                        <Textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Enter reason for rejection"
                            rows={4}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="secondary"
                            onClick={resetModals}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="error"
                            onClick={handleReject}
                            disabled={isLoading || !comments.trim()}
                            className="flex items-center"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            Reject Report
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={resetModals}
                title="Delete Report"
                size="md"
            >
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-secondary-900">Delete Report</h3>
                            <p className="text-secondary-600">
                                This action cannot be undone. The report will be permanently deleted.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="secondary"
                            onClick={resetModals}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="error"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex items-center"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                            Delete Report
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
