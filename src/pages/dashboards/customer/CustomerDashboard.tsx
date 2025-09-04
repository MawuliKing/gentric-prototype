import React from 'react'
import { Card, Button, StatusBadge } from '../../../components'

export const CustomerDashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-success-500 to-success-600 rounded-lg p-8 text-white">
                <h1 className="text-heading-1 mb-2">Welcome back!</h1>
                <p className="text-lg opacity-90 mb-6">
                    You have 3 new reports ready and 2 templates to explore.
                </p>
                <div className="flex space-x-4">
                    <Button variant="secondary" size="md">
                        View Reports
                    </Button>
                    <Button variant="secondary" size="md">
                        Browse Templates
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-success-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-secondary-600">Total Reports</p>
                                <p className="text-2xl font-semibold text-secondary-900">24</p>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-secondary-600">This Month</p>
                                <p className="text-2xl font-semibold text-secondary-900">8</p>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-secondary-600">Favorites</p>
                                <p className="text-2xl font-semibold text-secondary-900">12</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-heading-3">Recent Reports</h3>
                            <Button variant="secondary" size="sm">View All</Button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-secondary-900">Monthly Sales Report</p>
                                    <p className="text-sm text-secondary-500">Generated 2 hours ago</p>
                                </div>
                                <StatusBadge status="success">Ready</StatusBadge>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-secondary-900">Customer Analytics</p>
                                    <p className="text-sm text-secondary-500">Generated 1 day ago</p>
                                </div>
                                <StatusBadge status="success">Ready</StatusBadge>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-secondary-900">Financial Summary</p>
                                    <p className="text-sm text-secondary-500">Generating...</p>
                                </div>
                                <StatusBadge status="warning">Processing</StatusBadge>
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
                                Create New Report
                            </Button>
                            <Button variant="secondary" size="md" className="w-full justify-start">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Browse Templates
                            </Button>
                            <Button variant="secondary" size="md" className="w-full justify-start">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View All Reports
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
