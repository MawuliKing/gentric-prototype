import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, StatusBadge, Progress, Button, Tabs } from "../../../components";
import { useProjectDetails } from "../../../hooks/useProjectDetails";
import type { Project } from "../../../types/api";

// Mock submitted reports - in real app this would come from API
const mockSubmittedReports = [
  {
    id: "submitted-1",
    name: "Initial Assessment Report",
    description:
      "Complete initial assessment of the project requirements and scope",
    submittedAt: "2024-01-14",
    status: "SUBMITTED",
    template: {
      id: "1",
      name: "Initial Assessment",
      description: "Template for initial project assessment",
      sections: [],
    },
  },
  {
    id: "submitted-2",
    name: "Progress Report - Week 1",
    description: "Weekly progress update for the first week of work",
    submittedAt: "2024-01-21",
    status: "SUBMITTED",
    template: {
      id: "2",
      name: "Weekly Progress",
      description: "Template for weekly progress reports",
      sections: [],
    },
  },
];

const getMockDueDate = (index: number) => {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + index * 7 + 3); // Future due dates
  return dueDate.toISOString().split("T")[0];
};

export const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // Fetch project details
  const {
    project,
    loading: projectLoading,
    error: projectError,
  } = useProjectDetails({
    projectId: projectId || "",
  });

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="text-center py-12">
        <div className="text-secondary-500 mb-4">
          {projectError || "Project not found"}
        </div>
        <Button onClick={() => navigate("/agent/projects")}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/agent/projects")}
            className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
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
          </button>
          <div>
            <h1 className="text-heading-1 mb-2">{project.name}</h1>
            <p className="text-body-large text-secondary-600">
              Project details and report management
            </p>
          </div>
        </div>
        <StatusBadge
          status={
            project.status === "ACTIVE"
              ? "success"
              : project.status === "COMPLETED"
              ? "info"
              : project.status === "PENDING"
              ? "warning"
              : "error"
          }
        >
          {project.status
            ? project.status.charAt(0).toUpperCase() +
              project.status.slice(1).toLowerCase()
            : "Pending"}
        </StatusBadge>
      </div>

      {/* Project Details and Reports with Tabs */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-heading-2">Project Overview</h2>
        </div>

        <Tabs
          tabs={[
            {
              id: "details",
              label: "Project Details",
              content: (
                <div className="space-y-6">
                  {/* Project Information */}
                  <div>
                    <h3 className="text-heading-3 mb-4">Project Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Project Type
                        </label>
                        <p className="text-secondary-900">
                          {project.projectType.name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Customer
                        </label>
                        <p className="text-secondary-900">
                          {project.customer?.fullName || "Unassigned"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Due Date
                        </label>
                        <p className="text-secondary-900">
                          {project.dueDate
                            ? formatDate(project.dueDate)
                            : "Not set"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Created
                        </label>
                        <p className="text-secondary-900">
                          {formatDate(project.createdAt)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Last Updated
                        </label>
                        <p className="text-secondary-900">
                          {formatDate(project.updatedAt)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Assigned Agent
                        </label>
                        <p className="text-secondary-900">
                          {project.assignedAgent?.fullName || "Unassigned"}
                        </p>
                      </div>
                    </div>
                    {project.description && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Description
                        </label>
                        <p className="text-secondary-900 bg-secondary-50 p-4 rounded-lg">
                          {project.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Project Progress Overview */}
                  <div>
                    <h3 className="text-heading-3 mb-4">Project Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-secondary-900 mb-1">
                          {project.reportProgress?.totalReports || 0}
                        </div>
                        <div className="text-sm text-secondary-600">
                          Total Reports
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-success-600 mb-1">
                          {project.reportProgress?.completedReports || 0}
                        </div>
                        <div className="text-sm text-secondary-600">
                          Completed
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-info-600 mb-1">
                          {project.reportProgress?.inProgressReports || 0}
                        </div>
                        <div className="text-sm text-secondary-600">
                          In Progress
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-warning-600 mb-1">
                          {project.reportProgress?.pendingReports || 0}
                        </div>
                        <div className="text-sm text-secondary-600">
                          Pending
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-secondary-700">
                          Overall Progress
                        </span>
                        <span className="text-sm text-secondary-600">
                          {project.reportProgress?.totalReports
                            ? Math.round(
                                ((project.reportProgress?.completedReports ||
                                  0) /
                                  project.reportProgress.totalReports) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          project.reportProgress?.totalReports
                            ? ((project.reportProgress?.completedReports || 0) /
                                project.reportProgress.totalReports) *
                              100
                            : 0
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: "pending",
              label: "Available Reports",
              count: project.projectType.reports?.length || 0,
              content: (
                <div className="space-y-4">
                  {project.projectType.reports?.map((report, index) => {
                    const dueDate = getMockDueDate(index);

                    return (
                      <div
                        key={report.id}
                        className="border border-secondary-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-heading-4 text-secondary-900 mb-2">
                              {report.name}
                            </h3>
                            <p className="text-body text-secondary-600 mb-3">
                              {report.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-secondary-500">
                              <span>
                                {report.sections?.length || 0} sections
                              </span>
                              <span>
                                {report.sections?.reduce(
                                  (acc: number, section: any) =>
                                    acc + section.fields.length,
                                  0
                                ) || 0}{" "}
                                fields
                              </span>
                              <span>Due {formatDate(dueDate)}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                // TODO: Navigate to report form
                                console.log("Submit report:", report.id);
                              }}
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              Submit Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }) || []}

                  {(!project.projectType.reports ||
                    project.projectType.reports.length === 0) && (
                    <div className="text-center py-8">
                      <div className="text-secondary-500 mb-4">
                        No reports assigned to this project
                      </div>
                      <p className="text-sm text-secondary-400">
                        Contact your administrator to get reports assigned to
                        this project.
                      </p>
                    </div>
                  )}
                </div>
              ),
            },
            {
              id: "submitted",
              label: "Submitted Reports",
              count: mockSubmittedReports.length,
              content: (
                <div className="space-y-4">
                  {mockSubmittedReports.map((report) => (
                    <div
                      key={report.id}
                      className="border border-secondary-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-heading-4 text-secondary-900 mb-2">
                            {report.name}
                          </h3>
                          <p className="text-body text-secondary-600 mb-3">
                            {report.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-secondary-500">
                            <span>
                              Submitted {formatDate(report.submittedAt)}
                            </span>
                            <span>Template: {report.template.name}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              // TODO: Navigate to view submitted report
                              console.log("View submitted report:", report.id);
                            }}
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {mockSubmittedReports.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-secondary-500 mb-4">
                        No reports submitted yet
                      </div>
                      <p className="text-sm text-secondary-400">
                        Submit reports using the forms above to see them here.
                      </p>
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};
