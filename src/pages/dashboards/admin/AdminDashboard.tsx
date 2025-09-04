import React from 'react'
import { Card, StatusBadge } from '../../../components'

export const AdminDashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-heading-1 mb-2">Admin Dashboard</h1>
                <p className="text-body-large text-secondary-600">
                    Manage your organization's reports, users, and system settings.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Total Users</p>
                            <p className="text-2xl font-semibold text-secondary-900">1,234</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-success-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Reports Generated</p>
                            <p className="text-2xl font-semibold text-secondary-900">5,678</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-warning-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">Active Sessions</p>
                            <p className="text-2xl font-semibold text-secondary-900">89</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-error-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-secondary-600">System Alerts</p>
                            <p className="text-2xl font-semibold text-secondary-900">3</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <div className="p-6">
                        <h3 className="text-heading-3 mb-4">Recent Users</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-primary-700">JD</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-secondary-900">John Doe</p>
                                        <p className="text-sm text-secondary-500">john@example.com</p>
                                    </div>
                                </div>
                                <StatusBadge status="success">Active</StatusBadge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-success-700">JS</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-secondary-900">Jane Smith</p>
                                        <p className="text-sm text-secondary-500">jane@example.com</p>
                                    </div>
                                </div>
                                <StatusBadge status="success">Active</StatusBadge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-warning-700">MJ</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-secondary-900">Mike Johnson</p>
                                        <p className="text-sm text-secondary-500">mike@example.com</p>
                                    </div>
                                </div>
                                <StatusBadge status="warning">Pending</StatusBadge>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <h3 className="text-heading-3 mb-4">System Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-secondary-900">Database</span>
                                <StatusBadge status="success">Healthy</StatusBadge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-secondary-900">API Server</span>
                                <StatusBadge status="success">Healthy</StatusBadge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-secondary-900">File Storage</span>
                                <StatusBadge status="warning">Warning</StatusBadge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-secondary-900">Email Service</span>
                                <StatusBadge status="error">Down</StatusBadge>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
