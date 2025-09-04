import React from 'react'
import { Card, Button, StatusBadge } from '../../../components'

export const AgentDashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-heading-1 mb-2">Agent Dashboard</h1>
                <p className="text-body-large text-secondary-600">
                    Manage customer support tickets and provide excellent service.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-error-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-secondary-600">Open Tickets</p>
                                <p className="text-2xl font-semibold text-secondary-900">12</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-warning-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-secondary-600">In Progress</p>
                                <p className="text-2xl font-semibold text-secondary-900">8</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-success-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-secondary-600">Resolved Today</p>
                                <p className="text-2xl font-semibold text-secondary-900">15</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-secondary-600">Avg Response</p>
                                <p className="text-2xl font-semibold text-secondary-900">2.3m</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Tickets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-heading-3">Recent Tickets</h3>
                            <Button variant="secondary" size="sm">View All</Button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-secondary-900">#1234 - Login Issues</p>
                                    <p className="text-sm text-secondary-500">Customer: john@example.com</p>
                                </div>
                                <StatusBadge status="error">High</StatusBadge>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-secondary-900">#1233 - Report Generation</p>
                                    <p className="text-sm text-secondary-500">Customer: jane@example.com</p>
                                </div>
                                <StatusBadge status="warning">Medium</StatusBadge>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-secondary-900">#1232 - Billing Question</p>
                                    <p className="text-sm text-secondary-500">Customer: mike@example.com</p>
                                </div>
                                <StatusBadge status="success">Low</StatusBadge>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-heading-3">Quick Actions</h3>
                        </div>
                        <div className="space-y-4">
                            <Button variant="primary" size="md" className="w-full justify-start">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create New Ticket
                            </Button>
                            <Button variant="secondary" size="md" className="w-full justify-start">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                View Customers
                            </Button>
                            <Button variant="secondary" size="md" className="w-full justify-start">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                View Analytics
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
