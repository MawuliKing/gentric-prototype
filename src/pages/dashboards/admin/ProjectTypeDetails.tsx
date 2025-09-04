import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Modal, ModalBody, ModalFooter, Input, StatusBadge } from '../../../components'

interface ProjectType {
    id: string
    name: string
    description: string
    status: 'active' | 'inactive'
    createdAt: string
    projectCount: number
}

interface ReportTemplate {
    id: string
    name: string
    description: string
    sections: ReportSection[]
    createdAt: string
}

interface ReportSection {
    id: string
    name: string
    fields: FormField[]
    order: number
}

interface FormField {
    id: string
    type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number'
    label: string
    required: boolean
    options?: string[] // For select, radio
    placeholder?: string
    order: number
}

export const ProjectTypeDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false)

    // Mock data - in real app, this would come from API
    const projectType: ProjectType = {
        id: id || '1',
        name: 'Web Development',
        description: 'Full-stack web applications and websites',
        status: 'active',
        createdAt: '2024-01-15',
        projectCount: 12
    }

    const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([
        {
            id: '1',
            name: 'Project Requirements',
            description: 'Template for gathering project requirements',
            sections: [
                {
                    id: '1',
                    name: 'Basic Information',
                    order: 1,
                    fields: [
                        { id: '1', type: 'text', label: 'Project Name', required: true, order: 1 },
                        { id: '2', type: 'textarea', label: 'Project Description', required: true, order: 2 },
                        { id: '3', type: 'select', label: 'Priority', required: true, options: ['Low', 'Medium', 'High'], order: 3 }
                    ]
                },
                {
                    id: '2',
                    name: 'Technical Details',
                    order: 2,
                    fields: [
                        { id: '4', type: 'select', label: 'Technology Stack', required: true, options: ['React', 'Vue', 'Angular'], order: 1 },
                        { id: '5', type: 'date', label: 'Deadline', required: true, order: 2 },
                        { id: '6', type: 'number', label: 'Estimated Hours', required: false, order: 3 }
                    ]
                }
            ],
            createdAt: '2024-01-15'
        },
        {
            id: '2',
            name: 'Progress Report',
            description: 'Weekly progress tracking template',
            sections: [
                {
                    id: '3',
                    name: 'Progress Summary',
                    order: 1,
                    fields: [
                        { id: '7', type: 'textarea', label: 'Completed Tasks', required: true, order: 1 },
                        { id: '8', type: 'textarea', label: 'In Progress Tasks', required: true, order: 2 },
                        { id: '9', type: 'textarea', label: 'Blockers/Issues', required: false, order: 3 }
                    ]
                }
            ],
            createdAt: '2024-01-10'
        }
    ])

    const [newReportTemplate, setNewReportTemplate] = useState({
        name: '',
        description: ''
    })

    const handleAddReportTemplate = () => {
        if (!newReportTemplate.name.trim()) return

        const template: ReportTemplate = {
            id: Date.now().toString(),
            name: newReportTemplate.name,
            description: newReportTemplate.description,
            sections: [],
            createdAt: new Date().toISOString().split('T')[0]
        }

        setReportTemplates([...reportTemplates, template])
        setNewReportTemplate({ name: '', description: '' })
        setIsAddReportModalOpen(false)
    }

    const handleEditReportTemplate = (template: ReportTemplate) => {
        // Navigate to the form builder page
        navigate(`/admin/project-types/${id}/templates/${template.id}/edit`)
    }

    const handleDeleteReportTemplate = (templateId: string) => {
        if (window.confirm('Are you sure you want to delete this report template?')) {
            setReportTemplates(reportTemplates.filter(t => t.id !== templateId))
        }
    }


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/admin/project-types')}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Project Types
                    </Button>
                    <div>
                        <h1 className="text-heading-1">{projectType.name}</h1>
                        <p className="text-body-large text-secondary-600">{projectType.description}</p>
                    </div>
                </div>
                <StatusBadge status={projectType.status === 'active' ? 'success' : 'warning'}>
                    {projectType.status === 'active' ? 'Active' : 'Inactive'}
                </StatusBadge>
            </div>

            {/* Project Type Details */}
            <Card>
                <div className="p-6">
                    <h2 className="text-heading-3 mb-4">Project Type Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-sm font-medium text-secondary-600">Created Date</label>
                            <p className="text-body text-secondary-900">
                                {new Date(projectType.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-secondary-600">Total Projects</label>
                            <p className="text-body text-secondary-900">{projectType.projectCount}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-secondary-600">Report Templates</label>
                            <p className="text-body text-secondary-900">{reportTemplates.length}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Report Templates Section */}
            <Card>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-heading-3">Report Templates</h2>
                        <Button
                            variant="primary"
                            onClick={() => setIsAddReportModalOpen(true)}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Report Template
                        </Button>
                    </div>

                    {reportTemplates.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-secondary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-6 h-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-body text-secondary-600 mb-4">No report templates found</p>
                            <Button
                                variant="primary"
                                onClick={() => setIsAddReportModalOpen(true)}
                            >
                                Create Your First Report Template
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reportTemplates.map((template) => (
                                <div key={template.id} className="border border-secondary-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="text-heading-4 text-secondary-900 mb-2">{template.name}</h3>
                                            <p className="text-body text-secondary-600 mb-3">{template.description}</p>
                                            <div className="flex items-center space-x-4 text-sm text-secondary-500">
                                                <span>{template.sections.length} sections</span>
                                                <span>{template.sections.reduce((acc, section) => acc + section.fields.length, 0)} fields</span>
                                                <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleEditReportTemplate(template)}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit Form
                                            </Button>
                                            <Button
                                                variant="error"
                                                size="sm"
                                                onClick={() => handleDeleteReportTemplate(template.id)}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* Add Report Template Modal */}
            <Modal
                isOpen={isAddReportModalOpen}
                onClose={() => {
                    setIsAddReportModalOpen(false)
                    setNewReportTemplate({ name: '', description: '' })
                }}
                title="Add New Report Template"
                size="md"
            >
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Template Name"
                            placeholder="Enter template name"
                            value={newReportTemplate.name}
                            onChange={(e) => setNewReportTemplate({ ...newReportTemplate, name: e.target.value })}
                            required
                        />
                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Enter template description"
                                value={newReportTemplate.description}
                                onChange={(e) => setNewReportTemplate({ ...newReportTemplate, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsAddReportModalOpen(false)
                            setNewReportTemplate({ name: '', description: '' })
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddReportTemplate}
                        disabled={!newReportTemplate.name.trim()}
                    >
                        Create Template
                    </Button>
                </ModalFooter>
            </Modal>

        </div>
    )
}
