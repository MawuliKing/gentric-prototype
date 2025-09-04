import React, { useState } from 'react'
import {
    Button,
    Card,
    CardHeader,
    CardContent,
    Input,
    Select,
    Textarea,
    Checkbox,
    RadioGroup,
    Dropdown,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
    Progress,
    CircularProgress,
    StatusBadge,
    DataTable
} from './index'

export const ComponentShowcase: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '',
        description: '',
        newsletter: false,
        priority: '',
        status: ''
    })

    const selectOptions = [
        { value: 'financial', label: 'Financial Report' },
        { value: 'operational', label: 'Operational Report' },
        { value: 'analytical', label: 'Analytical Report' },
        { value: 'compliance', label: 'Compliance Report' }
    ]

    const dropdownOptions = [
        { value: 'draft', label: 'Draft', icon: '📝' },
        { value: 'review', label: 'Under Review', icon: '👀' },
        { value: 'approved', label: 'Approved', icon: '✅' },
        { value: 'published', label: 'Published', icon: '📤' }
    ]

    const radioOptions = [
        { value: 'low', label: 'Low Priority' },
        { value: 'medium', label: 'Medium Priority' },
        { value: 'high', label: 'High Priority' },
        { value: 'urgent', label: 'Urgent' }
    ]

    const sampleData = [
        { id: 1, title: 'Q4 Financial Report', status: 'completed', progress: 100 },
        { id: 2, title: 'Monthly Operations', status: 'in-progress', progress: 75 },
        { id: 3, title: 'Compliance Audit', status: 'pending', progress: 25 }
    ]

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-display mb-2">Component Showcase</h1>
                <p className="text-body-large text-secondary-600">
                    A comprehensive collection of form and UI components for your report generation application.
                </p>
            </div>

            {/* Buttons */}
            <Card>
                <CardHeader>
                    <h2 className="text-heading-2">Buttons</h2>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="success">Success</Button>
                        <Button variant="warning">Warning</Button>
                        <Button variant="error">Error</Button>
                        <Button variant="primary" size="sm">Small</Button>
                        <Button variant="primary" size="lg">Large</Button>
                        <Button variant="primary" disabled>Disabled</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Form Components */}
            <Card>
                <CardHeader>
                    <h2 className="text-heading-2">Form Components</h2>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Input
                                label="Report Name"
                                placeholder="Enter report name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                leftIcon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="user@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                helperText="We'll send notifications to this email"
                            />

                            <Select
                                label="Report Category"
                                options={selectOptions}
                                placeholder="Select a category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />

                            <Dropdown
                                label="Status"
                                options={dropdownOptions}
                                placeholder="Select status"
                                value={formData.status}
                                onChange={(value) => setFormData({ ...formData, status: value as string })}
                            />
                        </div>

                        <div className="space-y-4">
                            <Textarea
                                label="Description"
                                placeholder="Describe your report..."
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />

                            <RadioGroup
                                name="priority"
                                label="Priority Level"
                                options={radioOptions}
                                value={formData.priority}
                                onChange={(value) => setFormData({ ...formData, priority: value as string })}
                            />

                            <Checkbox
                                label="Subscribe to email notifications"
                                checked={formData.newsletter}
                                onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status and Progress */}
            <Card>
                <CardHeader>
                    <h2 className="text-heading-2">Status & Progress</h2>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-heading-3 mb-4">Status Badges</h3>
                            <div className="flex flex-wrap gap-3">
                                <StatusBadge status="success">Completed</StatusBadge>
                                <StatusBadge status="warning">In Progress</StatusBadge>
                                <StatusBadge status="error">Failed</StatusBadge>
                                <StatusBadge status="info">Draft</StatusBadge>
                                <StatusBadge status="pending">Pending</StatusBadge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-heading-3 mb-4">Progress Bars</h3>
                            <div className="space-y-4">
                                <Progress value={75} label="Report Generation" showLabel />
                                <Progress value={45} variant="warning" label="Data Processing" showLabel />
                                <Progress value={90} variant="success" label="Final Review" showLabel />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-heading-3 mb-4">Circular Progress</h3>
                            <div className="flex gap-8">
                                <CircularProgress value={75} label="Overall Progress" />
                                <CircularProgress value={45} variant="warning" size="lg" label="Data Sync" />
                                <CircularProgress value={90} variant="success" size="sm" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
                <CardHeader>
                    <h2 className="text-heading-2">Alerts</h2>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Alert type="success" title="Report Generated Successfully">
                            Your financial report has been generated and is ready for download.
                        </Alert>
                        <Alert type="warning" title="Data Processing Warning">
                            Some data points are missing from the last 24 hours. Please review before finalizing.
                        </Alert>
                        <Alert type="error" title="Generation Failed">
                            Unable to generate report due to insufficient data. Please check your data sources.
                        </Alert>
                        <Alert type="info" title="New Feature Available">
                            You can now export reports in PDF and Excel formats.
                        </Alert>
                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card>
                <CardHeader>
                    <h2 className="text-heading-2">Data Table</h2>
                </CardHeader>
                <CardContent>
                    <DataTable
                        data={sampleData}
                        columns={[
                            {
                                key: 'id',
                                title: 'ID',
                                width: '80px',
                                render: (value) => <span className="text-caption">#{value}</span>
                            },
                            {
                                key: 'title',
                                title: 'Report Title',
                                render: (value) => <span className="font-medium text-secondary-800">{value}</span>
                            },
                            {
                                key: 'status',
                                title: 'Status',
                                width: '120px',
                                render: (value) => (
                                    <StatusBadge status={value === 'completed' ? 'success' : value === 'in-progress' ? 'warning' : 'pending'}>
                                        {value}
                                    </StatusBadge>
                                )
                            },
                            {
                                key: 'progress',
                                title: 'Progress',
                                width: '150px',
                                render: (value) => <Progress value={value} size="sm" showLabel />
                            },
                            {
                                key: 'actions',
                                title: 'Actions',
                                width: '200px',
                                render: () => (
                                    <div className="flex space-x-2">
                                        <Button variant="secondary" size="sm">View</Button>
                                        <Button variant="primary" size="sm">Export</Button>
                                    </div>
                                )
                            }
                        ]}
                    />
                </CardContent>
            </Card>

            {/* Modal Example */}
            <Card>
                <CardHeader>
                    <h2 className="text-heading-2">Modal</h2>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => setIsModalOpen(true)}>
                        Open Modal
                    </Button>
                </CardContent>
            </Card>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Report"
                size="lg"
            >
                <ModalHeader>
                    <p className="text-body text-secondary-600">
                        Configure your new report settings and parameters.
                    </p>
                </ModalHeader>

                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Report Name"
                            placeholder="Enter report name"
                        />
                        <Select
                            label="Template"
                            options={selectOptions}
                            placeholder="Select a template"
                        />
                        <Textarea
                            label="Description"
                            placeholder="Describe your report..."
                            rows={3}
                        />
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                        Create Report
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
