import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, StatusBadge, Progress, Checkbox } from '../../../components'
import { useProjectDetails } from '../../../hooks/useProjectDetails'
import { useSubmittedReports } from '../../../hooks/useSubmittedReports'
import { generateProjectReportExcel } from '../../../utils/excelGenerator'

export const AdminProjectDetails: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>()
    const navigate = useNavigate()

    // State for selected reports
    const [selectedReports, setSelectedReports] = useState<string[]>([])

    // Fetch project details
    const {
        project,
        loading: projectLoading,
        error: projectError,
    } = useProjectDetails({
        projectId: projectId || '',
    })

    // Fetch submitted reports
    const {
        reports: submittedReports,
        loading: reportsLoading,
        error: reportsError,
    } = useSubmittedReports({
        projectId: projectId || '',
        page: 1,
        pageSize: 10,
    })

    if (projectLoading || reportsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (projectError || !project) {
        return (
            <div className="text-center py-12">
                <div className="text-secondary-500 mb-4">
                    {projectError || 'Project not found'}
                </div>
                <Button onClick={() => navigate('/admin/projects')}>
                    Back to Projects
                </Button>
            </div>
        )
    }

    if (reportsError) {
        console.error('Error loading submitted reports:', reportsError)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'APPROVED':
                return 'success'
            case 'REJECTED':
                return 'error'
            case 'PENDING':
                return 'warning'
            default:
                return 'info'
        }
    }

    // Handle checkbox selection
    const handleReportSelection = (reportId: string, isSelected: boolean) => {
        if (isSelected) {
            setSelectedReports(prev => [...prev, reportId])
        } else {
            setSelectedReports(prev => prev.filter(id => id !== reportId))
        }
    }

    // Handle select all checkbox
    const handleSelectAll = (isSelected: boolean) => {
        if (isSelected) {
            setSelectedReports(submittedReports.map(report => report.id))
        } else {
            setSelectedReports([])
        }
    }

    // Handle generate report
    const handleGenerateReport = () => {
        if (selectedReports.length === 0 || !project) return

        try {
            // Filter reports to only include selected ones
            const selectedReportData = submittedReports.filter(report =>
                selectedReports.includes(report.id)
            )

            // Generate Excel file with project and selected reports
            generateProjectReportExcel(project, selectedReportData)

            // Reset selection after generating
            setSelectedReports([])

        } catch (error) {
            console.error('Error generating Excel report:', error)
            alert('Failed to generate Excel report. Please try again.')
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/admin/projects')}
                        className="flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Projects
                    </Button>
                    <div>
                        <h1 className="text-heading-1">{project.name}</h1>
                        <p className="text-body-large text-secondary-600">
                            Project Details & Reports
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <StatusBadge
                        status={
                            project.status === 'ACTIVE' ? 'success' :
                                project.status === 'COMPLETED' ? 'info' :
                                    project.status === 'PENDING' ? 'warning' : 'error'
                        }
                    >
                        {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1).toLowerCase() : 'Pending'}
                    </StatusBadge>
                </div>
            </div>

            {/* Project Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Project Type */}
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Project Type</p>
                            <p className="text-lg font-semibold text-secondary-900">{project.projectType.name}</p>
                        </div>
                    </div>
                </Card>

                {/* Due Date */}
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-warning-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Due Date</p>
                            <p className="text-lg font-semibold text-secondary-900">
                                {project.dueDate ? formatDate(project.dueDate) : 'Not set'}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Total Reports */}
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-info-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-info-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Total Reports</p>
                            <p className="text-lg font-semibold text-secondary-900">
                                {project.reportProgress?.totalReports || 0}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Completion Rate */}
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-success-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Completion</p>
                            <p className="text-lg font-semibold text-secondary-900">
                                {project.reportProgress?.totalReports
                                    ? Math.round((project.reportProgress.completedReports / project.reportProgress.totalReports) * 100)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Project & Customer Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Information */}
                    <Card className="p-6">
                        <h2 className="text-heading-2 mb-4">Project Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">
                                    Project Name
                                </label>
                                <p className="text-secondary-900">{project.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">
                                    Description
                                </label>
                                <p className="text-secondary-900">{project.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                                        Created Date
                                    </label>
                                    <p className="text-secondary-900">{formatDate(project.createdAt)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                                        Last Updated
                                    </label>
                                    <p className="text-secondary-900">{formatDate(project.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Report Progress */}
                    <Card className="p-6">
                        <h2 className="text-heading-2 mb-4">Report Progress</h2>
                        {project.reportProgress && project.reportProgress.totalReports > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-secondary-700">Overall Progress</span>
                                    <span className="text-sm font-medium text-secondary-900">
                                        {project.reportProgress.completedReports}/{project.reportProgress.totalReports} reports
                                    </span>
                                </div>
                                <Progress
                                    value={(project.reportProgress.completedReports / project.reportProgress.totalReports) * 100}
                                    size="lg"
                                    className="w-full"
                                />
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-semibold text-success-600">
                                            {project.reportProgress.completedReports}
                                        </p>
                                        <p className="text-sm text-secondary-600">Completed</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-semibold text-warning-600">
                                            {project.reportProgress.inProgressReports}
                                        </p>
                                        <p className="text-sm text-secondary-600">In Progress</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-semibold text-secondary-600">
                                            {project.reportProgress.pendingReports}
                                        </p>
                                        <p className="text-sm text-secondary-600">Pending</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-secondary-500 mb-2">No reports yet</div>
                                <p className="text-sm text-secondary-400">Reports will appear here once they are submitted</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column - Agent & Customer Details */}
                <div className="space-y-6">
                    {/* Assigned Agent */}
                    <Card className="p-6">
                        <h2 className="text-heading-2 mb-4">Assigned Agent</h2>
                        {project.assignedAgent ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-primary-700">
                                            {project.assignedAgent.firstName.charAt(0)}{project.assignedAgent.lastName.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-secondary-900">
                                            {project.assignedAgent.fullName}
                                        </p>
                                        <p className="text-sm text-secondary-600">{project.assignedAgent.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700">Phone</label>
                                        <p className="text-sm text-secondary-900">{project.assignedAgent.phoneNumber}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700">Status</label>
                                        <StatusBadge
                                            status={project.assignedAgent.status === 'ACTIVE' ? 'success' : 'warning'}
                                        >
                                            {project.assignedAgent.status}
                                        </StatusBadge>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className="text-secondary-500 mb-2">No agent assigned</div>
                                <p className="text-sm text-secondary-400">This project has no assigned agent</p>
                            </div>
                        )}
                    </Card>

                    {/* Customer Information */}
                    <Card className="p-6">
                        <h2 className="text-heading-2 mb-4">Customer Information</h2>
                        {project.customer ? (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-info-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-info-700">
                                            {project.customer.firstName.charAt(0)}{project.customer.lastName.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-secondary-900">
                                            {project.customer.fullName}
                                        </p>
                                        <p className="text-sm text-secondary-600">{project.customer.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700">Phone</label>
                                        <p className="text-sm text-secondary-900">{project.customer.phoneNumber}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700">Status</label>
                                        <StatusBadge
                                            status={project.customer.status === 'ACTIVE' ? 'success' : 'warning'}
                                        >
                                            {project.customer.status}
                                        </StatusBadge>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className="text-secondary-500 mb-2">No customer assigned</div>
                                <p className="text-sm text-secondary-400">This project has no assigned customer</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Submitted Reports Section */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-heading-2">Submitted Reports</h2>
                        {submittedReports.length > 0 && (
                            <Checkbox
                                checked={selectedReports.length === submittedReports.length && submittedReports.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                label="Select All"
                                size="sm"
                            />
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        {selectedReports.length > 0 && (
                            <Button
                                variant="primary"
                                onClick={handleGenerateReport}
                                className="flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Generate Report ({selectedReports.length})
                            </Button>
                        )}
                        <div className="text-sm text-secondary-600">
                            {submittedReports.length} report{submittedReports.length !== 1 ? 's' : ''} submitted
                        </div>
                    </div>
                </div>

                {submittedReports.length > 0 ? (
                    <div className="space-y-4">
                        {submittedReports.map((report) => (
                            <div
                                key={report.id}
                                className="border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="mt-1">
                                            <Checkbox
                                                checked={selectedReports.includes(report.id)}
                                                onChange={(e) => handleReportSelection(report.id, e.target.checked)}
                                                size="sm"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <h3 className="text-heading-4 text-secondary-900">
                                                    Report #{report.id.slice(-8)}
                                                </h3>
                                                <StatusBadge status={getStatusColor(report.status)}>
                                                    {report.status.charAt(0).toUpperCase() + report.status.slice(1).toLowerCase()}
                                                </StatusBadge>
                                            </div>

                                            <p className="text-body text-secondary-600 mb-4">
                                                Submitted report with {report.reportData.length} section(s)
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary-500 mb-4">
                                                <div>
                                                    <span className="font-medium">Submitted:</span> {formatDateTime(report.createdAt)}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Last Updated:</span> {formatDateTime(report.updatedAt)}
                                                </div>
                                                {report.approvedAt && (
                                                    <div>
                                                        <span className="font-medium text-success-600">Approved:</span> {formatDateTime(report.approvedAt)}
                                                    </div>
                                                )}
                                                {report.rejectedAt && (
                                                    <div>
                                                        <span className="font-medium text-error-600">Rejected:</span> {formatDateTime(report.rejectedAt)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Approval/Rejection Comments */}
                                            {report.approvalComments && (
                                                <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-md">
                                                    <div className="text-sm">
                                                        <span className="font-medium text-success-700">Approval Comments:</span>
                                                        <p className="text-success-600 mt-1">{report.approvalComments}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {report.rejectionComments && (
                                                <div className="mt-3 p-3 bg-error-50 border border-error-200 rounded-md">
                                                    <div className="text-sm">
                                                        <span className="font-medium text-error-700">Rejection Comments:</span>
                                                        <p className="text-error-600 mt-1">{report.rejectionComments}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 ml-4">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => {
                                                navigate(`/admin/projects/${projectId}/reports/${report.id}/view`)
                                            }}
                                            className="flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Report
                                        </Button>

                                        {report.status === 'PENDING' && (
                                            <>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => {
                                                        // TODO: Approve report
                                                        console.log('Approve report:', report.id)
                                                    }}
                                                    className="flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="error"
                                                    size="sm"
                                                    onClick={() => {
                                                        // TODO: Reject report
                                                        console.log('Reject report:', report.id)
                                                    }}
                                                    className="flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-secondary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="text-secondary-500 mb-2">No reports submitted</div>
                        <p className="text-sm text-secondary-400">Reports will appear here once they are submitted by the assigned agent</p>
                    </div>
                )}
            </Card>
        </div>
    )
}